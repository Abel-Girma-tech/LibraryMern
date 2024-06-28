const mongoose = require('mongoose');


const newUserSchema = mongoose.Schema({
    username : {type:String , required: true , unique : true , trim:true},
    email : {type:String , required: true , trim:true , email:true},
    password : {type:String , required: true , trim:true , minlength : [8]},

}, {timestamps:true}
);



const userModel = mongoose.model('bookStoreUser' , newUserSchema);

module.exports = userModel;