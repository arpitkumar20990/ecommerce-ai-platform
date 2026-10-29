
import { afterEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

async function createTestApp() {
    // Set the secret before importing the middleware
    vi.stubEnv("SERVICE_SECRET", "test-secret");

    // Reload modules so env.js reads the test secret
    vi.resetModules();

    const { default: internalAuthMiddleware } = await import(
        "./internal-auth.middleware.js"
    );

    const app = express();

    app.get(
        "/protected",
        internalAuthMiddleware,
        (req, res) => {
            return res.status(200).json({
                success: true,
                userId: req.user.id
            });
        }
    );

    return app;
}

describe("Internal Auth Middleware", () => {
    it("allows a request with valid credentials", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .get("/protected")
            .set("x-internal-service-secret", "test-secret")
            .set("x-authenticated-user-id", "user-123");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            userId: "user-123"
        });
    });

    it("rejects an incorrect service secret", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .get("/protected")
            .set("x-internal-service-secret", "wrong-secret")
            .set("x-authenticated-user-id", "user-123");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "Unauthorized service request"
        );
    });

    it("rejects a missing service secret", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .get("/protected")
            .set("x-authenticated-user-id", "user-123");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "Unauthorized service request"
        );
    });

    it("rejects a missing user ID", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .get("/protected")
            .set("x-internal-service-secret", "test-secret");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "Authenticated user ID is missing"
        );
    });

    it("rejects an empty user ID", async () => {
        const app = await createTestApp();

        const response = await request(app)
            .get("/protected")
            .set("x-internal-service-secret", "test-secret")
            .set("x-authenticated-user-id", "   ");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "Authenticated user ID is missing"
        );
    });
});
