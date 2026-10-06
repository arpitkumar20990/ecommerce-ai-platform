import express from "express";
import { AUTH_SERVICE_URL } from "../config/env.js";

const authRouter = express.Router();

authRouter.get('/health', async (req, res, next)=>{
    try{

        const url = `${AUTH_SERVICE_URL}/health`

        const response = await fetch(url);

        const data = await response.json();

        res.status(response.status).json(data);

    } catch(error){
        next(error)
    }
})

export default authRouter;