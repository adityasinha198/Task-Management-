const  mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema

const taskschema = new mongoose.Schema({

    project:{
        type:ObjectId
    },
    taskname:{ 
        type:String

    },
    assignedto:{
        type:ObjectId
    },
    assignedby:{
        type:ObjectId
    },
    assigndate:{
        type:Date
    },
    startdate:{
        type:Date
    },
    
    enddate:{
            type:Date
    },
    status:{
        type:String,
        default:'Pending'
        
    }
    


},{timestamps:true})


module.exports = mongoose.model("Task",taskschema)