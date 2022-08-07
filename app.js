const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");

const app = express();
const uri =
  "mongodb+srv://root:root@cluster0.chtnfx7.mongodb.net/shop?retryWrites=true&w=majority";

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("62ee12223c1cc4fdd589b54f")
    .then((user) => {
      console.log("user(id : 62ee12223c1cc4fdd589b54f) connected!");
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose
  .connect(uri)
  .then((result) => {
    User.findOne().then((user) => {
      if (user) return;
      const newUser = new User({
        name: "root",
        email: "root@test.com",
        items: [],
      });
      newUser.save();
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
