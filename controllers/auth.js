exports.getLogin = (req, res, next) => {
  // const isAuthenticated = req.get("Cookie").split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // authentication
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
