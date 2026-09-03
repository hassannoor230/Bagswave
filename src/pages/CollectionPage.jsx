import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

export default function CollectionPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/collections/slug/${slug}`).then(res => setCollection(res.data.collection)).catch(() => {});
    api.get(`/products?collection=${slug}&limit=20`).then(res => setProducts(res.data.products || [])).catch(() => {});
  }, [slug]);

  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-luxury uppercase text-gold mb-4">Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide mb-4">{collection?.name || slug?.replace(/-/g, ' ')}</h1>
          {collection?.description && <p className="text-taupe max-w-lg mx-auto">{collection.description}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
