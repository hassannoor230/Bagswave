import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded shadow-sm">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-medium">${(stats.stats?.revenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-2xl font-medium">{stats.stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          <p className="text-sm text-gray-500">Customers</p>
          <p className="text-2xl font-medium">{stats.stats?.totalCustomers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-2xl font-medium">{stats.stats?.totalProducts || 0}</p>
        </div>
      </div>
      <h2 className="text-lg mb-4">Recent Orders</h2>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(stats.recentOrders || []).map(o => (
              <tr key={o._id} className="border-t">
                <td className="p-4">{o.orderNumber}</td>
                <td className="p-4">{o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest'}</td>
                <td className="p-4">${o.total?.toFixed(2)}</td>
                <td className="p-4">{o.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
