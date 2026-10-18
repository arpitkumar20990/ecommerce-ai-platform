import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js'
import { generateAccessToken } from '../utils/jwt.js';
import { generateRefreshToken, hashRefreshToken } from '../utils/refresh-token.js';
import { use } from 'react';
const registerSchema = z.object({
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    password: z.string().min(6).max(72),
});

export const registerUser = async (req, res, next) => {
    try {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration data",
                errors: validation.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }))
            })
        }

        const { email, password } = validation.data;

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.authUser.create({
            data: {
                email,
                passwordHash
            },
            select: {
                id: true,
                email: true,
                status: true,
                createdAt: true,
            }
        })

        return res.status(201).json({
            success: true,
            message: "User registerd successfully",
            data: user
        })


    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            })
        }
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            })
        }

        const { email, password } = result.data;

        const user = await prisma.authUser.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash)

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Account is not active"
            })
        }

        const refreshToken = generateRefreshToken();
        const tokenHash = hashRefreshToken(refreshToken);
        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )

        await prisma.refreshToken.create({
            data: {
                tokenHash,
                userId: user.id,
                expiresAt
            },
            select: {
                id: true,
                userId: true,
                createdAt: true
            }
        })

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        const accessToken = generateAccessToken(user.id)

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    status: user.status
                },

            }
        })

    } catch (error) {
        next(error)
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refresh_token
        if (refreshToken) {
            const tokenHash = hashRefreshToken(refreshToken)
            const tokenInfo = await prisma.refreshToken.findUnique({
                where: { tokenHash }
            })

            if (tokenInfo && tokenInfo.revokedAt === null) {
            await prisma.refreshToken.update({
                where: { id: tokenInfo.id },
                data: { revokedAt: new Date() }
            })
        }
        }

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: process.env.COOKIE_SAME_SITE || "lax",
        })

        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: process.env.COOKIE_SAME_SITE || "lax",
        })

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        })
    } catch (error) {
        next(error);
    }
}

export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refresh_token
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            })
        }

        const tokenHash = hashRefreshToken(refreshToken);

        const tokenInfo = await prisma.refreshToken.findUnique({
            where: { tokenHash }
        })

        if (!tokenInfo) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            })
        }

        if (tokenInfo.revokedAt) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        if (tokenInfo.expiresAt <= new Date()) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        const user = await prisma.authUser.findUnique({
            where: { id: tokenInfo.userId }
        })

        if (!user || user.status !== "ACTIVE") {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            })
        }

        const accessToken = generateAccessToken(user.id);

        const newRefreshToken = generateRefreshToken();
        const newTokenHash = hashRefreshToken(newRefreshToken);

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )

        const now = new Date();
        await prisma.$transaction(async (tx) => {
            const result = await tx.refreshToken.updateMany({
                where: {
                    id: tokenInfo.id,
                    revokedAt: null,
                    expiresAt: { gt: now }
                },
                data: {
                    revokedAt: now
                }
            })


            if (result.count !== 1) {
                throw new Error("REFRESH_TOKEN_NOT_ROTATABLE");
            }

            await tx.refreshToken.create({
                data: {
                    tokenHash: newTokenHash,
                    userId: user.id,
                    expiresAt
                }
            })
        })

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        })

        res.cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    status: user.status
                }
            }
        });

    } catch (error) {
        next(error);
    }
}