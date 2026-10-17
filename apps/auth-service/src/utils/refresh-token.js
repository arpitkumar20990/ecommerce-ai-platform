import {randomBytes, createHash} from 'node:crypto'



export const hashRefreshToken = (token)=>{
    const hash = createHash("sha256")
    .update(token)
    .digest("hex")

    return hash
} 

export const generateRefreshToken = ()=>{
    const token = randomBytes(32).toString("hex");
    return token
}
