import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data.orders || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Orders</h1>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-t">
                <td className="p-4">{o.orderNumber}</td>
                <td className="p-4">${o.total?.toFixed(2)}</td>
                <td className="p-4">{o.orderStatus}</td>
                <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
