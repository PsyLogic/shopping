const path = require("path");

const express = require("express");
const bodyParder = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf")();
const flash = require("connect-flash")();
const multer = require("multer");

const { _404, _500 } = require("./routes/erros");
const User = require("./models/user");
const { storage } = require("./config/storage");
const shopController = require("./controllers/shop");
const isAuth = require("./middleware/authMiddleware");

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
app.use(
  multer({
    storage: storage.storageConfig
  }).single("image")
);
// Use EJS as default engine
app.set("view engine", "ejs");

// Initialized Session
app.use(
  session({
    secret: "devdas",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, resp, next) => {
  resp.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

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

app.post("/create-order", isAuth, shopController.addOrders);

// Use CSRF
app.use(csrf);
// Use Flash Messages
app.use(flash);
// Share Variables in all Pages
app.use((req, resp, next) => {
  resp.locals.csrfToken = req.csrfToken();
  next();
});

// Admin Route
app.use("/admin", adminRoutes);
// Public Route
app.use(shopRoutes);
// Auth Routes
app.use(authRoutes);

// Handling Errors
// Redirect to 404 if no rounting is found
app.use(_404);
// Redirect to 500 for internal errors
app.use(_500);

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
