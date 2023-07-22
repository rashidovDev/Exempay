require('dotenv').config()
const express = require("express");
const path = require('path');
const app = express();
const cors = require("cors")
const {logger} = require("./middleware/logEvents")
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require("./config/corsOptions")
const cookieParser = require("cookie-parser")
const subdir = require('./routes/subdir');
const connectDB = require('./config/dbConn')
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger)

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirenment
app.use(credentials)

//Cross origin Resource Sharing
app.use(cors(corsOptions))
 
// built-in middleware to handle urlencoded data
// in other words, form data
// "content-type: application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended : false})) 

//built-in middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

//serve static files 
app.use('/', express.static(path.join(__dirname, '/public')))
// app.use('/subdir', express.static(path.join(__dirname, '/public')))

// routes 
app.use('/', require('./routes/root'))
// app.use('/subdir', require('./routes/subdir'))
app.use("/register", require("./routes/register"))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(require("./middleware/verifyJWT"))
app.use('/employees', require('./routes/api/employees'))


// app.get("/hello(.html)?", (req, res, next) => {
//     console.log("Attempted to load hello.html");
//     next()
// }, (req, res) => {
//     res.send("Hello world")
// })

//Chaining route handlers

app.all('*', (req, res) => {

    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if(req.accepts('json')) {
        res.json({ error : "404 not found"})
    }else {
    res.type('txt').send("404 not found")
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
})


























// https://rt.pornhub.com/view_video.php?viewkey=ph6148c372e6ed7