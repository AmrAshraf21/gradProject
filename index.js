const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET , POST, PUT ,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use('/auth', authRoutes);

app.get('/auth',(req,res,next)=>{
  res.send("App is running");
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE', 'OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
 
app.use((error, req, res, next) => {
  console.log(error.data);
  console.log(error.message);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data,status:status });
});
const PORT = process.env.PORT || 5000;
const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fhsy9vt.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

mongoose
  .connect(MONGO_URL)
  .then((result) => {
    console.log("connected to Database");
    
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
