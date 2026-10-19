import { Router } from "express"
import { AUTH_SERVICE_URL, SERVICE_SECRET, USER_SERVICE_URL } from "../config/env.js";

const userRouter = Router()

userRouter.get("/me", async (req, res, next) => {

    try {
        console.log("USER /me ROUTE HIT");
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

        const userResponse = await fetch(
            `${USER_SERVICE_URL}/api/users/me`,
            {
                method: "GET",
                headers: {
                    "x-internal-service-secret":SERVICE_SECRET,
                    "x-authenticated-user-id": userId,
                    "x-request-id": req.requestId || ""
                }
            }
        );


     
        const data = await userResponse.json();
        return res.status(userResponse.status).json(data);
        

    } catch (error) {
        next(error);
    }
})


export default userRouter