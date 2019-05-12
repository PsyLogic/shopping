const express = require('express');

const router = express.Router();

router.get('/', (req, resp, next) => {
    resp.send('We are in the index Page');
});


module.exports = router;