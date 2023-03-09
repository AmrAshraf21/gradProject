const express = require('express');
const router = express.Router();
const listController = require("../controllers/listCont");
const { validateToken, verifyTokenAndAuthorization } = require('../middleware/validateToken');

router.get('/wishlist', verifyTokenAndAuthorization, listController.getWishlist);
router.put('/addToWishlist', validateToken, listController.addToWishlist);
router.put('/RemoveFromWishlist', validateToken, listController.removeFromWishlist);

router.get('/favorits', validateToken, listController.getFavorits);
router.put('/addToFavorits', validateToken, listController.addToFavorits);
router.put('/removeFromFavorits', validateToken, listController.removeFromFavorits);

router.get('/alreadyread', validateToken, listController.getRead);
router.put('/addToAlreadyRead', validateToken, listController.addToRead);
router.put('/removeFromAlreadyRead', validateToken, listController.removeFromRead);

module.exports = router;