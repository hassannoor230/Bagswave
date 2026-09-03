import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/newsletter/subscribe', { email });
      setMsg('Thank you for subscribing.');
      setEmail('');
    } catch {
      setMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-black text-ivory pt-20 pb-10">
      <div className="container-luxury">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="font-serif text-2xl tracking-luxury uppercase">BagsWaves</Link>
            <p className="mt-4 text-sm text-cream/70 font-light leading-relaxed max-w-xs">
              Carry something unforgettable.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] tracking-luxury uppercase mb-6 text-gold">Explore</h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li><Link to="/shop" className="hover:text-ivory transition">Shop</Link></li>
              <li><Link to="/collections/the-icon-edit" className="hover:text-ivory transition">Collections</Link></li>
              <li><Link to="/about" className="hover:text-ivory transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-ivory transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-luxury uppercase mb-6 text-gold">Client Care</h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li><Link to="/contact" className="hover:text-ivory transition">Shipping</Link></li>
              <li><Link to="/contact" className="hover:text-ivory transition">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-ivory transition">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-ivory transition">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-luxury uppercase mb-6 text-gold">Newsletter</h4>
            <form onSubmit={subscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full bg-transparent border-b border-cream/30 py-2 text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition"
              />
              <button type="submit" className="text-[11px] tracking-luxury uppercase hover:text-gold transition">
                Subscribe →
              </button>
            </form>
            {msg && <p className="text-xs text-gold mt-2">{msg}</p>}
          </div>
        </div>
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} BagsWaves. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-ivory">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
