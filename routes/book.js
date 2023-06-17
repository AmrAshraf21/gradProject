const router = require('express').Router();
const bookController = require('../controllers/bookCont');
const { check } = require('express-validator');
const Book = require('../models/book');
const {
	validateToken,
	verifyTokenAndAuthorization,
	verifyTokenAdmin,
} = require('../middleware/validateToken');

router.post(
	'/',
	verifyTokenAdmin,
	[
		check('title', 'Must provide a title').notEmpty(),
		check('url', 'Must provide a URL of Book'),
		check('book_id', 'Must provide a books Id'),
		check('cover_image', 'You must provide an image'),
		check('mod_tile', 'You must provide an author'),
	],
	bookController.postAddBook
);


router.get('/', verifyTokenAndAuthorization, bookController.getAllBooks);
router.get('/:bookId', verifyTokenAndAuthorization, bookController.getSingleBook);
router.delete('/:bookId',verifyTokenAdmin,bookController.deleteBook);
router.patch('/:bookId',verifyTokenAdmin,bookController.updateBook);

router.get('/search/:srch', verifyTokenAndAuthorization, bookController.getSearch);

router.put('/rating', verifyTokenAndAuthorization, bookController.rating);

module.exports = router;