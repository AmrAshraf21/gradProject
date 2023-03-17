const mongoose = require('mongoose');
const Book = require('../models/book');
<<<<<<< HEAD
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
=======
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
>>>>>>> 0c02d5152a67b9c6629d3d97d3cdf6ffaee0b067
};

/**
 * ! Must Add a limit and pagination on get all books
 */
exports.getAllBooks = async (req, res, next) => {
<<<<<<< HEAD
	try {
		const getBooks = await Book.find();
		return res.status(200).json({ message: 'Success Retrieve Books', data: getBooks });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
=======
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
>>>>>>> 0c02d5152a67b9c6629d3d97d3cdf6ffaee0b067
