const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const interactionsSchema = new Schema({
  book_id_set: Number,
  book_id:
  {
    type: mongoose.Types.ObjectId,
    ref: 'Book'
  },
  title: String,
  ratings: Number,
  ratings_count: Number,
  user_id:
  {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  rating: Number,
  is_reviewed: Number,
  is_read: Number,
  is_wishlist: Number,
  is_favorite: Number
});

const Interaction = mongoose.model('Interaction', interactionsSchema);

module.exports = Interaction;