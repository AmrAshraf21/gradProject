const express = require('express');
const router = express.Router();
const flaskController = require("../controllers/flaskCont");
const { verifyTokenAndAuthorization } = require('../middleware/validateToken');
router.post('/recommendations', verifyTokenAndAuthorization, flaskController.getRecommendations);

module.exports = router;