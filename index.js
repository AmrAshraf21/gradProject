const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

const { setHeaders } = require('./middleware/headerMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');
const { verifyTokenAndAuthorization } = require('./middleware/validateToken');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const listRoutes = require('./routes/list');

dotenv.config();

const fileStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({ extended: false }));

app.use(setHeaders);

app.use('/auth', authRoutes);
app.use('/book', bookRoutes);
app.use('/list', listRoutes);

app.get('/healthz', (req, res, next) => {
	res.send('App is running');
});

app.use(errorHandler);

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fhsy9vt.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

mongoose
	.connect(MONGO_URL)
	.then(() => {
		console.log(`connected to Database in port ${process.env.PORT}`);

		app.listen(process.env.PORT || 5000);
	})
	.catch((err) => console.log(err));