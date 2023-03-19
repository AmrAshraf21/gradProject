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
	},

	password: {
		type: String,
		required: true,
	},
	confirmPassword: {
		type: String,
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

	favorits: {
		books: [
			{
        book_id: {
					type:Number,
					ref: 'Book',
				},
			},
		],
	},
	wishlist: {
		books: [
			{
        book_id: {
					type:Number,
					ref: 'Book',
				},
			},
		],
	},
	read: {
		books: [
			{
        book_id: {
					type: Number,
					ref: 'Book',
				},
			},
		],
	},
});

module.exports = mongoose.model('User', userSchema);
