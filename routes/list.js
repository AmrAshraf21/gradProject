const express = require('express');
const router = express.Router();
const listController = require("../controllers/listCont");
const { verifyTokenAndAuthorization } = require('../middleware/validateToken');

router.get('/wishlist/:userId', verifyTokenAndAuthorization, listController.getWishlist);
router.put('/addToWishlist', verifyTokenAndAuthorization, listController.addToWishlist);
router.put('/RemoveFromWishlist', verifyTokenAndAuthorization, listController.removeFromWishlist);

router.get('/favorits', verifyTokenAndAuthorization, listController.getFavorits);
router.put('/addToFavorits', verifyTokenAndAuthorization, listController.addToFavorits);
router.put('/removeFromFavorits', verifyTokenAndAuthorization, listController.removeFromFavorits);

router.get('/alreadyread', verifyTokenAndAuthorization, listController.getRead);
router.put('/addToAlreadyRead', verifyTokenAndAuthorization, listController.addToRead);
router.put('/removeFromAlreadyRead', verifyTokenAndAuthorization, listController.removeFromRead);

module.exports = router;