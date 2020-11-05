const { User, Data } = require("../config/mongooseConfig");

module.exports.getUserData = (req, res, next) => {
  Data.findOne({user: req.body.email})
  .then(userData => {
    if (userData) {
      res.locals.userData = userData
      next()
    }else {
      throw new Error("No Dataset found for " + req.body.email + ". Please Contact support. ")
    }
  })
  .catch(error => next(error))
}