const express = require('express');
const bodyParder = require('body-parser');

const app = express();

// Parsing Request Body by default
app.use(bodyParder.urlencoded({extended: false}));


// Routes
app.get('/', (req, resp, next) => {
    console.log('We are in the index Page');
});


// Listner
app.listen(3000,() => {
    console.log('Listening now on PORT 3000')
})