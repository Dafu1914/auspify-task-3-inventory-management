'use client';

import { useEffect, useState } from 'react';
import {
  getItems,
  createItem,
  updateStock,
  deleteItem,
  Item,
} from '@/lib/api';

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
  });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadItems = async () => {
    try {
      const data = await getItems(categoryFilter || undefined);
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [categoryFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItem(form);
      setForm({ name: '', category: '', quantity: 0, price: 0 });
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error adding item');
    }
  };

  const handleStockChange = async (id: string, currentQty: number, action: 'add' | 'subtract') => {
    const amount = prompt(`How many to ${action === 'add' ? 'add' : 'subtract'}?`);
    if (!amount) return;
    const qty = parseInt(amount);
    if (isNaN(qty) || qty <= 0) return alert('Enter a valid number');

    try {
      await updateStock(id, qty, action);
      loadItems();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error updating stock');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      await deleteItem(id);
      loadItems();
    }
  };

  // Reports calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const lowStockItems = items.filter((item) => item.quantity > 0 && item.quantity < 5);
  const outOfStock = items.filter((item) => item.quantity === 0);

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  // Unique categories for filter dropdown
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <main className="min-h-screen bg-slate-900 p-8 font-sans text-slate-200">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
          📦 Inventory Management System
        </h1>

        {/* REPORTS DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-1">Total Items in Stock</p>
            <p className="text-3xl font-bold text-white">{totalItems}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-1">Total Inventory Value</p>
            <p className="text-3xl font-bold text-emerald-400">${totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-1">Low / Out of Stock</p>
            <p className="text-3xl font-bold text-rose-400">{lowStockItems.length + outOfStock.length}</p>
          </div>
        </div>

        {/* ADD ITEM FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item Name"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="quantity"
            type="number"
            value={form.quantity || ''}
            onChange={handleChange}
            placeholder="Quantity"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price || ''}
            onChange={handleChange}
            placeholder="Price ($)"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition"
          >
            Add Item
          </button>
        </form>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-300">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Price</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No items found. Add some inventory above!
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="border-b border-slate-700/50 hover:bg-slate-700/50 transition">
                    <td className="p-4 text-white font-medium">{item.name}</td>
                    <td className="p-4 text-slate-300">
                      <span className="bg-slate-900 px-3 py-1 rounded-full text-xs font-semibold text-pink-400 border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold ${
                          item.quantity === 0
                            ? 'text-rose-400'
                            : item.quantity < 5
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">${item.price.toFixed(2)}</td>
                    <td className="p-4 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleStockChange(item._id!, item.quantity, 'add')}
                        className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-emerald-500/20"
                      >
                        + Stock
                      </button>
                      <button
                        onClick={() => handleStockChange(item._id!, item.quantity, 'subtract')}
                        className="bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-amber-500/20"
                      >
                        - Stock
                      </button>
                      <button
                        onClick={() => handleDelete(item._id!)}
                        className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}