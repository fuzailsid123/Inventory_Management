const express = require('express');
const {
  getLowStockReport,
  getSortedProducts,
} = require('../controllers/report.controller');
const router = express.Router();

router.get('/low-stock', getLowStockReport);
router.get('/sorted-products', getSortedProducts);

module.exports = router;