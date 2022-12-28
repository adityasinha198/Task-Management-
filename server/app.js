const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')


const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())



const userroutes = require('./routes/user')


app.use('/user',userroutes)




module.exports = app
