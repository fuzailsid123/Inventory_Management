const express = require('express');
const { getAllOrders, addOrder } = require('../controllers/order.controller');
const router = express.Router();

router.get('/', getAllOrders);
router.post('/', addOrder);

module.exports = router;