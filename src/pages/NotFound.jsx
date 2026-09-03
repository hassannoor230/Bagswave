import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="pt-32 pb-20 text-center">
      <h1 className="font-serif text-5xl mb-4">404</h1>
      <p className="text-taupe mb-8">Page not found.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </div>
  );
}
