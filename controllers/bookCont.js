const mongoose = require('mongoose');
const Book = require('../models/book');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const { options } = require('../routes/book');

exports.postAddBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Added Failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const createdBook = await Book.create(req.body);

    return res.status(200).json({ message: 'Success Created...', data: createdBook });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findOne({ book_id: bookId });
    return res.status(200).json({ message: 'Done...', data: book });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    await Book.findOneAndDelete({ book_id: bookId });
    return res.status(200).json({ message: 'Successfully Deleted...', data: null });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const updatedBook = await Book.findOneAndUpdate({ book_id: bookId }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: 'Successfully Updated...', data: updatedBook });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

/**
 * ! Must Add a limit and pagination on get all books
 */
exports.getAllBooks = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 20;
  try {
    const getBooks = await Book.find().skip({ currentPage: -1 } * perPage).limit(perPage);
    return res.status(200).json({ message: 'Success Retrieve Books', data: getBooks });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSearch = async (req, res, next) => {
  try {
    const srch = req.params.srch;
    const book = await Book.aggregate([
      { $match: { title: new RegExp(srch, "mi") } }
    ]);
    if (!book) {
      const error = new Error('No Results.');
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ books: book });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

// exports.getSearch = async (req, res, next) => {
//  const srch = req.params.key;
//   try {
//     const book = await Book.find({"title": {$regex: `${srch}`, '$mi' }}).limit(10);
//     if (!book) {
//       const error = new Error('No Results.');
//       error.statusCode = 404;
//       throw error;
//     }
//     return res.status(200).json({ books: book });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//       next(err);
//     }
//   }
// };

exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(_id);
    const userWishlist = await user.wishlist.find();
    if (userWishlist.isEmpty())
    {
      // const error = new Error("You don't have books in your wishlist, yet.");
      // error.statusCode = 404;
      // throw error;
      return res.status(200).json({ message: "successfully retrived user's wishlist", userWishlist });
    }
    return res.status(200).json({ message: "successfully retrived user's wishlist", userWishlist });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.addToWishlist = async (req, res, next) => {
  const bookId = req.body.bookId;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = await user.wishlist.find(id => id.toString() == bookId.toString());
    if (alreadyAdded) {
     return res.status(200).json({ message: 'Book already in wishlist', user });
    } else {
      let updatedUser = await User.findByIdAndUpdate(_id,
        { $push: { wishlist: bookId } },
        { new: true }
      );
      return res.status(200).json({ message: 'successfully added to wishlist', user: updatedUser });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  const bookId = req.body.bookId;
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
  try {
    const user = await User.findById(_id);
    const userFavorits = await user.favorits.find();
    if (userFavorits.isEmpty())
    {
      // const error = new Error("You don't have books in your favorits, yet.");
      // error.statusCode = 404;
      // throw error;
      return ers.status(200).json({message: "successfully retrived user's favorits", favList: userFavorits });
    }
    return ers.status(200).json({message: "successfully retrived user's favorits", favList: userFavorits });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.addToFavorits = async (req, res, next) => {
  const bookId = req.body.bookId;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = await user.favorits.find(id => id.toString() == bookId.toString());
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
  const bookId = req.body.bookId;
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
  try {
    const user = await User.findById(_id);
    const userReadlist = await user.read.find();
    if (userReadlist.isEmpty())
    {
      // const error = new Error("You don't have books in your Read list, yet.");
      // error.statusCode = 404;
      // throw error;
      return res.status(200).json({message: "Read list is empty.", user: user });
    }
    return res.status(200).json({message: "successfully retrived user's Read", user: userReadlist });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next (err);
  }
};

exports.addToRead = async (req, res, next) => {
  const bookId = req.body.bookId;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = await user.read.find(id => id.toString() == bookId.toString());
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
  const bookId = req.body.bookId;
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