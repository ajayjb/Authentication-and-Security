require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/userDB');


const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);


app.get("/", (req, res)=>{
  res.render("home");
});

app.route("/login")
  .get((req,res)=>{
    res.render("login");
  })
  .post((req,res)=>{
    const enterEmail = req.body.username;
    const enterPassword = req.body.password;
    User.findOne({email: enterEmail}, (err, data)=>{
        if (err){
          res.send(err);
        }else{
          if (data){
            if (data.password === enterPassword){
              res.render("secrets");
            }
          }
        }
    });
  });

app.route("/register")
  .get((req, res)=>{
    res.render("register");
  })
  .post((req, res)=>{
    const email = req.body.username;
    const password = req.body.password;
    const user = new User({
      email : email,
      password : password
    });
    user.save((err)=>{
      if(!err){
        res.render("login");
      }else{
        console.log(err);
      }
    });
  });

app.get("/submit", (req, res)=>{
  res.render("submit");
});


app.listen("3000", ()=>{
  console.log("Server is running on port 3000");
});
