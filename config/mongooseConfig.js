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
  },

  /* The data Object which holds all data of the User */
  data: {
    type: Object,
    default: {
      name: "",
      pages: [],
      parents: [],
      data: {
        pageText: "Default Text"
      }
    }

    /*
    {
      pages: ["TopPageID"],
      TopPageID: {
        name: "TopPageName",
        pages: ["FirstSubID", "SecSubID", "ThirdSubID"],
        parents: [],
        data: {}
      },
      FirstSubID: {
        name: "FirstSub",
        pages: [],
        parents: ["TopPageID"],
        data: {}
      },
      SecSubID: {
        name: "SecSub",
        pages: ["NestSec1ID", "NestSec2ID"],
        parents: ["TopPageID"],
        data: {}
      },
      NestSec1ID: {
        name: "NestSec1",
        pages: [],
        parents: ["SecSubID"],
        data: {}
      },
      NestSec2ID: {
        name: "NestSec2",
        pages: ["Arm1", "Bein2"],
        parents: ["SecSubID"],
        data: {}
      },
      Arm1: {
        name: "Arm",
        pages: [],
        parents: ["NestSec2ID"],
        data: {}
      },
      Bein2: {
        name: "Bein",
        pages: [],
        parents: ["NestSec2ID"],
        data: {}
      },
      ThirdSubID: {
        name: "ThirdSub",
        pages: [],
        parents: ["TopPageID"],
        data: {}
      },
    }
    */
  }
})

/* Create the User model and export it later */
/* This is used to create, save and update users */
const User = mongoose.model("User", userSchema)

module.exports.User = User


