const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

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
    oldInput: false,
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  const error = req.flash("error");
  const errorMessage = returnErrorMesseage(error);
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
    oldInput: false,
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  const routeParams = (errorMessage) => {
    return {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errorMessage,
      oldInput: { email, password },
    };
  };

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render("auth/login", routeParams(errors.array()[0].msg));
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .render("auth/login", routeParams("Invalid email or password!"));
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
          return res
            .status(422)
            .render("auth/login", routeParams("Invalid email or password!"));
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;
  // error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }
  bcrypt
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
      return transporter.sendMail({
        to: email,
        from: "yuchanbpp@gmail.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  const error = req.flash("error");
  const errorMessage = returnErrorMesseage(error);
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "yuchanbpp@gmail.com",
          subject: "Password Reset",
          html: `
            <p>You requested a password reset.</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode(500);
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      const error = req.flash("error");
      const errorMessage = returnErrorMesseage(error);
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Update Password",
        errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};
