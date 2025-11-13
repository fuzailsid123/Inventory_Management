import express from 'express';
import {
  getReorderSuggestions,
  getLowStockProducts,
  getStockMovements,
  getInventoryStats,
  getABCAnalysis,
  getExpiringBatches,
} from '../controllers/inventory.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/reorder-suggestions', getReorderSuggestions);
router.get('/low-stock', getLowStockProducts);
router.get('/movements', getStockMovements);
router.get('/stats', getInventoryStats);
router.get('/abc-analysis', getABCAnalysis);
router.get('/expiring-batches', getExpiringBatches);

export default router;

