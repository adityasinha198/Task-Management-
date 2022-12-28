const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId } = Schema

const projectschema = new mongoose.Schema({
    title:{
        type:String
    },
   createdby:{
    type:String
   },
    participants:[{
        type:ObjectId,
        unique:true,
        ref:"User"
        
}]
    
})


module.exports = mongoose.model('Project',projectschema)