import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 5000
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL

export {
    PORT,
    AUTH_SERVICE_URL    
};