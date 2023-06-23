const mongoose = require('mongoose');
const Book = require('../models/book');
const User = require('../models/user');
const { validationResult } = require('express-validator');

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

    return res.status(200).json({ message: 'Success Created...', results: createdBook });
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
    return res.status(200).json({ message: 'Done...', results: book });
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
    return res.status(200).json({ message: 'Successfully Deleted...', results: null });
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

    return res.status(200).json({ message: 'Successfully Updated...', results: updatedBook });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllBooks = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 20;
  try {
    const getBooks = await Book.find().countDocuments();
    const books = await Book.find().skip((currentPage - 1) * perPage).limit(perPage);
    return res.status(200).json({ message: 'Success Retrieve Books', page: currentPage, results: books, books: getBooks });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getSearch = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 20;
  try {
    const srch = req.params.srch;
    const count = await Book.find().countDocuments();
    const book = await Book.aggregate([
      { $match: { title: new RegExp(srch, "mi") } }
    ]).skip((currentPage - 1) * perPage).limit(perPage);
    if (!book) {
      const error = new Error('No Results.');
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ page: currentPage, results: book, count: count });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPopular = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;
  try {
    const books = await Book.find().sort({ 'ratings_count': -1 }).skip((currentPage - 1) * perPage).limit(perPage);
    return res.status(200).json({ message: 'Popular Releases', page: currentPage, results: books });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNewest = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;
  try {
    const newest = await Book.find().sort({ 'publication_year': 'desc' }).skip((currentPage - 1) * perPage).limit(perPage);
    return res.status(200).json({ message: 'Newest Releases', page: currentPage, results: newest });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// exports.rating = async (req, res, next) => {
//   try {
//   const userId = req.user.userId;
//   console.log(userId);
//   const user = await User.findById(userId);
//   console.log(user);
//   if (!req.user) {
//     return res.status(401).json({ message: 'Login to continue.' });
//   }
//   if (!user) {
//     return res.status(404).json({ message: 'User not found.' });
//   }

//   const { star, bookId } = req.body;
//   console.log(star);
//   console.log(bookId);
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ error: 'Book not found' });
//     }
//     console.log(book);
//     console.log(book.ratings);

//     const alreadyRated = book.ratings.find((rating) => rating.postedBy.toString() === userId.toString());
//     console.log(alreadyRated);
//     if (alreadyRated) {
//       const updateRating = await Book.updateOne(
//         {
//           ratings: { $elemMatch: alreadyRated }
//         },
//         {
//           $set: { "ratings.$.star": star }
//         },
//         {
//           new: true
//         }
//       );
//       return res.status(200).json({ message: 'rating updated!', updateRating });
//     } else {
//       const rateBook = await Book.findByIdAndUpdate(
//         _id,
//         {
//           $push: {
//             ratings: {
//               star: star,
//               postedBy: userId
//             }
//           }
//         },
//         {
//           new: true
//         }
//       );
//       return res.status(200).json({ message: 'rating success!', rateBook });
//     }
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };