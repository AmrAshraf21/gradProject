const mongoose = require("mongoose");
const Book = require('../models/book.js');
const User = require('../models/user.js');
const { validationResult } = require('express-validator');

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
			return res.status(200).json({ message: 'Book already in wishlist', results: user });
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
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const bookId = req.body.bookId;
    const book = await Book.findById(bookId);

    user.wishlist.books.pull(book);
    await user.save();

    return res.status(200).json({ message: 'successfully removed from wishlist', results: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
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
		const { favorits } = await User.findById(userId).populate({ path: 'favorits.books.book_item', model: 'Book' }).exec();

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

		const { bookId } = req.body;
		const book = await Book.findById(bookId);
		if (!book) return res.status(404).json({ message: 'Book Not Found', results: null });
   
		const alreadyAdded = user.favorits.books.find((book) => book.book_item._id.toString() === bookId.toString());

		if (alreadyAdded) {
			return res.status(200).json({ message: 'Book already in favorits', results: user });
		} else {
			const newbook = {
        book_item:book,
        is_read: 0,
        rating: 0,
        is_reviewed: 0
      }
			user.favorits.books.push(newbook);
			const updatedUser = await user.save();
			return res.status(200).json({ message: 'successfully added to favorits', results: updatedUser, book });
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

// exports.addToFavorits = async (req, res, next) => {
// 	try {
// 		const userId = req.user.userId;
// 		const user = await User.findById(userId);
// 		if (!req.user) {
// 			return res.status(401).json({ message: 'Login to continue.' });
// 		}
// 		if (!user) {
// 			return res.status(404).json({ message: 'User not found.' });
// 		}

// 		const { bookId } = req.body;
// 		const book = await Book.findById(bookId);
// 		if (!book) return res.status(404).json({ message: 'Book Not Found', results: null });
   
// 		const alreadyAdded = user.favorits.find((fav) => fav.toString() === bookId.toString());

// 		if (alreadyAdded) {
// 			return res.status(200).json({ message: 'Book already in favorits', results: user });
// 		} else {
// 			user.favorits.push(book);
// 			const updatedUser = await user.save();
// 			return res.status(200).json({ message: 'successfully added to favorits', results: updatedUser, book });
// 		}
// 	} catch (err) {
// 		if (!err.statusCode) {
// 			err.statusCode = 500;
// 		}
// 		next(err);
// 	}
// };

exports.removeFromFavorits = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const bookId = req.body.bookId;
    const book = await Book.findById(bookId);

    const bookIndex = user.favorits.books.findIndex((item) => item.book_item.toString() === bookId.toString());

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found in favorites' });
    }

    user.favorits.books.splice(bookIndex, 1);

    //user.favorits.books.pull(book.book_item);
    await user.save();
    
    return res.status(200).json({ message: 'successfully removed from favorits', results: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.getRead = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Login to continue.' });
		}
		const { userId } = req.user;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}
		const { alreadyRead } = await User.findById(userId).populate({ path: 'alreadyRead.books', model: 'Book' }).exec();

		return res.status(200).json({ message: "User's Already read", results: alreadyRead });
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

		const { bookId } = req.body;
		const book = await Book.findById(bookId);
		if (!book) return res.status(404).json({ message: 'Book Not Found', results: null });

		const alreadyAdded = user.alreadyRead.books.find((book) => book._id.toString() === bookId.toString());

		if (alreadyAdded) {
			return res.status(200).json({ message: 'Book already in already read', results: user });
		} else {
			user.alreadyRead.books.push(book);
			const updatedUser = await user.save();
			return res.status(200).json({ message: 'successfully added to already read', results: updatedUser, book });
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
    next (err);
  }
};

exports.createList = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const { name, description, books } = req.body;

    const newList = new user.lists({
      name: name,
      description: description,
      books: books
    });
    await user.save();
    return res.status(200).json({ message: "List created successfully.", results: newList });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }  
};