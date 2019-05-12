const express = require('express');

const router = express.Router();

router.get('/add-product', (req, resp, next) => {
    resp.render('add_product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
    });
});

module.exports = router;