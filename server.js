const path = require("path");
const express = require("express");
const bodyParder = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const app = express();

/**
 * Global Setups
 */

// Parsing Request Body by default
app.use(bodyParder.urlencoded({ extended: false }));

// Use EJS as default engine
app.set("view engine", "ejs");

// Call routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

/**
 * Routes
 */

// public files route
app.use(express.static(path.join(__dirname, "public")));

app.use((req, resp, next) => {
  User.findById("5cdd8d981c9d44000018bce5")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      throw err;
    });
});

// Admin Route
app.use("/admin", adminRoutes);
// Public Route
app.use(shopRoutes);

// Redirect for to 404 if no rounting is found
app.use((req, resp, next) => {
  resp
    .status(404)
    .render("errors/404", { pageTitle: "Page Not Found", path: "/" });
});

// Listner
mongoose
  .connect(
    "mongodb+srv://otmane:ev02xT3qPw2pvLlp@cluster0-yvclq.mongodb.net/shop?retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Listening now on PORT 3000");
    });
  })
  .catch(err => {
    throw err;
  });
