const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interactScehema = new mongoose.Schema({
    user_id: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    book_id: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Book',
        }
    ],
    rating: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Book',
        }
    ],
    is_reviewed: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
});