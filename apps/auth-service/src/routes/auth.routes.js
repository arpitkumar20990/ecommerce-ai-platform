import {Router} from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import { success } from "zod";

const authRouter = Router();

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.get('/logout', logoutUser)

authRouter.get('/me', authMiddleware, (req,res)=>{
    return res.status(200).json({
        success : true,
        message : "Authenticated user",
        data : {
            userId : req.user.id
        }
    })
})
export default authRouter;