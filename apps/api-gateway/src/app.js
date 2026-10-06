import express from 'express'
import cors from 'cors'
import errorMiddleware from './middleware/error.middleware.js';
import notFoundMiddleware from './middleware/notFound.middleware.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';
import authRouter from './routes/auth.routes.js';


const app = express();
app.use(requestIdMiddleware)
app.use(loggerMiddleware)

app.use(cors())
app.use(express.json());

app.use("/api/auth", authRouter)


app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app;