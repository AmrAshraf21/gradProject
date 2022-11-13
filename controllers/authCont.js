const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/user.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"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"
  }
}))

exports.signup = async (req, res, next) => {
  try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { firstName, lastName, email, password, confirmPassword } = req.body;
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
   await transporter.sendMail({
      to:email,
      from:'amrashraf314@gmail.com',
      subject:"Sign up in Our Application Succeeded",
      html:`<h1>You Successfully Sign up</h1>`
    })
   
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
        userId: loadedUser._id.toString(),
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.passwordReset = (req,res,next)=>{
const {email }= req.body;
crypto.randomBytes(32,(err,buffer)=>{

  if(err){
    console.log(err);
    return res.send(400).json({message:"failed"});
  }
  const token = buffer.toString("hex");
  User.findOne({email:email}).then(user=>{
    if(!user){
      return res.status(404).json({message:"email not found in database"})
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now()+3600000;
    return user.save();

  }).then(result=>{
    transporter.sendMail({
      to:email,
      from:"amrashraf314@gmail.com",
      subject:"Reset Your Password",
      html:`<h1>Forgot Your Password?</h1>
        <p>Click the link to reset <a href="http:localhost:5000/reset/${token}">Click here</a></p>
        `
    }).then(()=>{
      return res.status(200).json({message:'reset password',token:token})
    })
  })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    res.send(500).json({message:"Server Error"});
    return next(error);
  })
})


}

