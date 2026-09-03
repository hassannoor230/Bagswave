import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get('/products?limit=50').then(res => setProducts(res.data.products || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Products</h1>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-4">{p.name}</td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">{p.isPublished ? 'Published' : 'Draft'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
