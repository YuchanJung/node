const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const User = require("./models/user");

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

// app.use((req, res, next) => {
//   User.findById("62e8ac82a234c4f21644c206")
//     .then((user) => {
//       const { name, email, cart, _id } = user;
//       console.log("user(id : 62e8ac82a234c4f21644c206) connected!");
//       req.user = new User(name, email, cart, _id);
//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose
  .connect(uri)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
