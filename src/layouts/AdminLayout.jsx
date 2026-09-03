import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="p-20 text-center text-espresso/60">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex bg-ivory">
      <aside className="w-64 bg-black text-ivory flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="font-serif text-xl tracking-luxury uppercase">BagsWaves</Link>
          <p className="text-[10px] tracking-luxury uppercase text-gold mt-1">Admin</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1 text-sm">
          <Link to="/admin" className="px-4 py-3 rounded hover:bg-white/5 transition text-ivory/80 hover:text-gold">
            Dashboard
          </Link>
          <Link to="/admin/products" className="px-4 py-3 rounded hover:bg-white/5 transition text-ivory/80 hover:text-gold">
            Products
          </Link>
          <Link to="/admin/orders" className="px-4 py-3 rounded hover:bg-white/5 transition text-ivory/80 hover:text-gold">
            Orders
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="text-xs text-cream/60 hover:text-ivory transition tracking-wide">
            ← Back to Store
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-h-screen">
        <header className="bg-black/5 border-b border-black/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl tracking-wide text-espresso">Dashboard</h1>
            <p className="text-xs text-taupe mt-0.5 tracking-wide">Welcome back, {user?.firstName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-xs font-medium text-gold">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
