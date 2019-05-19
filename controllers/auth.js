const User = require("../models/user");
const bycrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : false;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    message: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : false;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    message: message
  });
};

exports.postLogin = (req, res, next) => {
  const username_email = req.body.username_email;
  const password = req.body.password;
  User.findOne({
    username: username_email
  })
    .then(user => {
      if (!user || !bycrypt.compareSync(password, user.password)) {
        req.flash("error", "Username or Password is incorrect");
        return res.redirect("/login");
      }

      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        res.redirect("/");
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password !== confirmPassword) {
    req.flash("error", "Passwords are not matched");
    return res.redirect("/singup");
  }
  // Check Passwd confirmation

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        req.flash("error", "Username already exists");
        return res.redirect("/signup");
      }

      const hashedPassword = bycrypt.hashSync(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        cart: { items: [] }
      });

      return newUser.save();
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
