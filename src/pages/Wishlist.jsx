import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury">
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-center mb-12">Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="text-center text-taupe">
            <p className="mb-6">Your wishlist is empty.</p>
            <Link to="/shop" className="btn-primary">Explore Collections</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map(p => <ProductCard key={p._id || p} product={typeof p === 'object' ? p : { _id: p }} />)}
          </div>
        )}
      </div>
    </div>
  );
}
