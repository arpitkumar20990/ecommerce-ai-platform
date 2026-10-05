import {randomUUID} from 'node:crypto'

const requestIdMiddleware = (req, res, next)=>{
    const existingId = req.headers["x-request-id"]

    const requestId = existingId || randomUUID();
    req.requestId = requestId;

    res.setHeader("x-request-id", requestId)

    next();
}

export default requestIdMiddleware;