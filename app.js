const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://root:root@cluster0.chtnfx7.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secert",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    console.log("no user");
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      console.log(`user(id : ${user._id}) connected!`);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
  .connect(MONGODB_URI)
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
