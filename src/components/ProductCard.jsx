import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const price = product.salePrice || product.price;
  const hasSale = product.salePrice && product.salePrice < product.price;

  return (
    <article className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream mb-4">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </Link>
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 p-2 bg-ivory/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Wishlist"
        >
          <Heart size={16} strokeWidth={1.5} className={isInWishlist(product._id) ? 'fill-espresso' : ''} />
        </button>
        {product.isNewArrival && (
          <span className="absolute top-3 left-3 text-[10px] tracking-luxury uppercase bg-ivory px-2 py-1">New</span>
        )}
        {product.isBestseller && !product.isNewArrival && (
          <span className="absolute top-3 left-3 text-[10px] tracking-luxury uppercase bg-ivory px-2 py-1">Bestseller</span>
        )}
      </div>
      <div className="space-y-1">
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="font-serif text-lg tracking-wide hover:opacity-70 transition">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          {hasSale && <span className="text-taupe line-through">${product.price.toLocaleString()}</span>}
          <span className={hasSale ? 'text-gold' : ''}>${price.toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}
