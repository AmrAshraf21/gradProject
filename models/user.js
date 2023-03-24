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
				type: mongoose.Types.ObjectId,
				ref: 'Book',
			},
		],
	},
  wishlist: {
		books: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Book',
			},
		],
	},
  alreadyRead: {
    books: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },

  lists: {
    type: Array,
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