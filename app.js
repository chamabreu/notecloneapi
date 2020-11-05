const express = require('express')
const router = require('./src/routes')

const app = express()

/* MIDDLEWARES */
app.use(express.json())





/* ROUTES */
app.use(router)



/* ERRORHANDLERS */
app.use((error, req, res, next) => {
  res.send(error.message)
})

module.exports = app