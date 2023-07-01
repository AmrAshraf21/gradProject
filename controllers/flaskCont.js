const mongoose = require("mongoose");
const User = require('../models/user.js');
const { validationResult } = require('express-validator');
const axios = require('axios');

exports.getRecommendations = async (req, res, next) => {

	try {
        const userId = req.body.userId;
		const user = await User.findById(userId);
        console.log()
		if (!req.user) {
			return res.status(401).json({ message: 'Login to continue.' });
		}
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}
        const response = await axios.post('http://127.0.0.1:5000/recommendations/'+user._id.toString());
        console.log( response.data)
		return res.status(200).json({ message: "User's wishlist", results: response.data });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};