const mongoose = require('mongoose');
const Book = require('../models/book.js');
const User = require('../models/user.js');
const { validationResult } = require('express-validator');
const { verifyTokenAndAuthorization } = require('../middleware/validateToken');

exports.getWishlist = async (req, res, next) => {
	const userId = req.params._id;
	try {
		//const user = await User.findById(id);
		const userWishlist = await User.wishlist.find(userId);
		return res.status(200).json({ message: "User's wishlist", results: userWishlist });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

// exports.getWishlist = async (req, res, next) => {
//   const userId = req.params._Id;
//   try {
//     const user = await User.findById(userId);
//     const userWishlist = await user.find({ wishlist: wishlist});
//     if (userWishlist.isEmpty())
//     {
//       return res.status(200).json({ message: "User's wishlist is empty", results: userWishlist });
//     } else {
//     return res.status(200).json({ message: "successfully retrived user's wishlist", results: userWishlist });
//     }
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next (err);
//   }
// };

exports.addToWishlist = async (req, res, next) => {
	try {
		const userId = req.user.userId;

		const user = await User.findById(userId);

		if (!req.user) {
			return res.status(401).json({ message: 'You must be logged in to add books to your wishlist.' });
		}
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const bookId = req.body.book_id;
		const book = await Book.findOne({ book_id: bookId });
		const alreadyAdded = user.wishlist.books.find((book) => book.book_id === bookId);

		if (alreadyAdded) {
			return res.status(200).json({ message: 'Book already in wishlist', results: user });
		} else {
			user.wishlist.books.push(book);
			const updatedUser = await user.save();
			return res.status(200).json({ message: 'successfully added to wishlist', results: updatedUser });
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.removeFromWishlist = async (req, res, next) => {
	const { userId } = req.user;
	const { book_id } = req.body;
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'You must be logged in to add books to your wishlist.' });
		}
		
		const user = await User.findOneAndUpdate({ _id: userId }, { $pull: { books: { book_id } } },{new:true});

		return res.status(200).json({ message: 'successfully removed from wishlist', results: user });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getFavorits = async (req, res, next) => {
	const { _id } = req.user;
	try {
		const user = await User.findById(_id);
		const userFavorits = await user.favorits.find();
		if (userFavorits.isEmpty()) {
			return res.status(200).json({ message: "User's favorits is empty", results: userFavorits });
		} else {
			return res.status(200).json({ message: "successfully retrived user's favorits", results: userFavorits });
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.addToFavorits = async (req, res, next) => {
	const { _id } = req.user;
	const { bookId } = req.body;
	try {
		const user = await User.findById(_id);
		const alreadyAdded = await user.favorits.find((id) => id.toString() === bookId.toString());
		if (alreadyAdded) {
			return res.status(200).json({ message: 'Book already in favorits', results: user });
		} else {
			let updatedUser = await user.favorits.findByIdAndUpdate(_id, { $push: { favorits: bookId } }, { new: true });
			return res.status(200).json({ message: 'successfully added to favorits', results: updatedUser });
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.removeFromFavorits = async (req, res, next) => {
	const { _id } = req.user;
	const { bookId } = req.body;
	try {
		const user = await User.findByIdAndUpdate(_id, { $pull: { favorits: bookId } }, { new: true });
		return res.status(200).json({ message: 'successfully removed from favorits', results: user });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getRead = async (req, res, next) => {
	const { _id } = req.user;
	try {
		const user = await User.findById(_id);
		const userReadlist = await user.read.find();
		if (userReadlist.isEmpty()) {
			return res.status(200).json({ message: 'Read list is empty.', results: user });
		}
		return res.status(200).json({ message: "successfully retrived user's Read.", results: userReadlist });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.addToRead = async (req, res, next) => {
	const { _id } = req.user;
	const { bookId } = req.body;
	try {
		const user = await User.findById(_id);
		const alreadyAdded = await user.read.find((id) => id.toString() === bookId.toString());
		if (alreadyAdded) {
			return res.status(200).json({ message: 'Book already in read list', results: user });
		} else {
			let updatedUser = await User.findByIdAndUpdate(_id, { $push: { read: bookId } }, { new: true });
			return res.status(200).json({ message: 'successfully added to read list', results: updatedUser });
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.removeFromRead = async (req, res, next) => {
	const { _id } = req.user;
	const { bookId } = req.body;
	try {
		const user = await User.findByIdAndUpdate(_id, { $pull: { favorits: bookId } }, { new: true });
		return res.status(200).json({ message: 'successfully removed from Rad list', results: user });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
