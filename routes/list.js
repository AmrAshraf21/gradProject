const express = require('express');
const router = express.Router();
const listController = require("../controllers/listCont");
const { verifyTokenAndAuthorization, validateToken } = require('../middleware/validateToken');

router.get('/wishlist', validateToken, verifyTokenAndAuthorization, listController.getWishlist);
router.put('/addToWishlist', validateToken, verifyTokenAndAuthorization, listController.addToWishlist);
router.put('/RemoveFromWishlist', validateToken, verifyTokenAndAuthorization, listController.removeFromWishlist);

router.get('/favorits', validateToken, verifyTokenAndAuthorization, listController.getFavorits);
router.put('/addToFavorits', validateToken, verifyTokenAndAuthorization, listController.addToFavorits);
router.put('/removeFromFavorits', validateToken, verifyTokenAndAuthorization, listController.removeFromFavorits);

router.get('/alreadyread', validateToken, verifyTokenAndAuthorization, listController.getRead);
router.put('/addToAlreadyRead', validateToken, verifyTokenAndAuthorization, listController.addToRead);
router.put('/removeFromAlreadyRead', validateToken, verifyTokenAndAuthorization, listController.removeFromRead);

module.exports = router;