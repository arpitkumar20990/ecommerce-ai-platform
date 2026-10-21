import {describe, it, expect} from "vitest"
import request from "supertest"
import app from "./app.js"

describe("User service health Check", ()=>{
    it("Should return when service is healthy", async()=>{
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.service).toBe("user-service");
    })
})