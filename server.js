const path = require("path");

const express = require("express");
const bodyParder = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf")();
const flash = require("connect-flash")();

const User = require("./models/user");
const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions"
});

/**
 * Global Setups
 */

// Parsing Request Body by default
app.use(bodyParder.urlencoded({ extended: false }));

// Use EJS as default engine
app.set("view engine", "ejs");

// Initialized Session
app.use(
  session({
    secret: "devdas",
    resave: false,
    saveUninitialized: false,
    store: store
    // genid: function(req) {
    //   return "blblablabla";
    // }
  })
);

// Use CSRF
app.use(csrf);
// Use Flash Messages
app.use(flash);

// Call routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

/**
 * Routes
 */

// public files route
app.use(express.static(path.join(__dirname, "public")));

app.use((req, resp, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// Share Variables in all Pages
app.use((req, resp, next) => {
  resp.locals.isAuthenticated = req.session.isLoggedIn;
  resp.locals.csrfToken = req.csrfToken();
  next();
});

// Admin Route
app.use("/admin", adminRoutes);
// Public Route
app.use(shopRoutes);
// Auth Routes
app.use(authRoutes);

// Redirect for to 404 if no rounting is found
app.use((req, resp, next) => {
  resp
    .status(404)
    .render("errors/404", { pageTitle: "Page Not Found", path: "/" });
});

app.use((error, req, res, nex) => {
  res
    .status(500)
    .render("errors/500", { pageTitle: "Internal Error", path: "/" });
});

// Listner
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Database connected");
    const PORT = process.env.PORT_SERVER || 3000;
    app.listen(PORT, () => {
      console.log("Listening now on PORT " + PORT);
    });
  })
  .catch(err => {
    throw err;
  });
