import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(query)}&limit=6`);
        setResults(data.products || []);
      } catch { setResults([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-ivory"
        >
          <div className="container-luxury pt-8">
            <div className="flex items-center gap-4 border-b border-espresso/20 pb-4">
              <Search size={20} strokeWidth={1.5} className="text-taupe" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search handbags..."
                className="flex-1 bg-transparent text-lg font-serif focus:outline-none placeholder:text-taupe/60"
              />
              <button onClick={onClose} aria-label="Close"><X size={22} strokeWidth={1.5} /></button>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(p => (
                <Link key={p._id} to={`/product/${p.slug}`} onClick={onClose} className="flex gap-4 group">
                  <img src={p.images?.[0]} alt="" className="w-20 h-24 object-cover bg-cream" />
                  <div>
                    <h3 className="font-serif group-hover:opacity-70 transition">{p.name}</h3>
                    <p className="text-sm text-taupe mt-1">${(p.salePrice || p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
            {query && results.length === 0 && (
              <p className="text-center text-taupe py-12">No results for “{query}”</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
