import express from 'express'
import cors from 'cors'
import errorMiddleware from './middleware/error.middleware.js';
import notFoundMiddleware from './middleware/notFound.middleware.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';


const app = express();

app.use(requestIdMiddleware)
app.use(loggerMiddleware)

app.use(cors({
    origin : process.env.FRONTEND_URL || "http://localhost:5173",
    credentials : true,
}))
app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)



app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;