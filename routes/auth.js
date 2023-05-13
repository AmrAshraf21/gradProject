const express = require('express');
const { body, check } = require('express-validator');
const router = express.Router();
const User = require('../models/user');
const authCont = require('../controllers/authCont');
const { verifyTokenAndAuthorization } = require('../middleware/validateToken');

router.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.normalizeEmail()
			.withMessage('Please Enter a Valid Email')
			.custom(async(value, { req }) => {
				return await User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('Email Address is Already Exists');
					}
				});
			}),
		check('password').trim().isLength({ min: 5 }).withMessage('please enter a strong password'),
		check('firstName').trim().not().isEmpty(),
		check('lastName').trim().not().isEmpty(),
		check('image',"Please Provide an Image")
	],
	authCont.signup
);
router.post('/login', authCont.login);

router.post('/password-reset', authCont.passwordReset);
router.post(
	'/new-password',
	[check('newPassword').not().isEmpty().trim().isLength({ min: 6 }).withMessage('Must provide a password,try again..!')],
	authCont.postNewPassword
);

router.get('/updateprofile', verifyTokenAndAuthorization, authCont.getEditProfile);

router.patch('/updateprofile',
[
    check("email")
      .custom(async(value, { req }) => {
        return await User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email Address is Already Exists");
          }
        });
      }),
   
  ],
    
  
  verifyTokenAndAuthorization, authCont.patchEditProfile);

module.exports = router;
