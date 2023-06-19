const Book = require('./book');

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type:String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
	image: {
		type: String
	 },
  role: {
		type: String,
		default: 'user',
	},
  
  resetToken: {
    type: String
  },
  resetTokenExpiration: {
    type: Date
  },

  wishlist: {
    books: [
      {
        type: mongoose.Types.ObjectId,
				ref: 'Book'
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
  favorits: [
      {
        book: { type: mongoose.Types.ObjectId, ref: 'Book' },
        is_read: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        is_reviewed: { type: Number, default: 0 }
      }
  ],
  
//   lists: {
//     type: Array,
//     books: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: 'Book'
//       }
//     ]
//   }
});

module.exports = mongoose.model('User', userSchema);