const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({

    host:'adityasinha198@gmail.com',
    service:'gmail',
    secure:false,
    
    auth:{
        user:'adityasinha198@gmail.com',
        pass:'yvgnirfsbyvmvqcu'// Account=>Security=>App Password=>Custom=>Generate Password, Use generated password here
    }
})

exports.maling = async(data,html)=>{


    console.log(data)



   const info = transporter.sendMail({

    from:"adityasinha198@gmail.com",
    to:data.email,
    subject:data.message,
    html:html
    


})

console.log("info",info)

   

}
