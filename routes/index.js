//In this file we can assign controllers to endpoints

const express = require('express');
const router = express.Router();
const pageController = require('../controllers/PageController');
const productController = require('../controllers/ProductController')

router.get('/', pageController.home);
router.get('/productCreate', pageController.productCreate);
router.post('/productCreate', productController.store);


module.exports = router;