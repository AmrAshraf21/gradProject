const mongoose = require("mongoose");
const Book = require('./book');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required:true,
    unique: true
  },
  password: {
    type: String,
    required:true
  },
  
  resetToken:{
    type:String,
  },
  resetTokenExpiration:{
    type:Date
  },
  
  favorits: {
    books: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Book'
        }
      }
    ]
  },
  wishlist: {
    books: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Book'
        }
      }
    ]
  },
  read: {
    books: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Book'
        }
      }
    ]
  }
});

module.exports = mongoose.model('User', userSchema);