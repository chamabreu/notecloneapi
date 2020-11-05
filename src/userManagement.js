const { hashPW, checkPW } = require("./bcryptHasher")

const User = require("../config/mongooseConfig").User


module.exports.registerUser = (req, res, next) => {
  /* Get the email from the Body */
  const email = req.body.email

  /* Check if the email is already registered */
  User.findOne({ email: email })

    /* userData can be null or userData, if user exists */
    .then(userData => {

      if (userData) {
        /* If user does exist, throw Error and get catched at the end */
        throw new Error('User already exists')
      } else {

        /* No user exists, hash PW*/
        /* Hash Password and return Promise */
        return hashPW(req.body.password)

      }
    })

    /* after hashing completed */
    .then((hashedPW) => {

      /* Create use with email and hashedPW */
      const newUser = new User({
        email: email,
        password: hashedPW
      })

      /*
        return the Promise from User.save(). the next .then function only gets triggered
        when this promise is resolved / rejected
      */
      return newUser.save()
    })

    /* gets the newUser from the newUser.save() */
    .then((newUser) => {

      /* write it to the res.locals prop */
      res.locals.newUser = newUser

      /* and go next to the routes */
      next()
    })

    /* catches all errors occuring in the .then-Chain and send them to the errohandler */
    .catch(error => next(error))
}

module.exports.logUserIn = (req, res, next) => {
  /* Get email and PW from body */
  const email = req.body.email
  const plainPW = req.body.password

  /* Find a user with that email */
  User.findOne({ email: email })

    .then((userData) => {

      if (!userData) {
        /* if no user is registered with that email, throw an vague message */
        throw new Error('No valid email and password combination')

      } else {
        /* Compare PW from client with dataBase (hashed)password */
        /* This is a Promise from bcrypt, so catch this in the next .then block */
        return checkPW(plainPW, userData.password)

      }
    })

    .then(isCorrect => {

      if (isCorrect) {
        /* isCorrect is true if the user entered the right password, go back to routes */
        res.locals.user = email
        next()

      }else {
        /* isCorrect is false if the user entered the wrong password */
        throw new Error('No valid email and password combination')
      }
    })

    /* catches all errors occuring in the .then-Chain and send them to the errohandler */
    .catch(error => next(error))
}