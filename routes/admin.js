const express = require('express');

const router = express.Router();

router.get('/users', (req, resp, next) => {
    resp.send('list of users');
});

router.get('/settings', (req, resp, next) => {
    resp.send('App Settings');
});

module.exports = router;