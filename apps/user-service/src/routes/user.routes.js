import {Router} from "express"
import { getMyProfile } from "../controllers/user.controller";

const userRouter = Router();

userRoute.post('/me' , getMyProfile)


export default userRouter