const express = require('express')

const router = express.Router()

// Middleware to check if the user is authenticated

const { auth, isUser, isAdmin } = require('../middleware/authMiddleware')
const { sendOtp, signup, login } = require('../controller/authController')
// Route 

router.post('/sendotp', sendOtp)
router.post('/signup', signup)
router.post('/login', login)

module.exports = router