const mongoose = require('mongoose')
const user = require('../models/usermodel')
const usermodel = mongoose.model('User')
// const project = require('../models/projectmodel')
// const projectmodel = mongoose.model("Project")
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
const invite = require('../models/invitemodels')
const invitemodel = mongoose.model('Invite')


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
            user.role = req.body.role
         

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


            console.log("Invite")

           


            const invite = await invitemodel.findOne({email:req.body.email})

            if(invite){

               return { 
                status:402,
                success:false,
                message:"Member Already invited",
                data:invite
               }

               }

            


            else{


            console.log("Hello")
            const invite = new invitemodel()

            invite.email = req.body.email

            await invite.save()
            .then(resp=>{
                console.log(resp)
            })

            .catch(err=>{
                console.log(err)
            
            })
            

        // const projectid = req.body.projectid

        let data = {
            message:"Invitation Link",
            email:req.body.email,
            url:`http://192.168.29.179:3000/auth/signup/${req.body.role}`
        
            }

            const html = `<body><b>Click below to accept invite</b><br>
            <a href="${data.url}">http://192.168.29.179:3000/auth/signup/${req.body.role}</a>
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

        }
        catch(err){
            console.log(err)
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


    console.log("FIle",req.file)

    if(req.file==undefined){


        return{
            succes:false,
            status:400,
            message:"Task not assigned"
        }
    }

    let filename = req.file.originalname

    
let array = []

fs.createReadStream(`./uploads/${filename}`)
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {

        array.push(row)

    })
  .on("end", async function () {
    // console.log(array)
    console.log("length",array.length)

    for(let i =0;i<array.length;i++){
        console.log("Done")
        console.log("i value",i)
       

        if(array[i][2]&&array[i][3]&&array[i][4]&&array[i][5]&&array[i][6]&&array[i][7]){

            let task = await new taskmodel()

            const x = new Date(array[i][5])
            const y = new Date(array[i][6])
            console.log("Date1",x)
            console.log('Datw2',y)
        

        
        
        // task.project = new ObjectId(array[i][1])
        task.taskname = array[i][2]
        task.assignedto = new ObjectId(array[i][3])
        task.assignedby = array[i][4]
        task.assignedate= new Date(array[i][5])
        task.startdate = new Date(array[i][6])
        task.enddate  = new Date(array[i][7])
        if(x<y){
            task.status = "upcoming"
        }
       
       

        await task.save()
        .then(res=>{
            console.log(res)
            })

        .catch(err=>{
            console.log(err)

            return{
                    message:"Some problem",
                    succes:false,
                    status:400
                  
            }
        })

    }
    


    }

    // console.log("finished", array);


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
        // console.log(req.query.projectId)

        let user= await usermodel.findOne({assignedto:req.userid})

        if(user){

        let task = await usermodel.find({assignedto:user.email})

        

        return {

            message:"Tasks",
            data:task,
            status:200,
            succes:true

        }

        }




        
        console.log(task)


        
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

            console.log("Inside this")

            console.log(req.userid)

          

            

            let pending = await taskmodel.aggregate(
                [
                    {
                    $match: {
                        
                        assignedto:ObjectId(req.userid),status:"pending"
                    }
                    },
                    {
                        $count:"pending"
                    }
                ]
            ) 


            let completed = await taskmodel.aggregate(
                [
                    {
                    $match: {
                        
                        assignedto:ObjectId(req.userid),status:"completed"
                    }
                    },
                    {
                        $count:"completed"
                    }
                ]
            ) 


            let active = await taskmodel.aggregate(
                [
                    {
                    $match: {
                        
                        assignedto:ObjectId(req.userid),status:"active",
                    }
                    },
                    {
                        $count:"active"
                    }
                ]
            ) 


            let upcoming = await taskmodel.aggregate(
                [
                    {
                    $match: {
                        
                        assignedto:ObjectId(req.userid),status:"upcoming",
                    }
                    },
                    {
                        $count:"upcoming"
                    }
                ]
            ) 


            console.log("Pending",pending)
            console.log("completed",completed)
            console.log("upcoming",upcoming)
            console.log("active",active)


            



            return {

                status:200,
                succes:true,
                data:{
                    pending:pending,
                    completed:completed,
                    upcoming:upcoming,
                    active:active
                }
            }




            

        


            

           
        }


        catch(err){
            console.log(err)
        }


    }



    async data(req){
        try{
            let user = await usermodel.findOne({_id:req.userid})
            let name = user.name.split(" ")
            if(user){
                return {
                    status:200,
                    succes:true,
                    message:"User Detais",
                    user,
                    name
                }
            }
            else{
                return{
                    status:400,
                    success:false,
                    message:"No data found"
                }
            }
        }
        catch(err){
            console.log(err)
        }
    }


    async deletemember(req){

    console.log(req.params.id)

    try{

    let del = await usermodel.deleteOne({_id:req.params.id})

    console.log(del)

    let deltask = await usermodel.deleteOne({assignedto:req.params.id}) 
    console.log(deltask)

    if(del && deltask){
        return {

            succes:true,
            status:200,
            message:"Deleted successfully"
        }
    }

    else{

        return {
            succes:false,
            status:400,
            message:"Not deleted"
        }
    }

    }
    catch(err){


     console.log(err)
    }



}


   
}

module.exports = new usercontroller()