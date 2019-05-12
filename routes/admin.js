const path = require('path');
const express = require('express');

const router = express.Router();

const rootDir = require('../utils/path');

router.get('/add-product', (req, resp, next) => {
    resp.sendFile(path.join(rootDir,'views', 'add_product.html'));
});

router.get('/users', (req, resp, next) => {
    resp.send('list of users');
});

router.get('/settings', (req, resp, next) => {
    resp.send('App Settings');
});

module.exports = router;