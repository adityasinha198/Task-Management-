const mongoose = require('mongoose')
const user = require('../models/usermodel')
const usermodel = mongoose.model('User')
const project = require('../models/projectmodel')
const projectmodel = mongoose.model("Project")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('../mailer/mail')
const { ObjectId } = require('mongodb')
const { rawListeners } = require('../app')
const multer = require('multer')
const fs = require('fs')
const {parse} = require('csv-parse')
const task = require('../models/taskmodel')
const taskmodel = mongoose.model('Task')
const moment = require('moment')


class usercontroller{
    async signup(req){


        try{

           const existemail = await usermodel.findOne({email:req.body.email})

           if(existemail){
            

            return {
                message:"Email ALredy existed"
            }


            
           }

           else{

            console.log(req.body)

            const password = req.body.password

            const encrypted = bcrypt.hashSync(password,bcrypt.genSaltSync(8),null)
            console.log("encrypt",encrypted)
            

            const user = new usermodel()

            user.name = req.body.name
            user.email = req.body.email
            user.password = encrypted
            user.contactno = req.body.number
         

            const info = await user.save()
            console.log(info._id)

           

            return {
                succes:true,
                message:"Signup Succesfully",
                data:info,
                status:200
               


            }

        }

         
        }
        catch(err){

            console.log(err)
        }

    }



    async login(req){

        try{
           const existemail = await usermodel.findOne({email:req.body.email})

           if(existemail){

            const compare = bcrypt.compareSync(req.body.password,existemail.password)
            if(compare){
                console.log(existemail._id)
                const token =await jwt.sign({uid:existemail._id},"jwtsecretkey")
                console.log("token",token)

                if(req.query.projectId){

                    let project = await projectmodel.findOne({_id:req.query.projectId})
                    if(project){
                        console.log(project)
                    
                        let userarray = project.participants
                        console.log("userarray",userarray)
                        userarray.push([new ObjectId(existemail._id)])

                        let updateprojectarray = await projectmodel.updateOne({_id:req.query.projectId},{participants:userarray})

                        console.log("Project updated")

                    }
                    else{
                        console.log('Not in project')
                    }



                    let pid = req.query.projectId
                    let updatearray = existemail.projects
                    console.log(updatearray)
                    updatearray.push(new ObjectId(pid))

                    let array = [new ObjectId(pid)]
                    let updateuser = await usermodel.updateOne({_id:existemail._id},{projects:updatearray})

                    console.log(updateuser)

                    return {
                        status:200,
                        succes:true,
                        message:"Member added and Logedin successfully",
                        data:updateuser,
                        token:token
                    }
                
                }

                
                

                return {
                    succes:true,
                    status:200,
                    message:"Login SUccesfully",
                    token:token,
                    data:existemail
                }

            }

            else{
                return {
                    message:"Wrong Password",
                    succes:false,
                    status:400
                }

            }
           }

           else{


                return {
                message:"Invalid credentials",
                status:401,
                succes:false
             }
        }

        }
        catch(err){
            console.log(err)
        }



    }


    async forgetpass(req){

        console.log(req.body.email)

        const existemail = await usermodel.findOne({email:req.body.email})
        if(existemail){
            console.log(existemail)

            let data = {
                message:"Reset Password",
                email:req.body.email,
                url:`http://localhost:8000/user/changepass/${existemail._id}`
            
                }
            const html = `<body><b>Click below button to reset password</b><br>
            <a href="${data.url}">Click to reset Password</a>
            </body>`

            const succes =  mailer.maling(data,html)

            return{
                message:'Email sent successfully',
                status:200,
                succes:true
            }
        }

        else{

            return {
                message:"Wrong emailid",
                succes:false,
                status:400
            }
        }

        
    }



  


    async finallpass(req){

        console.log("Final Password")

        console.log(req.params.id)

        console.log("New Password",req.body.new_password)

        
        try{



        let existemail = await usermodel.findOne({_id:req.params.id})

        if(existemail){

        const encrypt = await bcrypt.hashSync(req.body.new_password,bcrypt.genSaltSync(8))

        console.log(existemail)
        let updatedinfo = await usermodel.updateOne({id:req.params.id},{password:encrypt})
        console.log("Email updated")

        return {
            message:"Password updated",
            succes:true,
            status:200
        }
        }

        else{
            console.log("Nothing exist")
            return {
                message:"Email not found",
                succes:false,
                status:400
            }
        }

        
    }
        catch(err){
            console.log(err)
        }

    }


