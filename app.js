//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const PORT = process.env.PORT;
mongoose.connect('mongodb+srv://BABA-J:Sweetjesus2@baba-j.1lyrm.mongodb.net/todolistDB');

const homeDefault1 = "For me, becoming isn’t about arriving somewhere or achieving a certain aim. I see it instead as forward motion, a means of evolving, a way to reach continuously toward a better self. The journey doesn’t end.”";
const homeDefault2 = "Be courageous. Challenge orthodoxy. Stand up for what you believe in. When you are in your rocking chair talking to your grandchildren many years from now, be sure you have a good story to tell.";
const homeDefault3 = "People tell you the world looks a certain way. Parents tell you how to think. Schools tell you how to think. TV. Religion. And then at a certain point, if you’re lucky, you realize you can make up your own mind. Nobody sets the rules but you. You can design your own life.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema = new mongoose.Schema({
  title: String,
  posts:String
});


const Blogs = new mongoose.model('Blog', blogSchema);
const defaultItems = [{title: "Michelle Obama", posts:homeDefault1},{title:"Amal Clooney" ,posts:homeDefault2},{title:"Carrie Ann Moss",posts:homeDefault3}];

app.get("/", function(req, res){
  Blogs.find({}, function(err,docs){
    if(err){
      console.log(err);
    }else if (docs.length===0) {
      Blogs.insertMany(defaultItems, function(err,result){

          res.render("home", {startingContent: result ,postAuthor: result});
       });

    }else {
      console.log('default items already exist!');
      Blogs.find({}, function(err,result){

  const arr = Object.values(result);
          res.render("home", {startingContent: arr ,postAuthor: arr});
      });
    }
  });

});

app.get("/about", function(req, res){
  res.render("about",{Date:date.getDate()});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  Blogs.create({title:post.title, posts:post.content}, function(err,result){
    if (!err) {
      res.redirect("/");
    }else {
      console.log(err);
    }
  });

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

Blogs.findOne({title: req.params.postName}, function(err,result){

  res.render('post',{startingContent:result});
});


});
app.post('/delete', function(req,res){


  Blogs.findOneAndDelete(req.body.button, function(err){
    if (!err) {
      res.redirect('/');
    }
  });
});

app.listen(PORT, function() {
  console.log('Server started on port ${PORT}');
});
