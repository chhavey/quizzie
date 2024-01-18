// Middleware function to handle errors
const errorHandler = (res, error) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        status: statusCode,
        message: 'Internal Server Error'
    });
};

module.exports = errorHandler;