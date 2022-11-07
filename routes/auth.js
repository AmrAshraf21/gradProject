const express = require('express');
const router = express.Router();
const authController = require('../controllers/authCont');
router.get('/login',(req,res,next)=>{
    res.status(200).json({message:"Login page"})

})
router.post('/login',authController.login)


module.exports = router;