    async createproject(req){

      try{

        const project = new projectmodel()

        project.title = req.body.title
        project.createdby = new ObjectId(req.userid)
        
        let info = await project.save()

        console.log(info._id,info.title)

            return {

            title:info.title,
            project:project,
            succes:true,
            status:200

        }
        
        
        }

        catch(error){
        console.log(error)
    }
        
    }


    async addmembers(req){


    
        try{

        const projectid = req.body.projectid

        let data = {
            message:"Invitation Link",
            email:req.body.email,
            url:`http://localhost:8000/user/signup?projectId=${projectid}`
        
            }

            const html = `<body><b>Click below to accept invite</b><br>
            <a href="${data.url}">Invitation</a>
            </body>`

            const success =  mailer.maling(data,html)
            if(success){

                return {
                    status:200,
                    success:true,
                    message:"Invitatiion Link Sent"
                }

            }

        }
        catch(err){
            console.log(err)
        }

                
        }


    async getaddsignup(req){

        console.log("Inside get signup")

        console.log(req.query.projectId)

        return {
            message:"Signup Page opened",
            status:200,
            succes:true
        }


    }

    async getprojects(req){

        try{
        
            console.log(req.userid)


        let data = await usermodel.findOne({_id:req.userid}).populate('projects')
        
        console.log(data)

        return {
            message:"Projects Info",
            projects:data.projects,
            succes:true,
            status:200

        }


        }

        catch(err){
            console.log(err)
        }




    }



    async getprojectuser(req){

        try{


        console.log(req.query.projectId)

        let data = await projectmodel.findOne({_id:req.query.projectId}).populate('participants')

        console.log(data)


        return {
            message:"Project Members",
            members:data.participants,
            status:200,
            succes:true
        }

    }
    catch(err){
        console.log(err)
    }


}


async assigntask(req){
   
try{
let array = []

fs.createReadStream("./uploads/test.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {

        array.push(row)

    })
  .on("end", async function () {
    console.log(array)
    console.log("length",array.length)

    for(let i =0;i<array.length;i++){
        console.log("Done")
        console.log("i value",i)
        let task = await new taskmodel()
        
        task.project = new ObjectId(array[i][1])
        task.taskname = array[i][2]
        task.assignedto = new ObjectId(array[i][3])
        task.assignedby = new ObjectId(array[i][4])
        task.assignedate= new Date(array[i][5])
        task.startdate = new Date(array[i][6])
        task.enddate  = new Date(array[i][7])
        task.status = array[i][8]
       

        await task.save()
        .then(res=>{
            console.log(res)
            })

        .catch(err=>{
            console.log(err)
        })
    }

    console.log("finished", array);


    })
  .on("error", function (error) {
    
    console.log(error.message);
  });


  return{

    message:"task assigned successfully",
    succes:true,
    status:200
  }

}
catch(err){
    console.log(err)
}

   

    




}

async gettask(req){


    try{

        console.log(req.userid)
        console.log(req.query.projectId)

        let task = await taskmodel.find({assignedto:req.userid,project:req.query.projectId})
        console.log(task)


        return {

            message:"Tasks",
            data:task,
            status:200,
            succes:true

        }

    }
    catch(err){
        console.log(err)


    }

    
}


async updatestatus(req){


    console.log(req.body.taskid)
    console.log(req.userid)
    console.log(req.body.status)

    try{
        

    let task = await taskmodel.updateOne({_id:taskid},{status:req.body.status})
    if(task){
        return {
            message:"Status updated successfully",
            data:task,
            status:200,
            succes:true
        }
    }

    else{

        return {
            message:"No such task existed",
            succes:false,
            status:400

        }
    }

    }
    catch(err){
        console.log(err)
    }

}


async notification(req){


}


async updateprofile(req){

    try{

    
    console.log(req.userid)
    console.log(req.body.name)
    console.log(req.body.number)

    

    const update = await usermodel.updateOne({_id:req.userid},{name:req.body.name,contactno:req.body.number})

    console.log(update)

    return {

        message:"Profile updated successfully",
        data:update,
        succes:true,
        status:200
    }


    }
    catch(err){
    
        console.log(err)
    }}




    async gettaskcount(req){

        try{

           let pending = await projectmodel.aggregate(
                [
                    {
                    $match: {
                        
                        isDeleted:false,assignedto:ObjectId(req.userid),status:'Pending'
                    }
                    },
                    {
                    $count: "Pending"
                    }
                ]
            ) 


            console.log("Pending")

           
        }


        catch(err){
            console.log(err)
        }


    }

   
}

module.exports = new usercontroller()