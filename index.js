require('dotenv').config();
const express = require("express")
const session = require("express-session");
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy =require('passport-local').Strategy


const server =express();
const logger =require('morgan')

server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,maxAge:60000 }
  }));



  //initialize passport as middleware
  server.use(passport.initialize())
  server.use(passport.session())

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  
server.use(express.static(process.env.STATIC_FOLDER))
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));


//custom middleware
server.use((req,res,next)=>{
    console.log(req.method,req.ip,req.path)
    next();
})
server.use(logger());

//express-session
server.get('/test',(req,res)=>{
    res.session.test? res.session.test++ :res.session.test = 1;
    res.send(req.session.test.toString())
  })

  //passportJS

  server.post('/login/password',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
  });


  //get request
server.get('/home',(req,res) => {
    res.json({"name":"good evening"})
})

//post request
server.post('/person',(req,res) => {
    let personName = req.body.name;
    let age =req.body.age
    res.json({name:personName,age})
})



//listen
server.listen(process.env.PORT,(req,res)=>{
    console.log(`server running on `,process.env.PORT)
})