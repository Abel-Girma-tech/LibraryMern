const mongoose = require('mongoose');


const bookSchema = mongoose.Schema({
    title : {type:String , required: true , trim:true},
    author : {type:String , required: true , trim:true},
    year : {type:Date , required: true , trim:true},
    genre : {type:String , required: true , trim:true},
    cover : {type:String , required: true , trim:true},
    desc : {type:String , required: true , trim:true},

}, {timestamps:true}
);



const booksModel = mongoose.model('books' , bookSchema);

module.exports = booksModel;