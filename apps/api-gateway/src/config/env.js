import  'dotenv/config'

const PORT = process.env.PORT || 5000
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL
const USER_SERVICE_URL = process.env.USER_SERVICE_URL
const SELLER_SERVICE_URL = process.env.SELLER_SERVICE_URL
const SERVICE_SECRET = process.env.SERVICE_SECRET

export {
    PORT,
    AUTH_SERVICE_URL,
    USER_SERVICE_URL,
    SELLER_SERVICE_URL,
    SERVICE_SECRET
};