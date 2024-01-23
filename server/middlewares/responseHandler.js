// Middleware for consistent response structure
const handleResponse = (res, status, message, data = null) => {
    const response = {
        status: (status === 200 || status === 201) ? 'SUCCESS' : 'FAILED',
        message,
    };
    if (data !== null) {
        response.data = data;
    }
    res.status(status).json(response);
};

module.exports = handleResponse;