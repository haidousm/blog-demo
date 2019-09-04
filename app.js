const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const lodash = require("lodash")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/BlogDemoDB", {
  useNewUrlParser: true
});

const Post = mongoose.model("Post", {

  title: String,
  body: String,
  link: String

})

const createPost = function (_title, _body) {

  const title = _title;
  const body = _body;
  const link = lodash.kebabCase(_title);

  const newPost = new Post({

    title: title,
    body: body,
    link: link

  })

  return newPost;

}

var firstLaunch = true;

var posts;

app.get("/", (req, res) => {

  if (firstLaunch) {

    firstLaunch = false;
    Post.find((err, _posts) => {

      if (err) {

        console.log(err);

      } else {

        res.render("home.ejs", {
          defaultTitle: "Welcome To Your Own Blog!",
          defaultBody: "Welcome! Visit {yourblog}.com/compose to start creating your own posts!",
          posts: _posts
        });

        posts = _posts;

      }

    })

  } else {

    res.render("home.ejs", {
      defaultTitle: "Welcome To Your Own Blog!",
      defaultBody: "Welcome! Visit {yourblog}.com/compose to start creating your own posts!",
      posts: posts
    });

  }

})

app.get("/about", (req, res) => {

  res.render("about.ejs", {
    aboutContent: aboutContent
  });

})

app.get("/contact", (req, res) => {

  res.render("contact.ejs", {
    contactContent: contactContent
  });

})

app.get("/compose", (req, res) => {

  res.render("compose.ejs")

})


app.get("/posts/:postTitle", (req, res) => {

  posts.forEach(post => {

    if (lodash.lowerCase(req.params.postTitle) == lodash.lowerCase(post.title)) {

      res.render("post.ejs", {
        postTitle: post.title,
        postBody: post.body
      })

    }

  });

})

app.post("/compose", (req, res) => {

  let post = createPost(req.body.postTitle, req.body.postBody)
  Post.insertMany([post])

  posts.push(post);
  res.redirect("/");

})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});