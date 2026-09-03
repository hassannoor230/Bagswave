import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.user.role !== 'admin') {
        setError('Admin access required');
        return;
      }
      navigate('/admin');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-ivory">
      <form onSubmit={handle} className="w-full max-w-sm space-y-4 p-8">
        <h1 className="font-serif text-2xl tracking-luxury uppercase text-center mb-8">Admin</h1>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border border-cream/30 px-4 py-3" />
        <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent border border-cream/30 px-4 py-3" />
        <button type="submit" className="w-full bg-gold text-black py-3 text-xs tracking-luxury uppercase">Sign In</button>
      </form>
    </div>
  );
}
