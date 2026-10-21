const errorMiddleware = (error, req, res, next)=>{
    console.error("User Service Error:", {
        requestId: req.requestId,
        message: error.message
    });

    if (res.headersSent) {
        return next(error);
    }
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
        success : false,
        message : error.message || "Internal server error"
    })

  
}

export default errorMiddleware