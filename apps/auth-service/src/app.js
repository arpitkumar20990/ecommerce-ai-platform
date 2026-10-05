import express from 'express';
import cors from 'cors'

const app = express();

app.use(cors)
app.use(express.json());

app.get("/health", (req,res)=>{
    res.status(200).json({
        success : "true",
        service : "auth-service",
        message : "Anvaya Auth Service is healthy"
    })
})

export default app;