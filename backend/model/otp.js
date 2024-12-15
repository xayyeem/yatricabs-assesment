const mongoose = require('mongoose');
const { otpTemplate } = require('../mail/template/emailVerificationTemplate')
const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5
    }
})

// function to send otp 

async function sendVerificationMail(email, otp) {
    try {
        // otp ko template mai karna hai
        const mailResponse = await mailSender(email, 'Verification Message', otpTemplate(otp))
        console.log('OTP sent successfully', mailResponse);
    } catch (error) {
        console.error('Error sending OTP', error);
    }
}

// pre save function 

otpSchema.pre('save', async function (next) {
    // only send email when new data is created
    // The pre-save hook is correct and will only send an email when a new OTP document is created (this.isNew ensures that).
    if (this.isNew) {
        await sendVerificationMail(this.email, this.otp)
    }
    next()
})

const OTP = mongoose.model('OTP', otpSchema)

module.exports = OTP;