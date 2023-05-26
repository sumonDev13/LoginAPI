require('dotenv').config();
const express = require("express")
const session = require("express-session");
const bodyParser = require('body-parser')


const server =express();
const logger =require('morgan')

server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,maxAge:60000 }
  }));



server.use(express.static(process.env.STATIC_FOLDER))
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use((req,res,next)=>{
    console.log(req.method,req.ip,req.path)
    next();
})
server.use(logger());

server.get('/test',(req,res)=>{
    res.session.test? res.session.test++ :res.session.test = 1;
    res.send(req.session.test.toString())
  })

server.get('/home',(req,res) => {
    res.json({"name":"good evening"})
})
server.post('/person',(req,res) => {
    let personName = req.body.name;
    let age =req.body.age
    res.json({name:personName,age})
})




server.listen(process.env.PORT,(req,res)=>{
    console.log(`server running on `,process.env.PORT)
})