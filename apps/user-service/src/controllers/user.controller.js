import { prisma } from "../config/prisma";


export const getMyProfile = async(req, res, next)=>{
    try{
        const authUserId = req.user.id;

        const profile = await prisma.userProfile.findUnique({
            where : {authUserId}
        })

        if(!profile){
            return res.status(404).json({
                success : true,
                message : "User Profile not found"
            })
        }

        return res.status(200).json({
            success : true,
            data : profile,
        });
    }catch(error){
        next(error);
    }
}