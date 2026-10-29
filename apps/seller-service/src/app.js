import express from 'express'
import cors from "cors"
import { FRONTEND_URL } from './config/env.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import notFoundMiddleware from './middleware/notFound.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';
import sellerRouter from './routes/seller.routes.js';

const app = express();

app.use(requestIdMiddleware)
app.use(loggerMiddleware)

app.use(express.json());
app.use(cors({
    origin : FRONTEND_URL || "http://localhost:5173",
    credentials : true
}))

app.get("/health", (req, res)=>{
    return res.status(200).json({
        success : true,
        service : "seller-service",
        message : "Anvaya seller service is healthy"
    })
})

app.use("/api/sellers", sellerRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app