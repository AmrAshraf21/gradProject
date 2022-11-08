const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const bodyParser = require('body-parser');

app.use(bodyParser.json())
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

app.use('/',authRoutes);

app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log(status);
  console.log(message);
  console.log(data);
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect("mongodb+srv://maryam:recobooks@cluster0.fhsy9vt.mongodb.net/book")
  .then((result) => {
    console.log("connected");
    app.listen(5000);
  })
  .catch((err) => console.log(err));
