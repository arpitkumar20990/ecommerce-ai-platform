import { SERVICE_SECRET } from "../config/env.js"

const internalAuthMiddleware = (req, res, next) => {

    try {
        const secret = req.get("x-internal-service-secret")
        const userId = req.get("x-authenticated-user-id")


        if (!SERVICE_SECRET || secret !== SERVICE_SECRET) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized service request"
            })
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authenticated user identity is missing"

            })
        }

        req.user = { id: userId };
        next()

    } catch (error) {
        next(error)
    }

}

export default internalAuthMiddleware