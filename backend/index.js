const express = require('express')
const app = express()
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/profileRoute')
const db = require('./config/db')
require('dotenv').config()
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000
// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// api
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    db()
})