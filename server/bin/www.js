const app = require('../app')
const http = require('http')
const mongoose = require('mongoose')
const SocketIo = require('socket.io')


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
var io = SocketIo(server)




try{


io.on('connection', (socket)=>{
    console.log('New user connected');
     //emit message from server to user
     socket.emit('newMessage', {
       from:'jen@mds',
       text:'hepppp',
       createdAt:123
     });

    


    socket.on('createMessage', (newMessage)=>{
        console.log('newMessage', newMessage);
      });
     
      // when server disconnects from user
      socket.on('disconnect', ()=>{
        console.log('disconnected from user');
      })

    })



    }
     


catch(err){
    console.log(err)
}


server.listen(port)






