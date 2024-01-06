const express = require("express");
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv');
const cookieSession = require("cookie-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

dotenv.config()


const noteRouter = require('./note').router
const userRouter = require('./user').router


const app = express()
const PORT = process.env.PORT || 8080;
const mongoUrl = 'mongodb://localhost/language-notes'

app.use(cookieSession({ 
    name: "session", 
    keys: [process.env.secretKey], 
    maxAge: 24 * 60 * 60 * 100,
    store: MongoStore.create({mongoUrl})
}))

// app.use(cookieSession({ 
//     name: "session", 
//     keys: [process.env.secretKey], 
//     maxAge: 24 * 60 * 60 * 100,
//     store: MongoStore.create({
//         uri: mongoUrl,
//         databaseName: 'language-notes',
//         collection: 'sessions',
//       }),
// }))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
    origin: "http://localhost:3000",
    methods: "POST, DELETE, PUT, GET",
    credentials: true
}))

app.use(express.urlencoded({extended: true}))

app.use(express.json())

app.use('/note', noteRouter)

app.use('/user', userRouter)


mongoose.connect(mongoUrl)

app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect("/");
});

  
app.listen(PORT, console.log(`Server started on port ${PORT}`));