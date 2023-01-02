const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId } = Schema

const userschema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    
    email:{
            type:String,
            require:true,
           

        },
    password:{
        type:String,
        require:true
    },
    contactno:{
        type:Number
    },
    role:{
        type:String
    },
   
})


module.exports = mongoose.model("User",userschema)
