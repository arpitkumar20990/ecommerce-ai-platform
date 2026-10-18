import {Router} from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.get('/logout', logoutUser)
authRouter.post('/refresh', refreshAccessToken)

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