import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Account() {
  const { user, logout, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (user) api.get('/orders/my').then(res => setOrders(res.data.orders || [])).catch(() => {});
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-3xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-3xl tracking-wide">Welcome, {user.firstName}</h1>
          <button onClick={logout} className="text-xs tracking-luxury uppercase text-taupe hover:text-espresso">Sign Out</button>
        </div>
        <h2 className="font-serif text-xl mb-6">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-taupe">No orders yet. <Link to="/shop" className="underline">Start shopping</Link></p>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o._id} className="border border-cream p-6 flex justify-between items-center">
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-sm text-taupe">{new Date(o.createdAt).toLocaleDateString()} · {o.orderStatus}</p>
                </div>
                <p>${o.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
