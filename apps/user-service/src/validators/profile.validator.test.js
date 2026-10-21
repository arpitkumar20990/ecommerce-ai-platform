import { describe, it, expect } from "vitest";
import { profileSchema } from "./profile.validator.js";

describe("Profile Validator", () => {
    it("should accept valid profile data", () => {
        const result = profileSchema.safeParse({
            firstName: "Arpit",
            lastName: "Kumar",
            phone: "9876543210"
        });

        expect(result.success).toBe(true);
    });

    it("should reject an empty object", () => {
        const result = profileSchema.safeParse({});

        expect(result.success).toBe(false);
    });

    it("should reject an unknown field", () => {
        const result = profileSchema.safeParse({
            firstName: "Arpit",
            email: "arpit@example.com"
        });

        expect(result.success).toBe(false);
    });

    it("should reject an empty first name", () => {
        const result = profileSchema.safeParse({
            firstName: "   "
        });

        expect(result.success).toBe(false);
    });

    it("should reject an invalid avatar URL", () => {
        const result = profileSchema.safeParse({
            avatarUrl: "not-a-valid-url"
        });

        expect(result.success).toBe(false);
    });
});
