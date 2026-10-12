import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId) => {
        return jwt.sign(
            {id : userId},
            process.env.JWT_SECRET,
            {
                expiresIn : 7*24*60*60*1000,
                issuer : "anvaya-auth",
                audience : "anvaya-api"
            }
        )
}