const express = require('express')

const router = express.Router()

// Middleware to check if the user is authenticated

const { auth, isUser, isAdmin } = require('../middleware/authMiddleware')
const { sendOtp, signUp, login, logout } = require('../controller/authController')
// Route 

router.post('/sendotp', sendOtp)
router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', auth, logout)

module.exports = router