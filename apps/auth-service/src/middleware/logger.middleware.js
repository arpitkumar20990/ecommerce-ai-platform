const loggerMiddleware = (req, res, next)=>{
    const method = req.method;
    const url = req.originalUrl;

    console.log(`[${req.requestId} ${method} ${url}]`)
    next()
}

export default loggerMiddleware 