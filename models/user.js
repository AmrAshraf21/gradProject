const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
  },
  role:{
    type:String,
    default:"user"
  },

  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date
  }
});

module.exports = mongoose.model("User", userSchema);
