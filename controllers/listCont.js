const mongoose = require("mongoose");
const Book = require('../models/book.js');
const User = require('../models/user.js');
const { validationResult } = require('express-validator');

exports.getWishlist = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const userWishlist = await user.wishlist.find();
    if (userWishlist.isEmpty())
    {
      return res.status(200).json({ message: "User's wishlist is empty", wishlist: userWishlist });
    } else {
    return res.status(200).json({ message: "successfully retrived user's wishlist", wishlist: userWishlist });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.addToWishlist = async (req, res, next) => {
  const { _id } = req.user;
  const { book_Id } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = await user.wishlist.find(id => id.toString() == book_Id.toString());
    if (alreadyAdded) {
     return res.status(200).json({ message: 'Book already in wishlist', user: user });
    } else {
      let updatedUser = await User.findByIdAndUpdate(_id,
        { $push: { wishlist: book_Id } },
        { new: true }
      );
      return res.status(200).json({ message: 'successfully added to wishlist', user: updatedUser });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  const { _id }= req.user;
  const { bookId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id,
      { $pull: { wishlist: bookId } },
      { new: true }
    );
    return res.status(200).json({ message: 'successfully removed from wishlist', user: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.getFavorits = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const userFavorits = await user.favorits.find();
    if (userFavorits.isEmpty())
    {
      return res.status(200).json({message: "User's favorits is empty", user: userFavorits });
    } else {
    return res.status(200).json({message: "successfully retrived user's favorits", user: userFavorits });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.addToFavorits = async (req, res, next) => {
  const { _id } = req.user;
  const { bookId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = await user.favorits.find(id => id.toString() === bookId.toString());
    if (alreadyAdded) {
      return res.status(200).json({ message: 'Book already in favorits', user: user });
    } else {
      let updatedUser = await User.findByIdAndUpdate(_id,
        { $push: { favorits: bookId } },
        { new: true }
      );
      return res.status(200).json({ message: 'successfully added to favorits', user: updatedUser });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.removeFromFavorits = async (req, res, next) => {
  const { _id } = req.user;
  const { bookId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id,
      { $pull: { favorits: bookId } },
      { new: true }
    );
    return res.status(200).json({ message: 'successfully removed from favorits', user: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.getRead = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const userReadlist = await user.read.find();
    if (userReadlist.isEmpty())
    {
      return res.status(200).json({message: "Read list is empty.", user: user });
    }
    return res.status(200).json({message: "successfully retrived user's Read.", user: userReadlist });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.addToRead = async (req, res, next) => {
  const { _id } = req.user;
  const { bookId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = await user.read.find(id => id.toString() === bookId.toString());
    if (alreadyAdded) {
      return res.status(200).json({ message: 'Book already in read list', user: user });
    } else {
      let updatedUser = await User.findByIdAndUpdate(_id,
        { $push: { read: bookId } },
        { new: true }
      );
      return res.status(200).json({ message: 'successfully added to read list', user: updatedUser });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.removeFromRead = async (req, res, next) => {
  const { _id } = req.user;
  const { bookId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id,
      { $pull: { favorits: bookId } },
      { new: true }
    );
    return res.status(200).json({ message: 'successfully removed from Rad list', user: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};