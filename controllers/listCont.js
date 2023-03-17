const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Book = require('../models/book.js');
const User = require('../models/user.js');
const { validationResult } = require('express-validator');
const { findById } = require("../models/book.js");

exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!req.user) {
      return res.status(401).json({ message: 'Login to continue.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const userWishlist = user.wishlist.books;
    return res.status(200).json({ message: "User's wishlist", results: userWishlist });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
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
      return res.status(401).json({ message: 'Login to continue.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const bookId = req.body.bookId;
    const book = await Book.findById(bookId);

    const alreadyAdded = user.wishlist.books.find(id => id === bookId);
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
    next (err);
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
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!req.user) {
      return res.status(401).json({ message: 'Login to continue.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const userFavorits = user.favorits.books;
    return res.status(200).json({ message: "User's favorits", results: userFavorits });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
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

    const alreadyAdded = user.favorits.books.find(id => id === bookId);
    if (alreadyAdded) {
      return res.status(200).json({ message: 'Book already in favorits', results: user });
    } else {
      user.favorits.books.push(book);
      const updatedUser = await user.save();
      return res.status(200).json({ message: 'successfully added to favorits', results: updatedUser, book });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.removeFromFavorits = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const bookId = req.body.bookId;
    const book = await Book.findById(bookId);

    user.favorits.books.pull(book);
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
    next (err);
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

    const alreadyAdded = user.alreadyRead.books.find(id => id === bookId);
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
    next (err);
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