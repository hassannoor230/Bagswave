import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="container-luxury max-w-md mx-auto">
        <h1 className="font-serif text-3xl tracking-wide text-center mb-8">Sign In</h1>
        <form onSubmit={handle} className="space-y-4">
          {error && <p className="text-sm text-red-700">{error}</p>}
          <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-cream px-4 py-3 bg-transparent" />
          <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-cream px-4 py-3 bg-transparent" />
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
        <p className="text-center text-sm text-taupe mt-6">
          New to BagsWaves? <Link to="/register" className="text-espresso underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
