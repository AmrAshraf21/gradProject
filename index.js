const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


app.use('/auth', authRoutes);

app.get('/auth',(req,res,next)=>{
  res.send("App is running");
})
 
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
