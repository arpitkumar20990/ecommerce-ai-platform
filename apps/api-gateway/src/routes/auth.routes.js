import express from "express";
import { AUTH_SERVICE_URL } from "../config/env.js";

const authRouter = express.Router();

authRouter.get('/health', async (req, res, next)=>{
    try{

        const url = `${AUTH_SERVICE_URL}/health`

        const response = await fetch(url,{
            headers : {
                "x-request-id" : req.requestId
            }
        });

        const data = await response.json();

        res.status(response.status).json(data);

    } catch(error){
        next(error)
    }
})

authRouter.post("/register" ,async (req, res, next)=>{
    try {
        const response = await fetch(
            `${AUTH_SERVICE_URL}/api/auth/register`,
            {
                method : "POST",
                headers:{
                    "Content-Type":"application/json",
                    "x-request-id" : req.requestId
                },
                body : JSON.stringify(req.body)
            }
        )

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
})

export default authRouter;