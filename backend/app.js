const express = require("express");
const mongoose = require('mongoose')
const cors = require('cors')

const noteRouter = require('./note').router

const app = express()
const PORT = process.env.PORT || 8080;
const mongoUrl = 'mongodb://localhost/language-notes'

app.use(cors())

app.use(express.urlencoded({extended: true}))

app.use(express.json())

app.use('/note', noteRouter)

mongoose.connect(mongoUrl)

app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect("/");
});

  
app.listen(PORT, console.log(`Server started on port ${PORT}`));