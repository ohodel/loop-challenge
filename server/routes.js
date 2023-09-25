import express from 'express';
import {
  getOrders,
  getTotalCount,
  getProducts,
  parseProducts,
  getInventory,
} from './controllers/index.js';

const router = express.Router();

// Handle get request
router.get(
  '/',
  getOrders,
  getTotalCount,
  getProducts,
  parseProducts,
  getInventory,
  (req, res) => {
    // If successful, send output object
    return res.status(200).send(res.locals.output);
  }
);

export default router;
