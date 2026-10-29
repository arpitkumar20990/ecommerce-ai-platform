import express from "express";
import { SELLER_SERVICE_URL, AUTH_SERVICE_URL, SERVICE_SECRET } from "../config/env.js";

const sellerRouter = express.Router();

sellerRouter.post("/apply", async (req, res, next) => {

    try {
        const authResponse = await fetch(
            `${AUTH_SERVICE_URL}/api/auth/me`,
            {
                method: "GET",
                headers: {
                    cookie: req.headers.cookie || "",
                    "x-request-id": req.requestId
                }
            }
        )

        const authData = await authResponse.json();
        if (!authResponse.ok) {
            return res.status(authResponse.status).json(authData)
        }
        const userId = authData.data?.userId
        if (!userId) {
            return res.status(502).json({
                success: false,
                message: "Auth Service did not return a user identity"
            })
        }

        const sellerResponse = await fetch(
            `${SELLER_SERVICE_URL}/api/sellers/apply`,
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "x-internal-service-secret":SERVICE_SECRET,
                    "x-authenticated-user-id": userId,
                    "x-request-id": req.requestId || ""
                },
                body : JSON.stringify(req.body)
            }
        );


     
        const data = await sellerResponse.json();
        return res.status(sellerResponse.status).json(data);
        

    } catch (error) {
        next(error);
    }
})

sellerRouter.get("/me", async (req, res, next) => {

    try {
        const authResponse = await fetch(
            `${AUTH_SERVICE_URL}/api/auth/me`,
            {
                method: "GET",
                headers: {
                    cookie: req.headers.cookie || "",
                    "x-request-id": req.requestId
                }
            }
        )

        const authData = await authResponse.json();
        if (!authResponse.ok) {
            return res.status(authResponse.status).json(authData)
        }
        const userId = authData.data?.userId
        if (!userId) {
            return res.status(502).json({
                success: false,
                message: "Auth Service did not return a user identity"
            })
        }

        const sellerResponse = await fetch(
            `${SELLER_SERVICE_URL}/api/sellers/me`,
            {
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                    "x-internal-service-secret":SERVICE_SECRET,
                    "x-authenticated-user-id": userId,
                    "x-request-id": req.requestId || ""
                },
                body : JSON.stringify(req.body)
            }
        );


     
        const data = await sellerResponse.json();
        return res.status(sellerResponse.status).json(data);
        

    } catch (error) {
        next(error);
    }
})

sellerRouter.patch("/me", async (req, res, next) => {

    try {
        const authResponse = await fetch(
            `${AUTH_SERVICE_URL}/api/auth/me`,
            {
                method: "GET",
                headers: {
                    cookie: req.headers.cookie || "",
                    "x-request-id": req.requestId
                }
            }
        )

        const authData = await authResponse.json();
        if (!authResponse.ok) {
            return res.status(authResponse.status).json(authData)
        }
        const userId = authData.data?.userId
        if (!userId) {
            return res.status(502).json({
                success: false,
                message: "Auth Service did not return a user identity"
            })
        }
        
        const sellerResponse = await fetch(
            `${SELLER_SERVICE_URL}/api/sellers/me`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "x-internal-service-secret":SERVICE_SECRET,
                    "x-authenticated-user-id": userId,
                    "x-request-id": req.requestId || ""
                },
                body : JSON.stringify(req.body)
            }
        );


        
        const data = await sellerResponse.json();
        return res.status(sellerResponse.status).json(data);
        

    } catch (error) {
        next(error);
    }
})



export default sellerRouter