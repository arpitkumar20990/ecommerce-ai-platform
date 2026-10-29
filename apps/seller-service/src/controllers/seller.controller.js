import { prisma } from '../config/prisma.js'

export const applySeller = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { storeName, description } = req.validatedBody;

        const existingSeller = await prisma.seller.findUnique({
            where: {
                authUserId: userId
            }
        })

        if (existingSeller) {
            return res.status(409).json({
                success: false,
                message: "You already have a seller application"
            })
        }

        const seller = await prisma.seller.create({
            data: {
                authUserId: userId,
                storeName,
                description

            },
            select: {
                id: true,
                storeName: true,
                description: true,
                status: true,
                createdAt: true
            }
        })

        return res.status(201).json({
            success: true,
            message: "Seller application submitted successfully",
            data: seller
        })

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Store name or seller application already exists",
                requestId: req.requestId
            });
        }

        return next(error);
    }
}

export const getMySellerProfile = async (req, res, next) => {
    try {
        const userId = req.user.id
        const seller = await prisma.seller.findUnique({
            where: {
                authUserId: userId
            },
            select: {
                id: true,
                storeName: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller profile not found. Please apply first."
            })
        }

        return res.status(200).json({
            succes: true,
            message: "Seller profile found successfully",
            data: seller
        })
    } catch (error) {
        next(error)
    }
}

export const updateMySellerProfile = async (req, res, next) => {

    try {

        
        const userId = req.user.id
        const updateData = req.validatedBody

        const existingSeller = await prisma.seller.findUnique({
            where: {
                authUserId: userId
            }
        })

        if (!existingSeller) {
            return res(404).json({
                success: false,
                message: "Seller profile not found. Please apply first."
            })
        }

        
        const seller = await prisma.seller.update({
            where: {
                authUserId: userId
            },
            data: updateData,
            select: {
                id: true,
                storeName: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return res.status(200).json({
            success: true,
            message: "Seller profile updated successfully",
            data: seller
        })

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "This store name is already taken",
                requestId: req.requestId
            });
        }

        return next(error);
    }


}