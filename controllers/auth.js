const crypto = require("crypto");

const User = require("../models/user");
const bycrypt = require("bcryptjs");
const sendEmail = require("../utils/mail");
const { validationResult } = require("express-validator/check");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login"
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup"
  });
};

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;
  const validate = validationResult(req);
  let errors = [];
  if (validate.isEmpty()) {
    User.findOne({ username })
      .then(user => {
        if (!user || !bycrypt.compareSync(password, user.password)) {
          errors.push("Username or Password is incorrect");
          return res.render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            messages: errors,
            old: req.body
          });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          res.redirect("/");
        });
      })
      .catch(err => {
        next(err);
      });
  } else {
    errors = validate.array().map(error => error.msg);
    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      messages: errors,
      old: req.body
    });
  }
};

exports.postSignup = (req, res, next) => {
  const { username, email, password } = req.body;
  let errors = [];
  const validate = validationResult(req);
  if (validate.isEmpty()) {
    User.findOne({
      $or: [{ username: username }, { email: email }]
    })
      .then(user => {
        if (user) {
          errors.push("Username/Email is already exists");
          return res.status(422).render("auth/signup", {
            path: "/signup",
            pageTitle: "Signup",
            messages: errors,
            old: req.body
          });
        }
        const hashedPassword = bycrypt.hashSync(password, 12);
        const newUser = new User({
          username,
          email,
          passworde: hashedPassword,
          cart: { items: [] }
        });
        return newUser.save();
      })
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        next(err);
      });
  } else {
    errors = validate.array().map(error => error.msg);
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      messages: errors,
      old: req.body
    });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset-password",
    pageTitle: "Reset Password"
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  let token = "";
  let errors = [];
  const validate = validationResult(req);
  if (validate.isEmpty()) {
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          errors.push(email + " is not in our records");
          res.render("auth/reset", {
            path: "/reset-password",
            pageTitle: "Reset Password",
            messages: errors
          });
        }
        token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExp = Date.now() + 3600000;
        return user.save();
      })
      .then(savedUser => {
        return sendEmail({
          from: '"Security <security@example.com>',
          to: `"${savedUser.username}" <${savedUser.email}>`,
          subject: "Password Forgotten ?",
          html: `Please, <a href="http://localhost:3000/update-password/${token}">Click Here</a> to reset your password`
        });
      })
      .then(info => {
        console.log(info);
        errors.push("A link was sent to your email to reset your password");
        res.render("auth/reset", {
          path: "/reset-password",
          pageTitle: "Reset Password",
          messages: errors
        });
      })
      .catch(err => {
        next(err);
      });
  } else {
    errors = validate.array().map(error => error.msg);
    res.render("auth/reset", {
      path: "/reset-password",
      pageTitle: "Reset Password",
      messages: errors
    });
  }
};

exports.getUpdatePassword = (req, res, next) => {
  let userid;
  User.findOne({
    resetToken: req.params.token,
    resetTokenExp: { $gt: Date.now() }
  })
    .then(user => {
      if (!user) {
        res.status(401).render("auth/reset", {
          path: "/reset-password",
          pageTitle: "Reset Password",
          messages: ["The link is expired, retry again"]
        });
      }

      return res.render("auth/update-password", {
        path: "/update-password",
        pageTitle: "Update Your password",
        userid: user._id
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.postUpdatePassword = (req, res, next) => {
  const { userId, password } = req.body;
  let errors = [];
  const validate = validationResult(req);
  if (validate.isEmpty()) {
    User.findById(userId)
      .then(user => {
        const hashedPassword = bycrypt.hashSync(password, 12);
        user.password = hashedPassword;
        user.resetToken = "";
        user.resetTokenExp = "";
        return user.save();
      })
      .then(() => {
        return res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          messages: ["Congratulation, You can login wiht your new Password"]
        });
      })
      .catch(err => {
        next(err);
      });
  } else {
    errors = validate.array().map(error => error.msg);
    res.status(422).render("auth/update-password", {
      path: "/update-password",
      pageTitle: "Update Your password",
      userid: userId,
      messages: errors
    });
  }
};
