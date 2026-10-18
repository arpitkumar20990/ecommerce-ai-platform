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

authRouter.post("/login" ,async (req, res, next)=>{
    try {
        const response = await fetch(
            `${AUTH_SERVICE_URL}/api/auth/login`,
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

        const setCookies = response.headers.getSetCookie();

        if(setCookies.length > 0){
            res.setHeader("Set-Cookie", setCookies);
        }

        res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
})

authRouter.get("/me", async(req, res, next)=>{
    try {
        const response = await fetch(
            `${AUTH_SERVICE_URL}/api/auth/me`,
            {
                method : "GET",
                headers : {
                    cookie : req.headers.cookie || "",
                    "x-request-id" : req.requestId
                }
            }
        )

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
})

authRouter.post("/logout", async (req, res, next) => {
  try {
    const response = await fetch(
      `${AUTH_SERVICE_URL}/api/auth/logout`,
      {
        method: "GET",
        headers: {
          cookie: req.headers.cookie || "",
          "x-request-id": req.requestId,
        },
      }
    );

    const setCookies = response.headers.getSetCookie();

    if (setCookies.length > 0) {
      res.setHeader("Set-Cookie", setCookies);
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh", async(req, res, next)=>{
    try {
        const response = await fetch(
            `${AUTH_SERVICE_URL}/api/auth/refresh`,
            {
                method : "POST",
                headers:{
                    "Content-Type":"application/json",
                    cookie: req.headers.cookie || "",
                    "x-request-id" : req.requestId
                },
                body : JSON.stringify(req.body)
            }
        )

        const data = await response.json();

        const setCookies = response.headers.getSetCookie();

        if(setCookies.length > 0){
            res.setHeader("Set-Cookie", setCookies);
        }

        res.status(response.status).json(data);
    } catch (error) {
        next(error);
    }
})

export default authRouter;