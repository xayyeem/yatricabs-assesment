const express = require('express')
const app = express()
const authRoute = require('./routes/authRoute')
const db = require('./config/db')
require('dotenv').config()

const PORT = process.env.PORT || 3000
// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// api
app.use('/api/v1/user', authRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    db()
})