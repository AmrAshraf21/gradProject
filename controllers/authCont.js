const crypto = require('crypto');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require("../models/user.js");
const { htmlToText } = require('html-to-text');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPw,
      confirmPassword: confirmPassword,
    });

    const savedUser = await user.save();
    res.status(201).json({
      message: "Success,User Created",
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
      const error = new Error("this is Email Not Found");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("wrong password , Try Again");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "secretkeytoencryptthetoken",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({
        message: "Login Success",
        token: token,
        userId: loadedUser._id.toString()
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.passwordReset = async (req, res, next) => {
  const email = req.body.email;
	crypto.randomBytes(32, async (err, Buffer) => {
		if (err) {
			err.statusCode = 500;
      throw err;
    }
    const token = Buffer.toString('hex');
		try {
			const user = await User.findOne({ email: email });
			if (!user) {
				req.flash('error', 'No user found, Check your e-mail and try again.');
			}
			user.resetToken = token;
			user.resetTokenExpiration = Date.now() + 600000;
			await user.save();

			await transporter.sendMail({
				to: email,
				from: 'gradrecobooks@gmail.com',
				subject: 'Reset Password',
				html: `<h2> Forgot your password? </h2>
				<p>click here <a href="http://localhost:5000/reset/${token}"></a> to reset a new password</p>`,
				text: htmlToText.fromString(html)
			});
			res.status(200).json({ message: 'reset password', token: token });
		}	catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	});
};

exports.newPassword = async (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	try {
		const user = await User.findOne({
			resetToken: passwordToken,
			resetTokenExpiration: { $gt: Date.now()},
			_id: userId
		});
		resetUser = user;

		const hashedPw = await bcrypt.hash(newPassword, 12);
		resetUser.password = hashedPw;
		resetUser.resetToken = undefined;
		resetUser.resetTokenExpiration = undefined;
		await resetUser.save();

    res.status(200).json({ message: 'successfull reset', token: token });
	} catch {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};

// exports.testLogin = async(req,res,next)=>{
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation failed");
//     error.statusCode = 422;
//     error.data = errors.array();
//     throw error;
//   }
//   try{
//     const user = await User.findById('6369e676a96845e2643b9be0');
//     res.status(200).json({message:"find" , user,})
//   }catch(err){
//     if(!err.statusCode){
//       err.statusCode = 500;
//     }
//     next(err);
//   }

// }
