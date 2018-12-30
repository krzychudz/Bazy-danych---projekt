//In this file we can assign controllers to endpoints

const express = require('express');
const router = express.Router();
const pageController = require('../controllers/PageController');
const productController = require('../controllers/ProductController')
const componentController = require('../controllers/ComponentController')


router.get('/', pageController.home);
router.get('/productCreate', pageController.productCreate);
router.post('/productCreate' ,productController.validate, productController.checkValidation ,productController.store);
router.post('/components', componentController.store);

module.exports = router;