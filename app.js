//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:admin123@cluster0-odccj.mongodb.net/postsDB?retryWrites=true&w=majority");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);



app.get("/", function(req, res){
  Post.find({}, function(err, data){
    if(err){
      console.log("ERRROR!");
    }
    else{
      res.render("home", {homeContent : homeStartingContent, posts: data});
    }
  });
  //console.log(posts);
});


app.get("/about", function(req, res){
  res.render("about", {abtContent: aboutContent });
});

app.get("/contact", function(req, res){
  res.render("contact", {conContent: contactContent });
});

app.get("/compose", function(req, res){
//  console.log(req.body.content
console.log(req.body.title);

  res.render("compose", {title: "null", content: ""});
});


app.post("/compose", function(req, res){

  Post.findOne({title: req.body.title}, function(err, found){
    if(found == null){
      let post = new Post({
        title: _.lowerCase(req.body.title),
        content: _.capitalize(req.body.postBody)
      });
      post.save();

      res.redirect("/")
    }
    else{
      res.render("compose", {title: req.body.title, content: req.body.postBody});
    }
  });


});



app.get("/posts/:postName", function(req, res){
    Post.findOne({title: req.params.postName}, function(err, found){
      console.log(found);
        let postTitle = _.lowerCase(found.title);
        let linkTitle = _.lowerCase(req.params.postName);
        if(postTitle === linkTitle){
          res.render("post", {title: _.capitalize(postTitle), content: found.content});
        }
      });

    });


app.post("/delete", function(req, res){
  //console.log(req.body.titleName);
  Post.deleteOne({name: req.body._id}, function(err, result){
    if(!err){
      console.log(result);
      res.redirect("/");
    }
  });

});




app.listen(process.env.PORT ||3000, function() {
  console.log("Server started on port 3000");
});
