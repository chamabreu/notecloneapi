const mongoose = require('mongoose')

/* Connect to mongodb */
mongoose.connect(
  /* Get the URI from .env with the admin user data */
  process.env.MONGODB_URI,
  /* options to hide warnings */
  { useNewUrlParser: true, useUnifiedTopology: true },
  /* Clog Startinfo with maybe Error or with null */
  (error) => console.log("Opened MongoDB. Error? ->", error)
)

/* Create User Schema to manage Users */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  /* Implement a level for the User. This is for Permissionaccess later on */
  level: {
    type: Number,
    required: true,
    default: 0
  }
})
/* Create the User model and export it later */
/* This is used to create, save and update users */
const User = mongoose.model("User", userSchema)



/* Create Data Schema for user Data */
const dataSchema = new mongoose.Schema({
  /* User to know to which User the Data belongs */
  user: {
    type: String,
    required: true
  },
  
  
  /* Some items to get something from the DB for debugging */
  lorem: {
    type: String,
    default: "The Lorem Text is the default Text"
  },
  ipsum: {
    type: String,
    default: "And then there is ipsum. Its also default, but a little different"
  }
})
/* Create the Data model and export it later */
/* This is used to create, save and update Data */
const Data = mongoose.model("Data", dataSchema)


module.exports.User = User
module.exports.Data = Data


