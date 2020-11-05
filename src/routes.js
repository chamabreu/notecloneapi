
const router = require('express').Router()

// ----------------------------------------------------
// Middlewares ----------------------------------------

/*
registerUser and logUserIn throw errors with messages if something occurs.
These errors get catched by the global error handler in app.js
*/
// registerUser -> Comes back with res.locals.newUser = newUser
const registerUser = require('./userManagement').registerUser

// logUserIn -> Comes back with the email of the logged in user
const logUserIn = require('./userManagement').logUserIn







// End Middlewares ------------------------------------



// ----------------------------------------------------
// Routes ---------------------------------------------


/* GET ROUTES */



/* POST ROUTES */
router.post('/register', registerUser, (req, res, next) => {
  res.send("Registered: " + res.locals.newUser.email)
})

router.post('/login', logUserIn, (req, res, next) => {
  res.send("Welcome " + res.locals.user)
})



// End Routes -----------------------------------------





module.exports = router