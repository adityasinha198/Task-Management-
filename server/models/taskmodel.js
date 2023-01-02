const  mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema

const taskschema = new mongoose.Schema({

  
    taskname:{ 
        type:String

    },
    assignedto:{
        type:String
    },
    assignedby:{
        type:String
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
        default:'pending'
        
    }
    


},{timestamps:true})


module.exports = mongoose.model("Task",taskschema)