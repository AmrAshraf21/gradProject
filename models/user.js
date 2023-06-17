const mongoose = require('mongoose');
const Book = require('./book');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: 'user',
	},

	resetToken: {
		type: String,
	},
	resetTokenExpiration: {
		type: Date,
	},
	image: {
		type: String
	 },
	 favorits:[{
		type:mongoose.Types.ObjectId,
		ref:"Book",
		is_read:Number,
		rating:Number,
		is_reviewed: Number
	 }],


	 
	// favorits: {
	// 	books: [
	// 		{
	// 			type: mongoose.Types.ObjectId,
	// 			ref: 'Book',
	// 		},
	// 	],
	// },
	wishlist: {
		books: [{ type: mongoose.Types.ObjectId, ref: 'Book' }],
	},
	alreadyRead: {
		books: [
			{
				 
					type: Schema.Types.ObjectId,
					ref: 'Book',
				
			},
		],
	},
});

module.exports = mongoose.model('User', userSchema);

