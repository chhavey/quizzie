const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel');

//Middleware function to handle jwt authorization
const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            status: 'FAILED',
            message: 'Unauthorized'
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decode);
        // req.body.user = decode.user;
        const user = await User.findById(decode.userId); // Fetching user based on decoded user ID
        if (!user) {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Unauthorized'
            });
        }

        req.body.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            status: 'FAILED',
            message: 'Unauthorized'
        })
    }
}

module.exports = requireAuth;