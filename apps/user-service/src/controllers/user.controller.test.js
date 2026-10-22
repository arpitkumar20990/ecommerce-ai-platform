import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../config/prisma.js", () => ({
    prisma: {
        userProfile: {
            findUnique: vi.fn(),
            upsert: vi.fn()
        }
    }
}));

import { prisma } from "../config/prisma.js";
import {
    getMyProfile,
    updateMyProfile
} from "./user.controller.js";

const createMocks = () => {
    const req = {
        user: { id: "user-123" },
        body: {}
    };

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis()
    };

    const next = vi.fn();

    return { req, res, next };
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getMyProfile", () => {
    it("should return profile and completion on success", async () => {
        const profile = {
            id: "profile-1",
            authUserId: "user-123",
            firstName: "Arpit",
            lastName: "Kumar",
            phone: "9876543210",
            avatarUrl: null
        };

        prisma.userProfile.findUnique.mockResolvedValue(profile);

        const { req, res, next } = createMocks();

        await getMyProfile(req, res, next);

        expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
            where: { authUserId: "user-123" }
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    profile,
                    completion: expect.objectContaining({
                        isCompleted: true,
                        completedFields: 3,
                        totalFields: 3,
                        percentage: 100
                    })
                })
            })
        );

        expect(next).not.toHaveBeenCalled();
    });

    it("should return 404 when profile does not exist", async () => {
        prisma.userProfile.findUnique.mockResolvedValue(null);

        const { req, res, next } = createMocks();

        await getMyProfile(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "User profile not found"
        });

        expect(next).not.toHaveBeenCalled();
    });


    it("should forward database errors to error middleware", async () => {
        const error = new Error("Database connection failed");

        prisma.userProfile.findUnique.mockRejectedValue(error);

        const { req, res, next } = createMocks();

        await getMyProfile(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

});

describe("updateMyProfile", () => {
    it("should reject invalid profile data", async () => {
        const { req, res, next } = createMocks();
        req.body = {};

        await updateMyProfile(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "Invalid profile data",
                errors: expect.any(Array)
            })
        );

        expect(prisma.userProfile.upsert).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should save valid profile data", async () => {
        const profile = {
            id: "profile-1",
            authUserId: "user-123",
            firstName: "Arpit",
            lastName: null,
            phone: null,
            avatarUrl: null
        };

        const { req, res, next } = createMocks();
        req.body = { firstName: "Arpit" };

        prisma.userProfile.upsert.mockResolvedValue(profile);

        await updateMyProfile(req, res, next);

        expect(prisma.userProfile.upsert).toHaveBeenCalledWith({
            where: { authUserId: "user-123" },
            create: {
                authUserId: "user-123",
                firstName: "Arpit"
            },
            update: {
                firstName: "Arpit"
            }
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: "Profile saved successfully",
                data: expect.objectContaining({
                    profile,
                    completion: expect.objectContaining({
                        isCompleted: false,
                        completedFields: 1,
                        totalFields: 3,
                        percentage: 33
                    })
                })
            })
        );

        expect(next).not.toHaveBeenCalled();
    });

    it("should forward database errors when saving profile", async () => {
        const error = new Error("Database connection failed");

        prisma.userProfile.upsert.mockRejectedValue(error);

        const { req, res, next } = createMocks();
        req.body = { firstName: "Arpit" };

        await updateMyProfile(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

});
