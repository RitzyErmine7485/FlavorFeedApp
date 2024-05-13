// Imports
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Connection
connectDB()

// Routes
const recipeRoutes = require('./routes/recipeRoutes')
app.use('/recipes', recipeRoutes)

const userRoutes = require('./routes/userRoutes')
app.use('/users', userRoutes)

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})