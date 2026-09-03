import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '', isPublished: true, description: '', images: '' });
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get('/admin/products').then(res => setProducts(res.data.products || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm({ name: '', price: '', stock: '', isPublished: true, description: '', images: '' });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.split(',').map(s => s.trim()).filter(Boolean)
    };
    if (editingId) {
      await api.put(`/admin/products/${editingId}`, payload);
    } else {
      await api.post('/admin/products', payload);
    }
    reset();
    load();
  };

  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: String(p.price),
      stock: String(p.stock),
      isPublished: p.isPublished,
      description: p.description || '',
      images: (p.images || []).join(', ')
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/admin/products/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Products</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="border p-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input className="border p-2" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input className="border p-2" placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
        <textarea className="border p-2 md:col-span-3" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="border p-2 md:col-span-3" placeholder="Image URLs (comma separated)" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
          <span className="text-sm">Published</span>
        </label>
        <div className="md:col-span-3 flex gap-3">
          <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Product</button>
          {editingId && <button type="button" onClick={reset} className="btn-outline">Cancel</button>}
        </div>
      </form>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-4">{p.name}</td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">{p.isPublished ? 'Published' : 'Draft'}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => edit(p)} className="text-xs underline">Edit</button>
                  <button onClick={() => remove(p._id)} className="text-xs text-red-600 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
