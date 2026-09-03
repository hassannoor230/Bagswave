import { useEffect, useState } from 'react';
import api from '../../services/api';

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const load = () => api.get('/admin/orders').then(res => setOrders(res.data.orders || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const update = async (e) => {
    e.preventDefault();
    if (!selected) return;
    await api.put(`/admin/orders/${selected._id}/status`, { orderStatus: status, paymentStatus });
    setSelected(null);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Orders</h1>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-t">
                <td className="p-4">{o.orderNumber}</td>
                <td className="p-4">{o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest'}</td>
                <td className="p-4">${o.total?.toFixed(2)}</td>
                <td className="p-4">{o.orderStatus}</td>
                <td className="p-4">{o.paymentStatus}</td>
                <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button onClick={() => { setSelected(o); setStatus(o.orderStatus); setPaymentStatus(o.paymentStatus); }} className="text-xs underline">
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={update} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl mb-4">Update Order {selected.orderNumber}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Order Status</label>
                <select className="border p-2 w-full" value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Payment Status</label>
                <select className="border p-2 w-full" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" onClick={() => setSelected(null)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
