const mongoose = require("mongoose");

const interactionsSchema = mongoose.Schema({
    book_id_set:Number,
    book_id:{
        type:mongoose.Types.ObjectId,
        ref:"Book"
    },
    title:String,
    ratings:Number,
    ratings_count:Number,
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    is_read:Number,
    rating:Number,
    is_reviewed: Number




})



const Interaction = mongoose.model("Interaction",interactionsSchema);

module.exports = Interaction;