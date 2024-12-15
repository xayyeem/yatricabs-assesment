const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../model/user')

exports.auth = async (req, res, next) => {
    try {
        const token = req.body.token || req.cookies.token
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized access',
                success: false
            })
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (error) {
        res.status(403).json({
            message: 'Invalid token',
            success: false
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.body.email })
        if (userDetails.role !== 'admin') {
            return res.status(403).json({
                message: 'Unauthorized access this is for admin only',
                success: false
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            success: false
        })
    }
}


exports.isUser = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.body.email })
        if (userDetails.role !== 'user') {
            return res.status(403).json({
                message: 'Unauthorized access this is for users only',
                success: false
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            success: false
        })
    }
} 