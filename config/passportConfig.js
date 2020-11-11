const passport = require('passport')
const { checkPW } = require('../src/bcryptHasher')
const { User } = require('./mongooseConfig')
const LocalStrategy = require('passport-local').Strategy


const userFields = {
  usernameField: "email",
  passwordField: "password"
}

const verificationCallBack = (email, plainPW, done) => {
  /* This Should only get called if there is no cookie with the request */
  /* If there is a valid cookie, the passport.deserializeUser should be called */

  /* Find a user with that email */
  User.findOne({ email: email })

    .then((userData) => {

      if (!userData) {
        /* if no user is registered with that email, throw an vague message */
        done(null, false)

      } else {
        /* Compare PW from client with dataBase (hashed)password */
        /* This is a Promise from bcrypt, so catch this in the next .then block */
        checkPW(plainPW, userData.password)
          .then(isCorrect => {

            if (isCorrect) {
              /* isCorrect is true if the user entered the right password, go to serialization */
              done(null, userData._id)

            } else {
              /* isCorrect is false if the user entered the wrong password */
              done(null, false)
            }
          })


          /* catches errors and send them to the errohandler */
          .catch(error => done(error))
      }
    })

    /* catches errors and send them to the errohandler */
    .catch(error => done(error))


}

const strategy = new LocalStrategy(userFields, verificationCallBack)

passport.use(strategy)



/* Get the userID into the Cookie */
passport.serializeUser((userID, done) => {
  done(null, userID)
})


/* Parse the userData from the DataBase with the userID from the Cookie */
passport.deserializeUser((userID, done) => {

  /* find a user with that userID */
  User.findById(userID)


    .then(userCredentials => {
      if (userCredentials) {
        done(null, userCredentials)
      } else {
        done(new Error("No valid user in Cookie. Contact Support"))
      }
    })

    /* Catch errors and get handled by errorhandler */
    .catch(error => done(error))
})