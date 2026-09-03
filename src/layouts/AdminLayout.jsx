import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-black text-ivory p-6 flex flex-col">
        <Link to="/admin" className="font-serif text-xl tracking-luxury uppercase mb-10">BagsWaves Admin</Link>
        <nav className="flex flex-col gap-3 text-sm">
          <Link to="/admin" className="hover:text-gold transition">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-gold transition">Products</Link>
          <Link to="/admin/orders" className="hover:text-gold transition">Orders</Link>
          <Link to="/" className="mt-auto text-xs text-cream/60 hover:text-ivory">← Back to Store</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
