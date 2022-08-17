const bcrypt = require("bcryptjs");

const User = require("../models/user");

const returnErrorMesseage = (error) => {
  if (error.length > 0) return error[0];
  return null;
};

exports.getLogin = (req, res, next) => {
  const error = req.flash("error");
  const errorMessage = returnErrorMesseage(error);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage,
  });
};

exports.getSignup = (req, res, next) => {
  const error = req.flash("error");
  const errorMessage = returnErrorMesseage(error);
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // authentication
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) cosole.log(err);
              return res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password!");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, comfirmPassword } = req.body;
  // error validation
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "E-mail exists already.");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/");
  });
};
