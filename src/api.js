const { getUserData, createNewPage, updatePageName, updatePageText, createSubPage, removePage } = require('./userManagement')
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
  res.send(req.user.email)
})

router.post('/logout', (req, res) => {
  req.logOut()
  req.session.destroy(() => {
    res.send("Session Deleted")
  })
})

router.post('/getData', validateUser, getUserData, (req, res, next) => {
  /* In req.user lays the credentials of the user itself */

  /* In res.locals.userData lays the userData from the matched userID of the cookie */
  res.send(res.locals)
})

router.post('/newPage', validateUser, createNewPage, (req, res) => {
  res.send(res.locals)
})

router.post('/updatePageName',validateUser, updatePageName, (req, res) => {
  res.send(res.locals)
})


router.post('/updatePageText',validateUser, updatePageText, (req, res) => {
  res.send(res.locals)
})

router.post('/createSubPage', validateUser, createSubPage, (req, res) => {
  res.send(res.locals)
})

router.post('/removePage', validateUser, removePage, (req, res) => {
  res.send(res.locals)
})

router.post('/authedStatus', validateUser, (req, res) => {
  console.log(req.user)
  res.send(req.user.email)
})



// End Routes -----------------------------------------





module.exports = router