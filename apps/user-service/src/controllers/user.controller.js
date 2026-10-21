import { success } from "zod";
import { prisma } from "../config/prisma.js";
import { profileSchema } from "../validators/profile.validator.js";

const getProfileCompletion = (profile)=>{
    const requiredFields = [
        profile.firstName,
        profile.lastName,
        profile.phone
    ]

    const completedFields = requiredFields.filter(
        (value) => typeof value === "string" && value.trim().length>0
    ).length

    return {
        isCompleted : completedFields===requiredFields.length,
        completedFields,
        totalFields: requiredFields.length,
        percentage : Math.round(
            (completedFields/requiredFields.length)*100
        )
    }
}


export const getMyProfile = async(req, res, next)=>{
    try{
        const authUserId = req.user.id;

        const profile = await prisma.userProfile.findUnique({
            where : {authUserId}
        })

        if(!profile){
            return res.status(404).json({
                success : false,
                message : "User Profile not found"
            })
        }

        const completion = getProfileCompletion(profile);

        return res.status(200).json({
            success : true,
            data : {
                profile,
                completion
            },
        });
        
    }catch(error){
        next(error);
    }
}

export const updateMyProfile = async(req, res, next)=>{
    try {
        const validation = profileSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile data",
                errors: validation.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }))
            })
        }
        const authUserId = req.user.id
        const profileData = validation.data;

        const profile = await prisma.userProfile.upsert({
            where : {
                authUserId : authUserId
            },
            create : {
                authUserId : authUserId,
                ...profileData
            },
            update : profileData
        })

        const completion = getProfileCompletion(profile)

        return res.status(200).json({
            success  :true,
            message : "Profile saved successfully",
            data : {
                profile,
                completion
            }
        })

    } catch (error) {
        next(error);
    }
}