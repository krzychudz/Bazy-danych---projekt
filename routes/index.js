const express = require('express');
const router = express.Router();
const PageController = require('../controllers/PageController');

router.get('/', PageController.home);


module.exports = router;