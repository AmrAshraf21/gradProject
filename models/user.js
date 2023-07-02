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
    items: [
      {
        type: mongoose.Types.ObjectId,
				ref: 'Book'
			},
		],
	},
  alreadyRead: {
    items: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  favorits: {
    books: [
      {
        book_item: { type: mongoose.Types.ObjectId, ref: 'Book' },
        is_read: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        is_reviewed: { type: Number, default: 0 }
      },
    ],
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);