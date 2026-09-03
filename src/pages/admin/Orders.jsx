import { useEffect, useState } from 'react';
import api from '../../services/api';

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

function StatusBadge({ status }) {
  const map = {
    Pending: 'bg-amber-100 text-amber-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Processing: 'bg-indigo-100 text-indigo-800',
    Shipped: 'bg-purple-100 text-purple-800',
    Delivered: 'bg-emerald-100 text-emerald-800',
    Cancelled: 'bg-red-100 text-red-800',
    Refunded: 'bg-gray-100 text-gray-800',
    paid: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    failed: 'bg-red-100 text-red-800'
  };
  const cls = map[status] || 'bg-gray-100 text-gray-800';
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${cls}`}>{status}</span>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/admin/orders').then(res => setOrders(res.data.orders || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = (o) => {
    setSelected(o);
    setStatus(o.orderStatus);
    setPaymentStatus(o.paymentStatus);
  };

  const update = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(`/admin/orders/${selected._id}/status`, { orderStatus: status, paymentStatus });
      setSelected(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-espresso">Orders</h1>
        <p className="text-[11px] tracking-luxury uppercase text-taupe mt-1">Track and manage customer orders</p>
      </div>

      <div className="bg-white border border-black/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/40">
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Order</th>
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Customer</th>
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Total</th>
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Order Status</th>
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Payment</th>
                <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Date</th>
                <th className="text-right px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-serif tracking-wide text-espresso">{o.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4 text-taupe">
                    {o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest'}
                  </td>
                  <td className="px-6 py-4 font-serif">${o.total?.toFixed(2)}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.orderStatus} /></td>
                  <td className="px-6 py-4"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="px-6 py-4 text-taupe">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button onClick={() => open(o)} className="text-xs tracking-wide text-gold hover:text-espresso transition-colors">
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-taupe text-sm">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={update} className="bg-ivory border border-black/5 rounded-sm w-full max-w-md shadow-2xl">
            <div className="px-6 py-5 border-b border-black/5">
              <h2 className="font-serif text-xl tracking-wide text-espresso">Update Order</h2>
              <p className="text-xs text-taupe mt-0.5 tracking-wide">{selected.orderNumber}</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] tracking-luxury uppercase text-taupe mb-2">Order Status</label>
                <select className="w-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors" value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] tracking-luxury uppercase text-taupe mb-2">Payment Status</label>
                <select className="w-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                  {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-black/5 flex justify-end gap-3">
              <button type="button" onClick={() => setSelected(null)} className="px-6 py-2.5 border border-black/10 text-xs tracking-luxury uppercase hover:border-gold hover:text-gold transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-black text-ivory text-xs tracking-luxury uppercase hover:bg-espresso transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
