const mongoose = require("mongoose");
const express = require("express");
const app = express();
const loginRoutes = require('./routes/auth')
app.use(express.urlencoded({extended:false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods",'OPTIONS,GET , POST, PUT ,PATCH,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
    if(req.method ==='OPTIONS'){
      return res.sendStatus(200);
    }
    next();
  });

app.use(loginRoutes)


mongoose
  .connect("mongodb+srv://amr:amr123456789@cluster0.6vbyr1b.mongodb.net/book")
  .then((result) => {
    console.log("connected");
    app.listen(5000);
     
     
  })
  .catch((err) => console.log(err));

