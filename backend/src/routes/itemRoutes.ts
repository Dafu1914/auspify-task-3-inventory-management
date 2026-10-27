import express from 'express';
import {
  createItem,
  getItems,
  updateStock,
  deleteItem,
} from '../controllers/itemController';

const router = express.Router();

router.route('/').get(getItems).post(createItem);
router.route('/:id').delete(deleteItem);
router.route('/:id/stock').put(updateStock);

export default router;