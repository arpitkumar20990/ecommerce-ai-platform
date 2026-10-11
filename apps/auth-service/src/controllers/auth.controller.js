import {z} from 'zod';
import bcrypt from 'bcrypt';
import {prisma} from '../config/prisma.js'

const registerSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(6).max(72),
});

export const registerUser = async(req, res, next)=>{
    try {
        const validation = registerSchema.safeParse(req.body);
        if(!validation.success){
            return res.status(400).json({
                success : false,
                message : "Invalid registration data",
                errors: validation.error.issues.map((issue)=>({
                    field : issue.path.join("."),
                    message: issue.message,
                }))
            })
        }

        const {email, password} = validation.data;

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.authUser.create({
            data : {
                email,
                passwordHash
            },
            select : {
                id : true,
                email : true,
                status : true,
                createdAt : true,
            }
        })

        return res.status(201).json({
            success : true,
            message : "User registerd successfully",
            data : user
        })


    } catch (error) {
        if(error.code === "P2002"){
            return res.status(409).json({
                success : false,
                message : "An account with this email already exists"
            })
        }
        next(error)
    }
}