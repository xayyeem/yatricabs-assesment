const User = require('../model/user')
const OTP = require('../model/otp')
const mailSender = require('../config/mailSender')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const { otpTemplate } = require('../mail/template/emailVerificationTemplate')
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const isPresent = await User.findOne({ email });
        if (isPresent) {
            return res.status(400).json({
                message: 'User already exists',
                success: false
            });
        }

        let otp;
        let result;

        // Ensure the OTP is unique
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        } while (result);

        // OTP data
        const otpPayload = { email, otp };
        const htmlContent = otpTemplate(otpPayload);
        console.log("Generated OTP Payload:", otpPayload); // Log OTP Payload for debugging

        // Save OTP to DB
        const otpInstance = new OTP({
            email,
            otp,
        });
        await otpInstance.save();

        // Send OTP via email
        const sended = await mailSender(email, 'Verification Mail', htmlContent);
        console.log("OTP sent response:", sended); // Log the response from mailSender

        res.status(200).json({
            message: 'OTP sent successfully',
            success: true
        });
    } catch (error) {
        console.error('Error sending OTP', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};



// signup

exports.signup = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, role, otp } = req.body;

        // Validate fields
        if (!name || !email || !password || !phoneNumber || !role || !otp) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        // Check if user already exists
        const isPresent = await User.findOne({ email });
        if (isPresent) {
            return res.status(400).json({
                message: 'User already exists',
                success: false
            });
        }

        // Find most recent OTP
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log('Recent OTP:', recentOtp);  // Log OTP from DB
        console.log('Provided OTP:', otp);  // Log OTP from request

        if (!recentOtp || recentOtp.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP',
                success: false
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role
        });

        return res.status(200).json({
            message: 'User created successfully',
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error creating user', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        }

        // Generate JWT
        const userPayload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.status(200).cookie('token', token, options).json({
            message: 'User logged in successfully',
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};
