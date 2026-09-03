import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/wishlist').then(res => setWishlist(res.data.wishlist || [])).catch(() => {});
    } else {
      try {
        setWishlist(JSON.parse(localStorage.getItem('bagswaves_wishlist')) || []);
      } catch { setWishlist([]); }
    }
  }, [user]);

  useEffect(() => {
    if (!user) localStorage.setItem('bagswaves_wishlist', JSON.stringify(wishlist));
  }, [wishlist, user]);

  const toggleWishlist = async (product) => {
    const exists = wishlist.some(p => (p._id || p) === product._id);
    if (user) {
      if (exists) {
        await api.delete(`/wishlist/${product._id}`);
        setWishlist(prev => prev.filter(p => p._id !== product._id));
      } else {
        const { data } = await api.post('/wishlist', { productId: product._id });
        setWishlist(data.wishlist);
      }
    } else {
      if (exists) setWishlist(prev => prev.filter(p => (p._id || p) !== product._id));
      else setWishlist(prev => [...prev, product]);
    }
  };

  const isInWishlist = (id) => wishlist.some(p => (p._id || p) === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
