import { Link } from 'react-router-dom';
import { Wifi, Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: any;
  featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  const price = product.variants?.[0]?.price || product.price || 0; // already in dollars
  const hasNfc = product.metadata?.nfc;
  const finish = product.metadata?.finish || '';
  const isElite = product.tags?.includes('elite');

  return (
    <div
      className={`group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-rose-500/30 transition-all duration-500 ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isElite && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold uppercase tracking-wider rounded-full">
          Elite
        </div>
      )}
      
      <button
        onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
      >
        <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-rose-500 text-rose-500' : 'text-white/70'}`} />
      </button>

      <Link to={`/product/${product.handle}`} className="block">
        <div className={`relative overflow-hidden ${featured ? 'aspect-square' : 'aspect-square'}`}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
          
          {hasNfc && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Wifi className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">NFC Enabled</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400/80 mb-1.5">{finish}</p>
          <h3 className={`font-semibold text-white mb-2 group-hover:text-rose-300 transition-colors ${featured ? 'text-xl' : 'text-base'}`}>
            {product.name}
          </h3>
          {featured && (
            <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-white">
              ${price}
            </p>
            <div className="flex items-center gap-1 text-zinc-500 group-hover:text-rose-400 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-medium">Shop</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
