const express = require('express');
const router = express.Router();

router.get('/', (req, resp, next) => {
    resp.render('index',{
        pageTitle: 'Shop',
        path: '/',
    });
});


module.exports = router;