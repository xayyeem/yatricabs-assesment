const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../model/user')

exports.auth = async (req, res, next) => {
    try {
        // Check token in cookiesr
        const token = req.cookies.token;
        console.log('Received token:', token);

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized access, token is required',
                success: false
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        console.error('Authentication error', error); 
        return res.status(403).json({
            message: 'Invalid or expired token',
            success: false
        });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });

        if (userDetails.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for admin",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `Admin Role Can't be Verified` });
    }
};


exports.isUser = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });

        if (userDetails.role !== "user") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for user",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};