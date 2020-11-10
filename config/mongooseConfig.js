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
      pages: ["newPageID"],
      newPageID: {
        name: "New Page",
        pages: [],
        data: {}
      }
    }
    /*
    {
      pages : ["pageID1", "pageID2", "pageID3"],
      pageID1: {
        name: "Page 1",
        pages: []
      },
      pageID2: {
        name: "Page 2",
        pages: ["subPageID"]
      },
      pageID3: {
        name: "Page 3",
        pages: []
      },
      subPageID: {
        name: "Sub Page",
        pages: ["moreSubPageID"]
      },
      moreSubPageID: {
        name: "More Sub Page",
        pages: []
      }
    }
    */
  }
})
/* Create the User model and export it later */
/* This is used to create, save and update users */
const User = mongoose.model("User", userSchema)

module.exports.User = User


