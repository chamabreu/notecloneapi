const express = require('express')
const session = require('express-session')
const router = require('./src/routes')
const passport = require('passport')
const mongoose =require('mongoose')
const MongoStore = require('connect-mongo')(session)

const app = express()

/* MIDDLEWARES */
app.use(express.json())

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 30
  },
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))


app.use(passport.initialize())
app.use(passport.session())
require('./config/passportConfig')




/* ROUTES */
app.use(router)



/* ERRORHANDLERS */
app.use((error, req, res, next) => {
  res.status(500).send(error.message)
})

module.exports = app