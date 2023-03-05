const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
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
    type:String,
    required:true,
    unique:true,
   },
   url:{
    type:String,
    required:true
   },
   cover_image:{
    type:String,
    required:true,
    default:"Must provide A Image"
   },
   mod_tile:{
    type:String,
    required:true
   }
}, { timestamps: true ,})


// bookSchema.pre('save', function (next) {
//     this.rating = Math.floor(Math.random() * 10);
// });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

/*4
   * title of book
   * isbn
   * classification 
   * page count
   * price
   * discount rate
   * rating 
   * publish date
   * short description for home page
   * long description for home
 
*/ 

// discount: {
//     type: Number,
//     validate: {
//         validator: function (value) {
//             return value < 50
//         },
//         message: "Discount must be less than 50%"
//     }
// price: {
//     type: Number,
//     required: true
// },

// rating: {
//     type: Number,
//     required: true,
//     min: [1, "Rating must be positive and greater than 1"],
//     max: [10, "Rating must be less than or equal  10  as a max value"]
// },
// publishDate: Date,

// briefDescription: {
//     type: String,
//     default: "must Write a a brief description here",
//     required: true,
// },
// bookImage: {
//     type: String,
//     required: true,
// },
// fullDescription: {
//     type: String,
//     default: "must provide a full description",
    
// },



/**
 * 
 *  title: {
        type: String,
        required: true,
        unique: true

    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    isbn13:{
        type: String,
        required:true,
        unique:true,
    },
    goodreads_book_id:{
        type:Number
    },
    original_publication_year:{
        type:Number,
    },
    original_title: {
        type: String,
        required: false
      },
      language_code:{
        type:String,
        required:true
      },
      average_rating:{
        type:Number,
        default:0,
        min:0,
        max:5
      },
      ratings_count:{
        type:Number
      },
      ratings_1:{
        type:Number
      },
      ratings_2:{
        type:Number
      },
      ratings_3:{
        type:Number
      },
      ratings_4:{
        type:Number
      },
      ratings_5:{
        type:Number
      },
      image_url:{
        type:String,
        required:true
      },
      small_image_url:{
        type:String
      },
      books_count: {
        type: Number,
        required: true,
        min: 10,
        max: 2000
    },
     isExist: {
        type: Boolean
    },
    authors: {
        type: [String],
        required: true
    },
  
    relatedBooks: [{ type: mongoose.Types.ObjectId, ref: 'Book' }]



 * 
 */