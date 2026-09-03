import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="container-luxury max-w-md mx-auto">
        <h1 className="font-serif text-3xl tracking-wide text-center mb-8">Create Account</h1>
        <form onSubmit={handle} className="space-y-4">
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="First Name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="border border-cream px-4 py-3 bg-transparent" />
            <input required placeholder="Last Name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="border border-cream px-4 py-3 bg-transparent" />
          </div>
          <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-cream px-4 py-3 bg-transparent" />
          <input type="password" required minLength={6} placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-cream px-4 py-3 bg-transparent" />
          <button type="submit" className="btn-primary w-full">Create Account</button>
        </form>
        <p className="text-center text-sm text-taupe mt-6">
          Already have an account? <Link to="/login" className="text-espresso underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
