import { useEffect, useState } from 'react';
import api from '../../services/api';

function formatCurrency(n) {
  return '$' + (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = stats.stats || {};
  const recentOrders = stats.recentOrders || [];

  const statCards = [
    { label: 'Revenue', value: formatCurrency(s.revenue), icon: '◆' },
    { label: 'Orders', value: s.totalOrders || 0, icon: '◇' },
    { label: 'Customers', value: s.totalCustomers || 0, icon: '○' },
    { label: 'Products', value: s.totalProducts || 0, icon: '□' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-black/5 rounded-sm p-6 hover:border-gold/40 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] tracking-luxury uppercase text-taupe">{card.label}</p>
              <span className="text-gold text-xs">{card.icon}</span>
            </div>
            <p className="font-serif text-3xl text-espresso tracking-wide">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-black/5 rounded-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg tracking-wide text-espresso">Recent Orders</h2>
              <p className="text-[11px] tracking-luxury uppercase text-taupe mt-0.5">Latest transactions</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream/40">
                  <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Order</th>
                  <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Customer</th>
                  <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Total</th>
                  <th className="text-left px-6 py-3 text-[11px] tracking-luxury uppercase text-taupe font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-serif tracking-wide">{o.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-taupe">
                      {o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest'}
                    </td>
                    <td className="px-6 py-4 font-serif">{formatCurrency(o.total)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.orderStatus} />
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-taupe text-sm">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-sm p-6">
          <div className="mb-6">
            <h2 className="font-serif text-lg tracking-wide text-espresso">Quick Stats</h2>
            <p className="text-[11px] tracking-luxury uppercase text-taupe mt-0.5">Performance overview</p>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <span className="text-sm text-taupe">Pending Orders</span>
              <span className="font-serif text-lg text-espresso">{s.pendingOrders || 0}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <span className="text-sm text-taupe">Total Customers</span>
              <span className="font-serif text-lg text-espresso">{s.totalCustomers || 0}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <span className="text-sm text-taupe">Total Products</span>
              <span className="font-serif text-lg text-espresso">{s.totalProducts || 0}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-taupe">Low Stock Items</span>
              <span className="font-serif text-lg text-espresso">{s.lowStock?.length || 0}</span>
            </div>
          </div>
          {(s.lowStock?.length || 0) > 0 && (
            <div className="mt-6 pt-5 border-t border-black/5">
              <p className="text-[11px] tracking-luxury uppercase text-taupe mb-3">Low Stock</p>
              <div className="space-y-2">
                {s.lowStock.map((p) => (
                  <div key={p._id} className="flex items-center justify-between py-2 px-3 bg-cream/30 rounded-sm">
                    <span className="text-sm truncate max-w-[160px]">{p.name}</span>
                    <span className="text-xs text-taupe">{p.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
