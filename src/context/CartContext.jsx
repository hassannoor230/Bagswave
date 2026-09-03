import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bagswaves_cart')) || [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bagswaves_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, color = null) => {
    setCart(prev => {
      const existing = prev.find(i => i.product._id === product._id && i.color === color?.name);
      if (existing) {
        return prev.map(i =>
          i.product._id === product._id && i.color === color?.name
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        product,
        quantity,
        color: color?.name || null,
        colorHex: color?.hex || null,
        price: product.salePrice || product.price
      }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId, color) => {
    setCart(prev => prev.filter(i => !(i.product._id === productId && i.color === color)));
  };

  const updateQuantity = (productId, color, quantity) => {
    if (quantity < 1) return removeFromCart(productId, color);
    setCart(prev => prev.map(i =>
      i.product._id === productId && i.color === color ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      subtotal, itemCount, isOpen, setIsOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
