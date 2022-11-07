const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use("/", (req, res, next) => {
  res.send("hello world");
});

app.listen(5000);
