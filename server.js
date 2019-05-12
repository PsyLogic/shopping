const path = require('path');
const express = require('express');
const bodyParder = require('body-parser');

const app = express();

/**
 * Global Setups
 */

// Parsing Request Body by default
app.use(bodyParder.urlencoded({extended: false}));

// Use EJS as default engine
app.set('view engine', 'ejs');

// Call routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


/**
 * Routes
 */

 // public files route
app.use(express.static(path.join(__dirname,'public')));

 // Admin Route 
app.use('/admin',adminRoutes);
// Public Route
app.use(shopRoutes);
 
// Redirect for to 404 if no rounting is found
app.use((req,resp,next)=> {
    resp.status(404).render('404', {pageTitle: 'Page Not Found', path: '/'});
});
// Listner
app.listen(3000,() => {
    console.log('Listening now on PORT 3000');
});