const express = require('express')

const router = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        let extname = file.originalname
        console.log(extname)
        let toarr = extname.split(".")
        console.log(toarr)
        let final = toarr[1]
        console.log(final)
        
       
        cb(null,file.fieldname+`.${final}`)


    }
})


const upload = multer({storage:storage})

const usercontroller = require('../controller/usercontroller')
const authenticate = require('../services/auth/jwt')

router.post('/signup',(req,res,next)=>{
    console.log("Hello")
    usercontroller.signup(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    })

    
})


router.post('/login',(req,res,next)=>{

    usercontroller.login(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    })


})


router.get('/changepass/:id',(req,res,next)=>{

    usercontroller.changepass(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    })

})


router.post('/finallpass/:id',(req,res,next)=>{
    usercontroller.finallpass(req)
    .then(resp=>{
        res.send(resp)
    })
    .catch(err=>{
        res.status(500).send(err)
    })
})



router.post('/forgetpass',(req,res,next)=>{

    usercontroller.forgetpass(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    })



})

router.post('/createproject',authenticate.authenticate,(req,res,next)=>{

    usercontroller.createproject(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    })
})

router.post('/addmember',authenticate.authenticate,(req,res,next)=>{
    usercontroller.addmembers(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    })
})


router.get('/signup',(req,res,next)=>{

    usercontroller.getaddsignup(req)
    .then(resp=>{
        res.send(resp)
       
    })
    .catch(err=>{
        res.status(500).send(err)
    })

    
})

router.get('/projects',authenticate.authenticate,(req,res,next)=>{

    usercontroller.getprojects(req)

    .then(resp=>{
        res.send(resp)
    })
    .catch(err=>{
        res.send(500).status(err)
    })

})


router.get('/getprojectuser',authenticate.authenticate,(req,res,next)=>{
    usercontroller.getprojectuser(req)

    .then(resp=>{
        res.send(resp)
    })
    .catch(err=>{
        res.status(err)
    })

})

router.post("/assigntask",authenticate.authenticate,upload.single('test'),(req,res,next)=>{
    
    usercontroller.assigntask(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    })

})


router.get('/gettask',authenticate.authenticate,(req,res,next)=>{

    usercontroller.gettask(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    }

    )

})


router.post('/updatestatus',authenticate.authenticate,(req,res,next)=>{

    usercontroller.updatestatus(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{
        res.status(500).send(err)
    })
})

router.post('/updateprofile',authenticate.authenticate,(req,res,next)=>{
    
    usercontroller.updateprofile(req)

    .then(resp=>{
        res.send(resp)
    })

    .catch(err=>{

        res.status(500).send(err)
    })



}
)



module.exports = router