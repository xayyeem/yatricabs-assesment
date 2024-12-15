const nodemailer = require('nodemailer');
require('dotenv').config()

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        })

        let info = await transporter.sendMail({
            from: `"yatriCabs" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            text: body
        })
        console.log('Sent mail ', info)
        return info
    } catch (error) {
        console.error('Error sending mail', error.message)
        throw error
    }
}

module.exports = mailSender