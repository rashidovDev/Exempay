const express = require("express");
const path = require('path');
const app = express();
const cors = require("cors")
const {logger,logEvents} = require("./middleware/logEvents")
const PORT = process.env.PORT || 3000

// custom middleware logger
app.use(logger)

//Cross origin 
app.use(cors())

// built-in middleware to handle urlencoded data
// in other words, form data
// "content-type: application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended : false})) 

//built-in middleware for json
app.use(express.json())

//serve static files 
app.use(express.static(path.join(__dirname, '/public')))


app.get("^/$|/index(.html)?", (req, res) => {
    // res.sendFile('./views/index.html', { root : __dirname});
    res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.get("/hello", (req, res) => {
    console.log("Hello World")
})

app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html")) 
})

app.get("/old-page(.html)", (req, res) => {
    app.sendFile(301, "/new-page.html");  //302 by default 
})

app.get("/hello(.html)?", (req, res, next) => {
    console.log("Attempted to load hello.html");
    next()
}, (req, res) => {
    res.send("Hello world")
})

//Chaining route handlers

const one = (req, res, next) => {
    console.log("one")
    next()
}

const two = (req, res, next) => {
    console.log("two")
    next()
}

const three = (req, res, next) => {
    console.log("three")
    res.send("Finished")
}

app.get("/chain(.html)?", [one, two, three])
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
























// https://rt.pornhub.com/view_video.php?viewkey=ph6148c372e6ed7