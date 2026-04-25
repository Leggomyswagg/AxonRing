import React, { useState, useEffect, useRef } from 'react';
import { products, Product } from '@/data/products';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProduct: (product: Product) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onViewProduct }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
        p.nfcCapabilities.some(c => c.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-0 left-0 right-0 z-50 max-w-2xl mx-auto mt-20 px-4">
        <div className="bg-[hsl(220,25%,9%)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search smart rings, features, NFC capabilities..."
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500">Start typing to search our collection...</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['NFC', 'Payments', 'Health', 'Premium', 'Sport'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 text-xs text-gray-400 bg-white/5 rounded-full hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-400">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="p-2">
                {results.map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onViewProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate">{product.shortDesc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-400">${product.price}</p>
                      <ArrowRight className="w-3 h-3 text-gray-600 ml-auto mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
