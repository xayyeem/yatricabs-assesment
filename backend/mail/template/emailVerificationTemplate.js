exports.otpTemplate = ({ email, otp }) => {
	return `
    <html>
        <head>
            <meta charset="UTF-8">
            <title>OTP Verification Email</title>
        </head>
        <body>
            <h2>Hello, ${email}</h2>
            <p>Your OTP for verification is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 5 minutes.</p>
        </body>
    </html>
    `;
};
