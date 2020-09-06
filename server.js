const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

require('dotenv').config()
const secretKey = process.env.JWT_SECRET

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser(secretKey))


// SignUp Route from signupRoute.js
const signupRoute = require('./Routes/signupRoute')
app.use('/', signupRoute)

// Post Route from postRoute.js
const postRoute = require('./Routes/postRoute')
app.use('/', postRoute)

// User Route from userRoute.js
const userRoute = require('./Routes/userRoute')
app.use('/', userRoute)




// Connecting Database with our server
const {DBConnection} = require('./DBConnection/dbConnection')
DBConnection()


const PORT = process.env.PORT || 3001
app.listen( PORT, () => console.log("Listening to Port "+ PORT))