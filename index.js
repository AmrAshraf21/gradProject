const mongoose = require('mongoose');
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { setHeaders } = require('./middleware/headerMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');
const bookRoutes = require('./routes/book');

dotenv.config();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(setHeaders);

app.use('/auth', authRoutes);
app.use('/book', bookRoutes);

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
