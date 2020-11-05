const { User, Data } = require("../config/mongooseConfig");


module.exports.getUserData = (req, res, next) => {
  /*
  the req.user is populated by the validation through Passport.
  It gets created in the deserialization process
  */
  const email = req.user.email
  Data.findOne({ user: email })
    .then(userData => {
      if (userData) {
        res.locals.userData = userData
        next()
      } else {
        throw new Error("No Dataset found for " + req.body.email + ". Please Contact support. ")
      }
    })
    .catch(error => next(error))
}