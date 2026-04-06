import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getCollection, getCollectionProducts, PRODUCTS } from '@/data/catalog';

export default function CollectionPage() {
  const { handle } = useParams<{ handle: string }>();
  const [sortBy, setSortBy] = useState('featured');

  const collection = handle ? getCollection(handle) : undefined;
  const baseProducts = handle
    ? (handle === 'all-rings' ? PRODUCTS : getCollectionProducts(handle))
    : PRODUCTS;

  const sorted = [...baseProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':  return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc':   return a.name.localeCompare(b.name);
      case 'name-desc':  return b.name.localeCompare(a.name);
      default:           return 0;
    }
  });

  if (!collection) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <CartDrawer />
        <div className="pt-40 text-center">
          <h1 className="text-2xl font-bold text-zinc-400 mb-4">Collection not found</h1>
          <Link to="/collections/all-rings" className="text-rose-400 hover:text-rose-300">Browse all rings →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <CartDrawer />

      <div className="pt-28 lg:pt-36 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <nav className="flex items-center gap-2 text-sm text-zinc-500">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-300">{collection.title}</span>
          </nav>
        </div>

        {/* Collection Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative h-64 md:h-72 rounded-3xl overflow-hidden mb-8">
            <img src={collection.image_url} alt={collection.title} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">{collection.title}</h1>
              <p className="text-lg text-zinc-300">{collection.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">{sorted.length} product{sorted.length !== 1 ? 's' : ''}</p>
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sorted.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-zinc-400">No products in this collection yet.</p>
              <Link to="/collections/all-rings" className="text-rose-400 mt-4 inline-block hover:text-rose-300">Browse all rings →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sorted.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
