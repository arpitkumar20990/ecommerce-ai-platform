import {Router} from "express"
import { getMyProfile } from "../controllers/user.controller.js";
import internalAuthMiddleware from "../middleware/internal-auth.middleware.js";

const userRouter = Router();

userRouter.get('/me' ,internalAuthMiddleware , getMyProfile)
userRouter.patch('/me' )


export default userRouter