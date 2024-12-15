const mongoose = require('mongoose')
require('dotenv').config()
const dbConnect = async () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('Connected to MongoDB')
    }).catch((e) => {
        console.error('Error connecting to MongoDB:', e)
        process.exit(1)
    })
}

module.exports = dbConnect