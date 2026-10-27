import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items';

export interface Item {
  _id?: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

export const getItems = async (category?: string): Promise<Item[]> => {
  const url = category ? `${API_URL}?category=${category}` : API_URL;
  const res = await axios.get(url);
  return res.data.data;
};

export const createItem = async (item: Item): Promise<Item> => {
  const res = await axios.post(API_URL, item);
  return res.data.data;
};

export const updateStock = async (id: string, quantity: number, action: 'add' | 'subtract'): Promise<Item> => {
  const res = await axios.put(`${API_URL}/${id}/stock`, { quantity, action });
  return res.data.data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};