const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/user.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require('dotenv');
dotenv.config();


const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:`${process.env.SENDGRID_API}`
       ,
    },
  })
);




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

   
    // const subject = `Welcome in out Application ${email}`;
    // const body = `This message come to you because you signin in out application`;
    // const html = `<h1>Welcome</h1>`
    // await sendGridMail.send(getMessage(email,subject,body,html));
    
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

    res.status(200).json({
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

exports.passwordReset =  async(req, res, next) => {
  try{
    const { email } = req.body;
    let randomCode;
  const userExists  = await User.findOne({ email: email })
      if(!userExists){
        const error = new Error("this is Email Not Found");
        error.statusCode = 401;
        throw error;      
      
      }
       randomCode = Math.ceil(Math.random() * 1000000);
      const resetToken =  jwt.sign({
        _id: userExists._id,
        firstName: userExists.firstName,
        email: userExists.email,
        code:randomCode,
      },"secretkeytoencryptthetoken",
      { expiresIn: "1h" });
      userExists.resetToken = resetToken;
      userExists.resetTokenExpiration = Date.now() + 3600000;
      const savedUser= await userExists.save();
      const subject = `Reset Password`;
       const body = `This message come to you because you Want to reset your password with code below ${email}`;
      const html = `<h1>${randomCode}</h1>`
      await transporter.sendMail({
        text:"Hello",
        to:savedUser.email,
        from:"amrashraf159357@gmail.com",
        html:`<h1>${randomCode}</h1>`,
        subject:"this is reset password"

      })
     


     res.status(200).json({message:"Reset Password",code:randomCode});
   

  }catch(error){
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
    

  }











  // sendGridMail.setApiKey(`${process.env.SENDGRID_API}`);

// const getMessage =(email,subject,body,html)=>{
//   return {
//     to:email ,
//     from: 'amrashraf314@gmail.com',
//     subject:subject,
//     text: body,
//     html:html,
//   };}





//     if (userExists) {
//       let randomCode = Math.ceil(Math.random() * 1000000);
//       const resetToken =  jwt.sign({
//         _id: userExists._id,
//         firstName: userExists.firstName,
//         email: userExists.email,
//         code:randomCode,
//       },"secretkeytoencryptthetoken",
//       { expiresIn: "1h" });
//       let receiver = userExists.email;
//       let sender = "amrashraf314@gmail.com";
//       let subject = "Reset Your Password";
//       let text = "Use the Recovery Code below to restore your password";
//       let html = `<p>${randomCode}</p>`

//       const sendEmail = await transporter.sendMail({

//         to:receiver,
//         from:sender,
//         subject:subject,
//         text:text,
//         html:html
//       })
      
// console.log("send",sendEmail);
//     }
















  //if (result.success) {
  //           let randomCode = Math.random() * 1000000;

  //           payload = {
  //               _id: result.record._id, name: result.record.name, email: result.record.email,
  //               role: result.record.role, code: randomCode
  //           }
  //           const token = jwt.generateToken(payload);

  //           let reciever = result.record.email;
  //           let subject = "Reset Your Password";
  //           let text = "You have forgotten your password, here is your recovery code";
  //           let html = `<h1>${randomCode}</h1>`
  //           const email = await sendEmail(reciever, subject, text, html)
  //           console.log(`email`, email);
  //           if (email) res.status(email.code).json({ email, token, info: email.info });
  //           else res.status(email.code).json(email);
  //       }

  // let randomCode = Math.random() * 1000000;
//};

// crypto.randomBytes(32,(err,buffer)=>{
//   console.log(buffer.toString("hex"));
//   if(err){
//     console.log(err);
//     return res.send(400).json({message:"failed"});
//   }
//   const randomCode = buffer.toString("hex");
//   User.findOne({email:email}).then(user=>{
//     if(!user){
//       return res.status(404).json({message:"email not found in database"})
//     }
//     user.resetToken = randomCode;
//     user.resetTokenExpiration = Date.now()+3600000;
//     return user.save();

//   }).then(result=>{
//     transporter.sendMail({
//       to:email,
//       from:"amrashraf314@gmail.com",
//       subject:"Reset Your Password",
//       text:"",
//       html:`<h1>Forgot Your Password?</h1>
//         <p>Click the link to reset <a href="http:localhost:5000/reset/${token}">Click here</a></p>
//         `
//     }).then(()=>{
//       return res.status(200).json({message:'reset password',token:token})
//     })
//   })
//   .catch(err=>{
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     res.send(500).json({message:"Server Error"});
//     return next(error);
//   })
// })

// exports.generateRecoveryCode = async (req, res) => {
//   try {

//       const result = await client.isExist({ email: req.body.email })
//       if (result.success) {
//           let randomCode = Math.random() * 1000000;

//           payload = {
//               _id: result.record._id, name: result.record.name, email: result.record.email,
//               role: result.record.role, code: randomCode
//           }
//           const token = jwt.generateToken(payload);

//           let reciever = result.record.email;
//           let subject = "Reset Your Password";
//           let text = "You have forgotten your password, here is your recovery code";
//           let html = `<h1>${randomCode}</h1>`
//           const email = await sendEmail(reciever, subject, text, html)
//           console.log(`email`, email);
//           if (email) res.status(email.code).json({ email, token, info: email.info });
//           else res.status(email.code).json(email);
//       }
//   } catch (err) {
//       console.log(`err.message`, err.message);
//       res.status(500).json({
//           success: false,
//           code: 500,
//           error: "Unexpected Error!"
//       });
//   }

// }

// const nodemailer = require("nodemailer");

// exports.sendEmail = async (receiver, subject, text, html) => {
//     let transporter = nodemailer.createTransport({
//         //host: "smtp.ethereal.email",
//         service: 'gmail',
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.USER,
//             pass: process.env.PASS,
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });

//     transporter.sendMail(
//         {
//             from: '"Node Mailer" <foo@example.com>',
//             to: receiver,
//             subject,
//             text,
//             html
//         },
//         (error, info) => {
//             if (error) return { error, success: false, code: 409 };
//             if (info) return { info, success: true, code: 201 };
//         }
//     );

// }
