const path = require("path");
const express = require("express");
const bodyParder = require("body-parser");

const mongoConnection = require("./utils/database").MongoConnection;
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
  User.get("5cdae8bc1c9d440000238ba5")
    .then(user => {
      // console.log(user);
      req.user = new User(user.username, user.email, user.cart, user._id);
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

mongoConnection(() => {
  app.listen(3000, () => {
    console.log("Listening now on PORT 3000");
  });
});
