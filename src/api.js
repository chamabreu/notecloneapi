const { getUserData } = require('./dataManagement')
const router = require('express').Router()
const passport = require('passport')


// ----------------------------------------------------
// Middlewares ----------------------------------------

/*
registerUser throw errors with messages if something occurs.
These errors get catched by the global error handler in app.js
Comes back with res.locals.newUser = newUser
*/
const registerUser = require('./userManagement').registerUser

/* 
validateUser checks the req.isAuthenticated() from passport
It handles the passport.deserialization from the cookie
 */
const { validateUser } = require('./userManagement')






// End Middlewares ------------------------------------



// ----------------------------------------------------
// Routes ---------------------------------------------


/* GET ROUTES */



/* POST ROUTES */
router.post('/register', registerUser, (req, res, next) => {
  res.send('registered successfully')
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.send(req.user)
})

router.post('/logout', (req, res) => {
  req.logOut()
  req.session.destroy(() => {
    res.send("Session Deleted")
  })
})

router.post('/data', validateUser, getUserData, (req, res, next) => {
  /* In req.user lays the credentials of the user itself */

  /* In res.locals.userData lays the userData from the matched userID of the cookie */
  res.send(res.locals.userData)
})



// End Routes -----------------------------------------





module.exports = router