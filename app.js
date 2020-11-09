const express = require('express')
const session = require('express-session')
const api = require('./src/api')
const passport = require('passport')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

const app = express()

/* MIDDLEWARES */
app.use(express.json())

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))


app.use(passport.initialize())
app.use(passport.session())
require('./config/passportConfig')


function log(req, res, next) {
  // console.log('SESSION PASSPORT :>> ', req.session.passport);
  // console.log('BODY :>> ', req.body);
  next()
}


/* ROUTES */
app.use('/api', log, api)



/* ERRORHANDLERS */
app.use((error, req, res, next) => {
  console.log("IN ERROR HANDLER")
  console.log(error);

  if (error.status) {
    res.status(error.status).send(error.msg)
  } else {
    res.status(500).send(error.message || "unknown error")
  }

})

module.exports = app