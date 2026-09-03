import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    api.get(`/products/slug/${slug}`).then(res => {
      setProduct(res.data.product);
      setSelectedColor(res.data.product.colors?.[0] || null);
    }).catch(() => setProduct(null));
  }, [slug]);

  if (!product) return <div className="pt-32 text-center text-taupe">Loading...</div>;

  const price = product.salePrice || product.price;

  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="aspect-[3/4] bg-cream mb-4 overflow-hidden">
              <img src={product.images?.[activeImg] || product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              {product.images?.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-24 overflow-hidden border ${activeImg === i ? 'border-espresso' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-luxury uppercase text-gold mb-2">{product.category?.name}</p>
            <h1 className="font-serif text-3xl md:text-4xl tracking-wide mb-4">{product.name}</h1>
            <p className="text-xl mb-6">${price.toLocaleString()}</p>
            <p className="text-taupe leading-relaxed mb-8">{product.shortDescription || product.description?.slice(0, 180)}</p>
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs tracking-luxury uppercase mb-3">Color — {selectedColor?.name}</p>
                <div className="flex gap-3">
                  {product.colors.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor?.name === c.name ? 'border-espresso' : 'border-transparent'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-cream">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3">−</button>
                <span className="w-10 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-3">+</button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => addToCart(product, qty, selectedColor)} className="btn-primary flex-1">Add to Bag</button>
              <button onClick={() => toggleWishlist(product)} className="btn-outline flex items-center justify-center gap-2">
                <Heart size={16} className={isInWishlist(product._id) ? 'fill-espresso' : ''} /> Wishlist
              </button>
            </div>
            <div className="mt-12 space-y-6 text-sm text-taupe border-t border-cream pt-8">
              <div>
                <h3 className="text-espresso text-xs tracking-luxury uppercase mb-2">Description</h3>
                <p className="leading-relaxed">{product.description}</p>
              </div>
              {product.materials?.length > 0 && (
                <div>
                  <h3 className="text-espresso text-xs tracking-luxury uppercase mb-2">Materials</h3>
                  <p>{product.materials.join(', ')}</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <h3 className="text-espresso text-xs tracking-luxury uppercase mb-2">Dimensions</h3>
                  <p>{Object.entries(product.dimensions).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join(' · ')}</p>
                </div>
              )}
              {product.careInstructions && (
                <div>
                  <h3 className="text-espresso text-xs tracking-luxury uppercase mb-2">Care</h3>
                  <p>{product.careInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
