const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  book_id:{
   type:Number,
   required:true,
   unique:true,
   index:true,
  },
  ratings:{
   type:Number,
   required:true
  },
  title:{
   type: String,
   required: true,
   unique: true,
  },
  url:{
   type: String,
   required: true
  },
  cover_image:{
   type: String,
   required: true,
   default: ""
  },
  mod_title:{
   type: String,
   required: true
  },
  description: {
    type: String,
    required: true
  },
  ratings_count: {
    type: Number
  },
  publication_year: Number,
  country_code: String,
  publisher: String,
  isbn13: String
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);