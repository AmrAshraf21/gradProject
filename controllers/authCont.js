const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

let mailTransporter = nodemailer.createTransport({
	service: 'gmail',
	port: 465,
	host: 'smtp.gmail.com',
	secure: true,
	auth: {
		user: `${process.env.SENDING_EMAIL}`,
		pass: `${process.env.PASSWORD_EMAIL}`,
	},
});

exports.signup = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error('validation Failed');
			error.statusCode = 422;
			error.data = errors.array();
			throw error;
		}
		if (!req.file) {
			const error = new Error('No Image Provided');
			error.statusCode = 422;
			throw error;
		}

		const { firstName, lastName, email, password, role } = req.body;
		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User({
			password: hashedPw,
			email,
			firstName,
			lastName,
			role,
			image: req.file.path.replace('\\', '/'),
		});

		const savedUser = await user.save();
		await mailTransporter
			.sendMail({
				from: `${process.env.SENDING_EMAIL}`,
				to: savedUser.email,
				subject: 'Welcome in our application',
				text: 'This mail send to you as a welcome message for registering in our application',
			})
			.then(() => {
				console.log('succeed sending');
			});
		return res.status(201).json({
			message: 'Success,User Created',
			savedUser: savedUser,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	let loadedUser;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error('this is Email Not Found');
			error.statusCode = 401;
			throw error;
		}
		loadedUser = user;

		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) {
			const error = new Error('wrong password , Try Again');
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.sign(
			{
				userId: loadedUser._id.toString(),
				role: loadedUser.role,
			},
			process.env.SECRET_KEY_JWT,
			{ expiresIn: '7d' }
		);

		return res.status(200).json({
			message: 'Login Success',
			token: token,
			userId: loadedUser._id.toString(),
		});
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};

exports.passwordReset = async (req, res, next) => {
	try {
		const { email } = req.body;
		let randomCode;
		const userExists = await User.findOne({ email: email });
		if (!userExists) {
			const error = new Error('this is Email Not Found');
			error.statusCode = 401;
			throw error;
		}
		randomCode = Math.floor(100000 + Math.random() * 900000);
		const resetToken = jwt.sign(
			{
				_id: userExists._id,
				firstName: userExists.firstName,
				email: userExists.email,
				code: randomCode,
			},
			process.end.SECRET_KEY_JWT,
			{ expiresIn: '1h' }
		);
		userExists.resetToken = resetToken;
		userExists.resetTokenExpiration = Date.now() + 3600000;
		const savedUser = await userExists.save();
		const subject = `Reset Password`;
		// const body = `This message come to you because you Want to reset your password with code below ${email}`;
		const html = `This message come to you because you Want to reset your password with code below ${email}<br><h1>${randomCode}</h1>`;
		await mailTransporter.sendMail({
			to: savedUser.email,
			from: `${process.env.SENDING_EMAIL}`,
			html: html,
			subject: subject,
		});

		res.status(200).json({
			message: 'Reset Password',
			code: randomCode,
			resetToken: resetToken,
		});
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};

exports.postNewPassword = async (req, res, next) => {
	try {
		const { resetToken, newPassword } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error('Reset Failed');
			error.statusCode = 422;
			error.data = errors.array();
			throw error;
		}
		const userMatch = await User.findOne({
			resetToken: resetToken,
			resetTokenExpiration: { $gt: Date.now() },
		});

		if (!userMatch) {
			const error = new Error('Something wrong , make a reset again..!');
			error.statusCode = 401;
			throw error;
		}

		const hashPw = await bcrypt.hash(newPassword, 12);
		userMatch.password = hashPw;
		userMatch.resetToken = undefined;
		userMatch.resetTokenExpiration = undefined;
		await userMatch.save();
		res.status(200).json({ message: 'Success Change to a new password' });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getEditProfile = async (req, res, next) => {
	try {
		const { userId } = req.user;
		const user = await User.findById(userId);
		const { password, role, ...other } = user._doc;
		return res.status(200).json({ message: 'Edit User Profile', results: other });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.patchEditProfile = async (req, res, next) => {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			const error = new Error('Validation Error');
			error.data = errors.array();
			error.statusCode = 422;
			throw error;
		}
		let image;
		const { userId } = req.user;
		const { firstName, lastName, email } = req.body;
		
		if (req.file) {
			image = req.file.path.replace('\\', '/');
		}
		if (!image) {
			const error = new Error('No Image Picked');
			error.statusCode = 422;
			throw error;
		}

		 const updateUser = await User.findById(userId);

		 console.log(updateUser);
		 if(!updateUser){
		 	const error = new Error("Could Not Find a User to update his Information");
		 	error.statusCode = 404;
		 	throw error;
		 }
		
		 if (updateUser._id.toString() !== userId) {
		 	const error = new Error("Not Authorized");
		 	error.statusCode = 403;
			
		 	throw error;
		   }
		   console.log(image);
		   console.log("-----");
		   console.log(updateUser.image);
		//   if(image !== updateUser.image || image === updateUser.image){
		//  	clearImage(updateUser.image);
		//  }
		 updateUser.image = image;
		 updateUser.firstName = firstName;
		 updateUser.lastName = lastName;
		 updateUser.email= email;

		    console.log(updateUser);
		await updateUser.save();
		return res.status(201).json({message:"profile updated successfully.",results:updateUser})
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) => {
		console.log(err);
	});
};
