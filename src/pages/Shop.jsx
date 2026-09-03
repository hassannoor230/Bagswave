import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    params.set('limit', 12);
    api.get(`/products?${params}`).then(res => {
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
    }).finally(() => setLoading(false));
  }, [searchParams, page]);

  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide mb-4">Shop</h1>
          <p className="text-taupe text-sm">Timeless handbags for the modern woman</p>
        </div>
        <div className="flex flex-wrap gap-3 mb-10 justify-center text-xs tracking-luxury uppercase">
          <button onClick={() => setSearchParams({})} className={`px-4 py-2 border ${!searchParams.toString() ? 'border-espresso bg-espresso text-ivory' : 'border-cream'}`}>All</button>
          <button onClick={() => setSearchParams({ isNewArrival: 'true' })} className={`px-4 py-2 border ${searchParams.get('isNewArrival') ? 'border-espresso bg-espresso text-ivory' : 'border-cream'}`}>New</button>
          <button onClick={() => setSearchParams({ isBestseller: 'true' })} className={`px-4 py-2 border ${searchParams.get('isBestseller') ? 'border-espresso bg-espresso text-ivory' : 'border-cream'}`}>Bestsellers</button>
          <select
            className="px-4 py-2 border border-cream bg-transparent text-xs tracking-luxury uppercase"
            value={searchParams.get('sort') || ''}
            onChange={e => {
              const p = new URLSearchParams(searchParams);
              if (e.target.value) p.set('sort', e.target.value); else p.delete('sort');
              setSearchParams(p);
            }}
          >
            <option value="">Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            {products.length === 0 && <p className="text-center text-taupe py-20">No products found.</p>}
            {total > 12 && (
              <div className="flex justify-center gap-4 mt-12">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-outline disabled:opacity-40">Previous</button>
                <button disabled={page * 12 >= total} onClick={() => setPage(p => p + 1)} className="btn-outline disabled:opacity-40">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
