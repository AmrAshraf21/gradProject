const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required:true
  },
  password: {
    type: String,
    required:true
  },

  resetToken: {
    type: String,
    required: false
  },
  resetTokenExpiration: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model("User", userSchema);
