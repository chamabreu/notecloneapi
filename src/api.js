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
router.get('/', (req, res) => {
  res.send("HOMMEEEYYYY")
})

router.get('/login', (req, res) => {
  res.send("Welcome to GET of login")
})

router.get('/success', validateUser, (req, res) => {
  res.send("SUCCESS PAGE. Welcome " + req.user.email)
})

router.get('/failed', (req, res) => {
  console.log("FAILED")
  res.status(401).send("Failed")
})


/* POST ROUTES */
router.post('/register', registerUser, (req, res, next) => {
  res.send('registered successfully')
})

router.post('/login', (req, res, next) => {
  console.log('IN LOGIN POST :>> ', req.body);
  next()
},passport.authenticate('local'), (req, res, next) => {
  console.log("LOGGED IN IN POST LOGIN WITH", req.user)
  res.sendStatus(200)
})

router.post('/data', validateUser, getUserData, (req, res, next) => {
  /* In req.user lays the credentials of the user itself */

  /* In res.locals.userData lays the userData from the matched userID of the cookie */
  res.send(res.locals.userData)
})

router.post('/react', registerUser, (req, res, next) => {
  res.redirect('/login')
})



// End Routes -----------------------------------------





module.exports = router