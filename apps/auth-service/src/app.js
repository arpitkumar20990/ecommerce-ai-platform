import express from 'express';
import cors from 'cors'
import errorMiddleware from './middleware/error.middleware.js';
import notFoundMiddleware from './middleware/notFound.middleware.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import { prisma } from './config/prisma.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin : process.env.FRONTEND_URL || "http://localhost:5173",
    credentials : true
}))
app.use(express.json());
app.use(cookieParser())

app.use(requestIdMiddleware)
app.use(loggerMiddleware)

app.use('/api/auth', authRouter)

app.get("/health", (req,res)=>{
    res.status(200).json({
        success : "true",
        service : "auth-service",
        message : "Anvaya Auth Service is healthy"
    })
})

app.get("/ready", async(req,res)=>{
    try {
        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({
            success : true,
            service : "auth-service",
            database : "connected"
        })
    } catch (error) {
        return res.status(503).json({
            success : false,
            service : "auth-service",
            database : "unavailable"
        })
    }
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;