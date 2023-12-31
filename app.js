//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const ejs = require("ejs");


mongoose.set('strictQuery', false);
const encrypt = require("mongoose-encryption");

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect(process.env.URL + "/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});


app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const email = req.body.username;
    const password = req.body.password;
 
    const user = new User({
        email: email,
        password: password
    });
 user.save(function(err){
    if(err){
        console.log(err);
    }
    else{
 res.render("secrets");
    }
 });

});

app.post("/login", function(req,res){
       const username =  req.body.username;
       const password = req.body.password;
User.findOne({email: username}, function(err, foundUser){
    if(err){
        console.log(err);
    }else{
       if (foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }
});
   
});


app.listen(PORT, function(){
    console.log("server started on port 3000");
});
