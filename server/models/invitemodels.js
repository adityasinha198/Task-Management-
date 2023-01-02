const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema

const inviteschema = new mongoose.Schema({

    email:{
        type:String
    }


})


module.exports = mongoose.model('Invite',inviteschema)