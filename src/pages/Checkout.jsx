import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    street: '', city: '', state: '', postalCode: '', country: 'United States', phone: ''
  });

  if (cart.length === 0) {
    return <div className="pt-32 text-center"><p>Your bag is empty.</p></div>;
  }

  const shipping = subtotal >= 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    setLoading(true);
    try {
      const items = cart.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        color: i.color,
        colorHex: i.colorHex
      }));
      const { data } = await api.post('/orders', {
        items,
        shippingAddress: form,
        guestEmail: form.email,
        paymentMethod: 'card'
      });
      clearCart();
      navigate(`/account?order=${data.order.orderNumber}`);
    } catch (e) {
      alert(e.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-2xl">
        <h1 className="font-serif text-3xl tracking-wide mb-8 text-center">Checkout</h1>
        <div className="flex justify-center gap-4 mb-12 text-xs tracking-luxury uppercase">
          {[1,2,3].map(s => (
            <span key={s} className={step >= s ? 'text-espresso' : 'text-taupe'}>Step {s}</span>
          ))}
        </div>
        {step === 1 && (
          <div className="space-y-4">
            <input className="w-full border border-cream px-4 py-3 bg-transparent" placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
            <input className="w-full border border-cream px-4 py-3 bg-transparent" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input className="w-full border border-cream px-4 py-3 bg-transparent" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <button onClick={() => setStep(2)} className="btn-primary w-full">Continue to Shipping</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <input className="w-full border border-cream px-4 py-3 bg-transparent" placeholder="Street Address" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input className="border border-cream px-4 py-3 bg-transparent" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              <input className="border border-cream px-4 py-3 bg-transparent" placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
            </div>
            <input className="w-full border border-cream px-4 py-3 bg-transparent" placeholder="Postal Code" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />
            <button onClick={() => setStep(3)} className="btn-primary w-full">Continue to Review</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="bg-cream/50 p-6 mb-6 space-y-2 text-sm">
              <p><strong>Ship to:</strong> {form.fullName}, {form.street}, {form.city}</p>
              <p><strong>Total:</strong> ${total.toFixed(2)}</p>
            </div>
            <button onClick={placeOrder} disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
