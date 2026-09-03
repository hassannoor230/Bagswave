import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/collections/the-icon-edit', label: 'Collections' },
  { to: '/shop?isNewArrival=true', label: 'New Arrivals' },
  { to: '/shop?isBestseller=true', label: 'Bestsellers' },
  { to: '/about', label: 'About' }
];

export default function Header({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const headerClass = scrolled || !isHome
    ? 'bg-ivory/95 backdrop-blur-md text-espresso border-b border-cream'
    : 'bg-transparent text-ivory';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerClass}`}>
        <div className="container-luxury flex items-center justify-between h-16 md:h-20">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <Link to="/" className="font-serif text-xl md:text-2xl tracking-luxury uppercase">
            BagsWaves
          </Link>

          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-[11px] tracking-luxury uppercase transition-opacity hover:opacity-70 ${isActive ? 'opacity-100' : 'opacity-80'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={onSearchOpen} className="p-1.5 hover:opacity-70 transition" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link to={user ? '/account' : '/login'} className="p-1.5 hover:opacity-70 transition hidden sm:block" aria-label="Account">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/wishlist" className="p-1.5 hover:opacity-70 transition relative" aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gold text-black text-[9px] flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button onClick={openCart} className="p-1.5 hover:opacity-70 transition relative" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gold text-black text-[9px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-ivory p-8 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif text-xl tracking-luxury uppercase">BagsWaves</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} className="font-serif text-2xl tracking-wide">
                    {link.label}
                  </Link>
                ))}
                <Link to="/contact" className="font-serif text-2xl tracking-wide">Contact</Link>
              </div>
              <div className="mt-auto pt-8 border-t border-cream">
                <Link to={user ? '/account' : '/login'} className="text-xs tracking-luxury uppercase">
                  {user ? 'My Account' : 'Sign In'}
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
