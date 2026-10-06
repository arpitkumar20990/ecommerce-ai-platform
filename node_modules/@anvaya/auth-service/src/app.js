import express from 'express';
import cors from 'cors'
import errorMiddleware from './middleware/error.middleware.js';
import notFoundMiddleware from './middleware/notFound.middleware.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';
import loggerMiddleware from './middleware/logger.middleware.js';

const app = express();

app.use(cors())
app.use(express.json());

app.use(requestIdMiddleware)
app.use(loggerMiddleware)

app.get("/health", (req,res)=>{
    res.status(200).json({
        success : "true",
        service : "auth-service",
        message : "Anvaya Auth Service is healthy"
    })
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;