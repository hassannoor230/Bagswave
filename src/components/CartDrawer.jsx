import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[70]"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ivory z-[80] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-cream">
              <h2 className="font-serif text-xl tracking-wide">Your Bag ({itemCount})</h2>
              <button onClick={closeCart} aria-label="Close"><X size={20} strokeWidth={1.5} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <p className="text-sm text-taupe text-center py-12">Your bag is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={`${item.product._id}-${item.color}`} className="flex gap-4">
                    <img src={item.product.images?.[0]} alt="" className="w-20 h-24 object-cover bg-cream" />
                    <div className="flex-1">
                      <h3 className="font-serif text-base">{item.product.name}</h3>
                      {item.color && <p className="text-xs text-taupe mt-0.5">{item.color}</p>}
                      <p className="text-sm mt-1">${item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.product._id, item.color, item.quantity - 1)} className="p-1"><Minus size={14} /></button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.color, item.quantity + 1)} className="p-1"><Plus size={14} /></button>
                        <button onClick={() => removeFromCart(item.product._id, item.color)} className="ml-auto text-xs text-taupe hover:text-espresso">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-cream space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <Link to="/checkout" onClick={closeCart} className="btn-primary w-full text-center">Checkout</Link>
                <Link to="/cart" onClick={closeCart} className="block text-center text-xs tracking-luxury uppercase hover:opacity-70">View Bag</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
