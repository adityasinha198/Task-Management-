const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema

const inviteschema = new mongoose.Schema({

    email:{
        type:String
    }


},{timestamps:true})


module.exports = mongoose.model('Invite',inviteschema)