var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
// express sanitizer should be put after body parser only
app.use(expressSanitizer());              
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

var blogSchema= new mongoose.Schema({
    title : String,
    image :String,
    body : String,
    created : {type : Date ,default:Date.now}
});

var Blog = mongoose.model("Blog" , blogSchema);

// Blog.create({
//     title:"Sample Title",
//     image :"https://cdn.makeawebsitehub.com/wp-content/uploads/2017/03/examples-of-blog.jpg",
//     body : "sample body"
// });

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs}); 
       }
   });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog,function(err,newBlog){
       if(err){
           res.render("/blogs/new");
       }else {
           res.redirect("/blogs");
       }
   }) ;
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id , function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else
        {
            res.render("show" , {blog : foundBlog});
        }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err ,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("edit" , {blog : foundBlog});
        }
    });
});

app.put("/blogs/:id" , function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err , UpdatedBlog){
        if(err){
            res.redirect("/blogs");
        }else {
           res.redirect("/blogs/" + req.params.id);
        } 
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});









app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
})