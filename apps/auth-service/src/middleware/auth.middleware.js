import jwt from "jsonwebtoken"

const authMiddleware = (req,res,next)=>{
    try {
        const token = req.cookies?.access_token;

        if(!token){
            return res.status(401).json({
                success : false,
                message : "Authentication required"
            })
        }

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                issuer : "anvaya-auth",
                audience : "anvaya-api"
            }
        )

        req.user = {
            id : payload.id
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success : false,
            message : "Invalid or expired authentication"
        })
    }
}

export default authMiddleware;