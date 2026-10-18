import "dotenv/config"
import express from "express"
import cors from "cors"
import userRouter from "./routes/user.routes"
import requestIdMiddleware from "./middleware/requestId.middleware"
import loggerMiddleware from "./middleware/logger.middleware"
import notFoundMiddleware from "./middleware/notFound.middleware"
import errorMiddleware from "./middleware/error.middleware"

const app = express()

app.use(requestIdMiddleware)
app.use(loggerMiddleware)

app.use(express.json())
app.use(cors({
    origin : process.env.FRONTEND_URL || "http://localhost:5173",
    credentials : true
}))

app.use("api/user", userRouter)
app.get("/health" , (req, res)=>{
    return res.status(200).json({
        success : true,
        service : "user-service",
        message : "Anvaya user service is healthy"
    })
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app