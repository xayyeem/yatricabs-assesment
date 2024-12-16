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
        const sended = await mailSender(email, 'Verification Mail', htmlContent);

        console.log(sended);

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

exports.signUp = async (req, res) => {
    try {
        // data fetched from req body
        const { name, email, password, phoneNumber, role, otp } = req.body;

        // check validation
        if (!name || !email || !password || !phoneNumber || !role || !otp) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }


        // check if the user already exists (case insensitive check)
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(403).json({
                message: 'User already exists',
                success: false
            });
        }

        // find most recent OTP for the user
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log('Recent OTP:', recentOTP);
        // validate OTP
        if (!recentOTP) {
            return res.status(400).json({
                message: 'OTP not found',
                success: false
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log('Hashed Password:', hashedPassword);


        // create user entry in the database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role
        });

        // return successful response
        return res.status(200).json({
            message: 'User created successfully',
            success: true,
            data: user
        });

    } catch (error) {
        console.log('Failed to create user', error.message);
        return res.status(500).json({
            message: 'Failed to create user',
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

exports.logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token', { httpOnly: true }).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.error('Error logging out', error)
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}