import { useEffect, useState } from 'react';
import api from '../../services/api';

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${status ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
      {status ? 'Published' : 'Draft'}
    </span>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '', isPublished: true, description: '', images: '' });

  const load = () => api.get('/admin/products').then(res => setProducts(res.data.products || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm({ name: '', price: '', stock: '', isPublished: true, description: '', images: '' });
    setOpen(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean)
      };
      await api.post('/admin/products', payload);
      reset();
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-2xl tracking-wide text-espresso">Products</h1>
          <p className="text-[11px] tracking-luxury uppercase text-taupe mt-1">Manage your inventory</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">Add Product</button>
      </div>

      <div className="bg-white border border-black/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/40">
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Name</th>
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Price</th>
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Stock</th>
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Status</th>
                <th className="text-right px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-serif tracking-wide text-espresso">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 font-serif">${p.price}</td>
                  <td className="px-6 py-4">
                    <span className={p.stock < 5 ? 'text-red-600' : 'text-espresso'}>{p.stock}</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={p.isPublished} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <button className="text-xs tracking-wide text-gold hover:text-espresso transition-colors underline underline-offset-4 decoration-gold/40 hover:decoration-espresso">Edit</button>
                      <button className="text-xs tracking-wide text-red-600 hover:text-red-800 transition-colors underline underline-offset-4 decoration-red-200 hover:decoration-red-500">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-taupe text-sm">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={submit} className="bg-ivory border border-black/5 rounded-sm w-full max-w-lg shadow-2xl">
            <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl tracking-wide text-espresso">Add Product</h2>
                <p className="text-xs text-taupe mt-0.5 tracking-wide">Create a new product listing</p>
              </div>
              <button type="button" onClick={reset} className="text-xs text-taupe hover:text-espresso tracking-wide">Close</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-luxury uppercase text-taupe mb-1.5">Name</label>
                  <input className="w-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-[11px] tracking-luxury uppercase text-taupe mb-1.5">Price</label>
                  <input className="w-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="0.00" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-luxury uppercase text-taupe mb-1.5">Stock</label>
                  <input className="w-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="0" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 pb-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="accent-gold" />
                    <span className="text-sm text-espresso">Published</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-luxury uppercase text-taupe mb-1.5">Description</label>
                <textarea className="w-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Product description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div>
                <label className="block text-[11px] tracking-luxury uppercase text-taupe mb-1.5">Image URLs</label>
                <input className="w-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Comma separated URLs" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-black/5 flex justify-end gap-3">
              <button type="button" onClick={reset} className="px-6 py-2.5 border border-black/10 text-xs tracking-luxury uppercase hover:border-gold hover:text-gold transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-black text-ivory text-xs tracking-luxury uppercase hover:bg-espresso transition-colors disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
