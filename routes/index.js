//In this file we can assign controllers to endpoints

const express = require('express');
const router = express.Router();
const pageController = require('../controllers/PageController');
const productController = require('../controllers/ProductController');
const componentController = require('../controllers/ComponentController');
const producerController = require('../controllers/ProducerController');
const customerController = require('../controllers/CustomerController');
const orderController = require('../controllers/OrderController');
const complaintController = require('../controllers/ComplaintController');
const storehouseController = require('../controllers/StorehouseController');
const deliveryController = require('../controllers/DeliveryController');


router.get('/', pageController.home);
router.get('/productCreate', pageController.productCreate);
router.get('/orderCreate', pageController.orderCreate);
router.get('/complaintCreate', pageController.complaintCreate);
router.get('/storehouse', pageController.storehouse);
router.get('/delivery', pageController.delivery);
router.get('/storehouseData', storehouseController.getData);
router.get('/deliveryData', deliveryController.getData);


router.post('/productCreate' ,productController.validate, productController.checkValidation ,productController.store);
router.post('/components', componentController.store);
router.post('/producers', producerController.store);
router.post('/customers', customerController.store);
router.post('/orderCreate', orderController.store);
router.post('/complaintCreate', complaintController.store);

module.exports = router;