import express from 'express'
import cors from 'cors'
import errorMiddleware from './middleware/error.middleware.js';
import notFoundMiddleware from './middleware/notFound.middleware.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';


const app = express();
app.use(requestIdMiddleware)
app.use(loggerMiddleware)

app.use(cors())
app.use(express.json());

app.get("/health", (req,res)=>{
    res.status(200).json({
        success : true,
        service : "api-gateway",
        message : "Anvaya Api gateway is healthy"
    })
})

// app.get("/test-error",(req,res,next)=>{
//     const error = new Error("hey Arpit it is error")
//     next(error);
// })
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;