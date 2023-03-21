const { SchemaType } = require('mongoose');
const jwt = require('jsonwebtoken');
const Book = require('../models/book.js');
const User = require('../models/user.js');
const { validationResult } = require('express-validator');
const { verifyTokenAndAuthorization } = require('../middleware/validateToken');
const { findById } = require('../models/book.js');

exports.getWishlist = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Login to continue.' });
		}
		const { userId } = req.user;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}
		const { wishlist } = await User.findById(userId).populate({ path: 'wishlist.books', model: 'Book' }).exec();

		return res.status(200).json({ message: "User's wishlist", results: wishlist });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.addToWishlist = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const user = await User.findById(userId);
		if (!req.user) {
			return res.status(401).json({ message: 'Login to continue.' });
		}
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		const { bookId } = req.body;
		const book = await Book.findById(bookId);
		if (!book) return res.status(404).json({ message: 'Book Not Found', results: null });

		const alreadyAdded = user.wishlist.books.find((book) => book._id.toString() === bookId.toString());

		if (alreadyAdded) {
			return res.status(200).json({ message: 'Book already in wishlist', results: user, book });
		} else {
			user.wishlist.books.push(book);
			const updatedUser = await user.save();
			return res.status(200).json({ message: 'successfully added to wishlist', results: updatedUser, book });
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.removeFromWishlist = async (req, res, next) => {
	try {
		if (!req.user) return res.status(401).json({ message: 'Please Login to remove', results: null });

		const { userId } = req.user;
		const { bookId } = req.body;
		const user = await User.findById(userId);
		const book = await Book.findById(bookId);
		if (!book) return res.status(401).json({ message: 'Book not found', results: null });

		if (!user.wishlist.books) return res.status(401).json({ message: 'No Book in wishlist', results: null });
		user.wishlist.books.pull(book);
		//const savedAfterRemove = await User.findById(userId).populate({ path: 'wishlist.books', model: 'Book' }).exec();

		await user.save();

		return res.status(200).json({ message: 'successfully removed from wishlist', results: user });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getFavorits = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Login to continue.' });
		}
		const { userId } = req.user;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}
		const { favorits } = await User.findById(userId).populate({ path: 'favorits.books', model: 'Book' }).exec();

		return res.status(200).json({ message: "User's Favorites", results: favorits });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.addToFavorits = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const user = await User.findById(userId);
		if (!req.user) {
			return res.status(401).json({ message: 'Login to continue.' });
		}
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		const bookId = req.body.bookId;
		const book = await Book.findById(bookId);

		const alreadyAdded = user.favorits.books.find((book) => book._id.toString() === bookId.toString());
		if (alreadyAdded) {
			return res.status(200).json({ message: 'Book already in favorits', results: user });
		} else {
			user.favorits.books.push(book);
			const updatedUser = await user.save();
			const { favorits, ...others } = updatedUser;
			return res.status(200).json({ message: 'successfully added to favorits', results: favorits, book });
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.removeFromFavorits = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const user = await User.findById(userId);

		const bookId = req.body.bookId;
		const book = await Book.findById(bookId);

		user.favorits.books.pull(book);
		const savedUser = await user.save();
		const {favorits} = savedUser
		return res.status(200).json({ message: 'successfully removed from favorits', results: favorits });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getRead = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const user = await User.findById(userId);
		if (!req.user) {
			return res.status(401).json({ message: 'Login to continue.' });
		}
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}
		const userAlreadyRead = user.alreadyRead.books;
		return res.status(200).json({ message: "Successfully retrieved user's already read", results: userAlreadyRead });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.addToRead = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const user = await User.findById(userId);
		if (!req.user) {
			return res.status(401).json({ message: 'Login to continue.' });
		}
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		const bookId = req.body.bookId;
		const book = await Book.findById(bookId);

		const alreadyAdded = user.alreadyRead.books.find((id) => id === bookId);
		if (alreadyAdded) {
			return res.status(200).json({ message: 'Book already in already read', results: user });
		} else {
			user.alreadyRead.books.push(book);
			const updatedUser = await user.save();
			return res.status(200).json({ message: 'successfully added to already read', results: updatedUser });
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.removeFromRead = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const user = await User.findById(userId);

		const bookId = req.body.bookId;
		const book = await Book.findById(bookId);

		user.alreadyRead.books.pull(book);
		await user.save();

		return res.status(200).json({ message: 'successfully removed from already read', results: user });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
