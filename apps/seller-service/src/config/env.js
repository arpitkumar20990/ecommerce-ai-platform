import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 5003;
const FRONTEND_URL = process.env.FRONTEND_URL ||"http://localhost:5173" 
const SERVICE_SECRET = process.env.SERVICE_SECRET
const DATABASE_URL  = process.env.DATABASE_URL


export  {
    PORT,
    FRONTEND_URL,
    SERVICE_SECRET,
    DATABASE_URL
}