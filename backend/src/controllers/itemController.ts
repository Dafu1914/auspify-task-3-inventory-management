import { Request, Response } from 'express';
import Item from '../models/Item';

// Create an item
export const createItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all items (with optional category filter)
export const getItems = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const filter = category ? { category } : {};
    const items = await Item.find(filter);
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update stock quantity (Add or Subtract)
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { quantity, action } = req.body; // action: 'add' or 'subtract'
    const item = await Item.findById(req.params.id);
    
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

    if (action === 'subtract' && item.quantity < quantity) {
      return res.status(400).json({ success: false, error: 'Not enough stock available' });
    }

    item.quantity = action === 'add' ? item.quantity + quantity : item.quantity - quantity;
    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete an item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};