const errorMiddleware = (error, req, res, next)=>{
    const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status : false,
            message : error.message || "Internal server error"
        })
}

export default errorMiddleware