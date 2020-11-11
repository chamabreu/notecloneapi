const { User } = require("../config/mongooseConfig")
const { hashPW, checkPW } = require("./bcryptHasher")



module.exports.registerUser = (req, res, next) => {
  /* Get the email from the Body */
  const email = req.body.email

  /* Check if the email is already registered */
  User.findOne({ email: email })

    /* userData can be null or userData, if user exists */
    .then(userData => {

      if (userData) {
        /* If user does exist, throw Error and get catched at the end */
        // throw new Error({status: 400, msg: 'User already exists'})
        return Promise.reject({ status: 400, msg: 'User already exists' })
      } else {

        /* No user exists, hash PW*/
        /* Hash Password and return Promise */
        return hashPW(req.body.password)

      }
    })

    /* after hashing completed */
    .then((hashedPW) => {

      /* Create user with email and hashedPW */
      const newUser = new User({
        email: email,
        password: hashedPW
      })

      /*
        return the Promise from User.save(). the next .then function only gets triggered
        when this promise is resolved
      */
      return newUser.save()
    })

    /* gets the newUser from the newUser.save() */
    .then((newUser) => {

      /* write it to the res.locals prop */
      res.locals.user = newUser.email

      /* and go next to the routes */
      next()
    })

    /* catches all errors occuring in the .then-Chain and send them to the errohandler */
    .catch(error => {
      if (error.status) {
        return next({ status: error.status, msg: error.msg })
      } else {
        return next(error)
      }
    })
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

      } else {
        /* isCorrect is false if the user entered the wrong password */
        throw new Error('No valid email and password combination')
      }
    })

    /* catches all errors occuring in the .then-Chain and send them to the errohandler */
    .catch(error => next(error))
}


module.exports.validateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    return next({ status: 401, msg: "Not Logged in" })
  }
}


module.exports.getUserData = (req, res, next) => {
  /*
  the req.user is populated by the validation through Passport.
  It gets created in the deserialization process
  */
  const email = req.user.email
  User.findOne({ email: email })
    .then(userData => {
      if (userData) {
        res.locals.user = userData.email
        res.locals.data = userData.data
        next()
      } else {
        throw new Error("Cant load Data. Please Contact support. ")
      }
    })
    .catch(error => next(error))
}


module.exports.createNewPage = async (req, res, next) => {
  const email = req.user.email
  const pageDate = String(Date.now())
  const pageDateID = `${pageDate}ID`

  await User.findOneAndUpdate(
    { "email": email },
    {
      $addToSet: { "data.pages": pageDateID },
      $set: {
        [`data.${pageDateID}`]: {
          "name": pageDate,
          "pages": [],
          "parents": [],
          "data": {}
        }
      }
    }
  )
  next()
}

module.exports.updatePageName = async (req, res, next) => {
  const email = req.user.email
  const pageID = req.body.pageID
  const newName = req.body.newName

  await User.findOneAndUpdate(
    { "email": email },
    { $set: { [`data.${pageID}.name`]: newName } }
  )
  next()
}

module.exports.createSubPage = async (req, res, next) => {
  const email = req.user.email
  const pageDate = String(Date.now())
  const pageDateID = `${pageDate}ID`
  const parentID = req.body.parentPage

  await User.findOneAndUpdate(
    { "email": email },
    {
      $addToSet: { [`data.${parentID}.pages`]: pageDateID },
      $set: {
        [`data.${pageDateID}`]: {
          "name": pageDate,
          "pages": [],
          "parents": [parentID],
          "data": {}
        }
      }

    }
  )
  next()
}
module.exports.removePage = async (req, res, next) => {
  const email = req.user.email
  const pageID = req.body.pageID
  const userData = await User.findOne(
    { "email": email }
  )
  const parentPages = userData.data[pageID].parents

  // GET ALL NESTED SUBPAGES OF THAT PAGE TO DELETE THEM
  const getAllPagesOf = (selectedPage) => {
    const nestedPages = userData.data[selectedPage].pages
    if (nestedPages.length > 0) {
      let childArray = []
      for (const childID of nestedPages) {
        childArray = [...childArray, ...getAllPagesOf(childID)]
      }
      return [selectedPage, ...childArray]

    } else {
      return [selectedPage]
    }
  }


  
  let unsetModifier = {
    $pull: {},
    $unset: {}
  }

  /* Get all subpages of pageID to delete */
  let allSubPagesArray = getAllPagesOf(pageID)
  allSubPagesArray.forEach(subPage => {
    unsetModifier.$unset[`data.${subPage}`] = ""
  });
  
  /* Get the parent Page of pageID to delete */
  if (parentPages.length > 0) {
    parentPages.forEach(parentPage => {
      unsetModifier.$pull[`data.${parentPage}.pages`] = pageID
    });
  }else {
    unsetModifier.$pull["data.pages"] = pageID
  }

  /* Delete execution */
  await User.findOneAndUpdate(
    { "email": email },
    unsetModifier
  )


  next()
}

