import express from 'express'
import internalAuthMiddleware from '../middleware/internal-auth.middleware.js'
import validateMiddleware from '../middleware/validate.middleware.js'
import { applySellerSchema, updateSellerSchema } from '../validators/seller.validate.js'
import { applySeller, getMySellerProfile, updateMySellerProfile } from '../controllers/seller.controller.js'

const sellerRouter = express.Router()

sellerRouter.post("/apply",
    internalAuthMiddleware, 
    validateMiddleware(applySellerSchema), 
    applySeller 
)

sellerRouter.get("/me",
    internalAuthMiddleware,
    getMySellerProfile
)

sellerRouter.patch("/me",
    internalAuthMiddleware,
    validateMiddleware(updateSellerSchema),
    updateMySellerProfile
)

export default sellerRouter