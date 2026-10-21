import {describe, it, expect, vi, beforeEach} from "vitest"

vi.mock("../config/prisma.js", ()=>({
    prisma : {
        userProfile:{
            findUnique : vi.fn(),
            upsert: vi.fn()
        }
    }
}))