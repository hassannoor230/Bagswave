import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const shipping = subtotal >= 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Your Bag is Empty</h1>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury">
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide mb-12 text-center">Shopping Bag</h1>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={`${item.product._id}-${item.color}`} className="flex gap-6 border-b border-cream pb-6">
                <img src={item.product.images?.[0]} alt="" className="w-28 h-36 object-cover bg-cream" />
                <div className="flex-1">
                  <h3 className="font-serif text-lg">{item.product.name}</h3>
                  {item.color && <p className="text-sm text-taupe">{item.color}</p>}
                  <p className="mt-1">${item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQuantity(item.product._id, item.color, item.quantity - 1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.color, item.quantity + 1)}><Plus size={14} /></button>
                    <button onClick={() => removeFromCart(item.product._id, item.color)} className="ml-auto text-xs text-taupe">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-cream/50 p-8 h-fit">
            <h2 className="font-serif text-xl mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Complimentary' : `$${shipping}`}</span></div>
              <div className="flex justify-between"><span>Estimated Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-medium text-base pt-4 border-t border-cream"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center mt-8 block">Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
