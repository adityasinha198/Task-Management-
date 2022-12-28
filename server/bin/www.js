const app = require('../app')
const http = require('http')
const mongoose = require('mongoose')


mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017/TaskManagement',{
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err)=>{
    if (err) {
        console.log("err", err);
    }
    console.log('Connected')
})

// try{

//     

// }

// catch(err){
//     console.log(err)
//     console.log('Not able to connect')
// }

const port = 8000
app.set('port',port)

const server = http.createServer(app)
server.listen(port)




