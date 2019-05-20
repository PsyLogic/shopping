const crypto = require("crypto");

const User = require("../models/user");
const bycrypt = require("bcryptjs");
const sendEmail = require("../utils/mail");

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
    $or: [{ username: username_email }, { email: username_email }]
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

  // Check Passwd confirmation
  if (password !== confirmPassword) {
    req.flash("error", "Passwords are not matched");
    return res.redirect("/singup");
  }

  User.findOne({
    $or: [{ username: username_email }, { email: username_email }]
  })
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
      // We will put this method in the queue for Potential Limitation
      // sendEmail({
      //   from: '"Welcome" <info@example.com>',
      //   to: `"${user.username}" <${user.email}>`,
      //   subject: "Thank you for registration <3",
      //   text: "Welcome you can now login to your account!!",
      //   html: `Welcome you can now login to your account!<br>
      //         Username: <b>${user.username}</b> Or <b>${user.email}</b>`
      // });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : false;
  res.render("auth/reset", {
    path: "/reset-password",
    pageTitle: "Reset Password",
    message: message
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  let token = "";
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Email is not in our records");
        return res.redirect("/reset-password");
      }
      token = crypto.randomBytes(32).toString("hex");
      user.resetToken = token;
      user.resetTokenExp = Date.now() + 3600000;
      return user.save();
    })
    .then(savedUser => {
      sendEmail({
        from: '"Security <security@example.com>',
        to: `"${savedUser.username}" <${savedUser.email}>`,
        subject: "Password Forgotten ?",
        html: `Please, <a href="http://localhost:3000/update-password/${token}">Click Here</a> to reset your password`
      });

      req.flash(
        "error",
        "A link was sent to your email to reset your password"
      );
      return res.redirect("/reset-password");
    })
    .catch(err => console.log(err));
};

exports.getUpdatePassword = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : false;

  User.findOne({
    resetToken: req.params.token,
    resetTokenExp: { $gt: Date.now() }
  })
    .then(user => {
      if (!user) {
        req.flash("error", "Your Link is invalid or it's expired");
        return res.redirect("/reset-password");
      }

      res.render("auth/update-password", {
        path: "/update-password",
        pageTitle: "Update Your password",
        userid: user._id,
        message: message
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.postUpdatePassword = (req, res, next) => {
  const id = req.body.userId;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Check Passwd confirmation
  if (password !== confirmPassword) {
    req.flash("error", "Passwords are not matched");
    return res.redirect("back");
  }

  User.findById(id)
    .then(user => {
      const hashedPassword = bycrypt.hashSync(password, 12);
      user.password = hashedPassword;
      user.resetToken = "";
      user.resetTokenExp = "";
      return user.save();
    })
    .then(user => {
      req.flash(
        "error",
        "Congratulation, You can login wiht your new Password"
      );
      res.redirect("/login");
    })
    .catch(err => console.log(err));
};
