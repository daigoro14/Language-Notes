const express = require('express')
const passport = require('passport')

const router = express.Router()

const {User} = require('./models/user')

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

router.post('/signup', async (req, res) => {
    try {
        console.log(req.body)
        const user = new User({username: req.body.username});
        await user.setPassword(req.body.password)
        await user.save()
        res.json({})
      } catch(error) {
      res.send(error)
      }
})

router.post('/login',  passport.authenticate('local', { 
    successRedirect: '/user/login',
    failureRedirect: '/user/login', 
    failureMessage: true 
}))

router.get('/login', (req, res) => {
    console.log("hello")
    // if (req.isAuthenticated()) {
    //   res.send('You are logged in!');
    // } else {
    //   res.send('Log in was incorrect!');
    // //   res.redirect('/login');
    // }
  });

exports.router = router