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
router.get('/productShowEdit', pageController.productShowEdit);
router.get('/orderShowEdit', pageController.orderShowEdit);
router.get('/complaintShowEdit', pageController.complaintShowEdit);
router.get('/customersShowEdit', pageController.customerShowEdit);


router.get('/api/storehouseData', storehouseController.getData);
router.get('/api/deliveryData', deliveryController.getData);
router.get('/api/productData', productController.getData);
router.get('/api/orderData', orderController.getData);
router.get('/api/complaintData', complaintController.getData);
router.get('/api/customersData', customerController.getData);
router.get('/api/createSummary', customerController.createSummary);




router.post('/api/productCreate' ,productController.validate, productController.checkValidation ,productController.store);
router.post('/api/components', componentController.store);
router.post('/api/producers', producerController.store);
router.post('/api/customers', customerController.store);
router.post('/api/orderCreate', orderController.store);
router.post('/api/complaintCreate', complaintController.store);


router.put('/api/product', productController.updateData);
router.put('/api/order', orderController.updateData);
router.put('/api/orderFin', orderController.finOrder);
router.put('/api/complaint', complaintController.updateData);
router.put('/api/complaintFin', complaintController.finComplaint);
router.put('/api/customer', customerController.updateData);



router.delete('/api/product', productController.deleteData);
router.delete('/api/orderCancel', orderController.cancelOrder);
router.delete('/api/complaintDel', complaintController.deleteComplaint);
router.delete('/api/deleteCustomer', customerController.deleteCustomer);


module.exports = router;