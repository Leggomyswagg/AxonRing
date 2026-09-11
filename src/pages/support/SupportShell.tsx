import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

interface SupportShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// Shared layout for support/legal pages (/size-guide, /faq, /shipping, /returns, /privacy, /terms).
export default function SupportShell({ eyebrow, title, subtitle, children }: SupportShellProps) {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <CartDrawer />
      <main className="pt-28 lg:pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400 mb-4">{eyebrow}</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h1>
          {subtitle && <p className="text-lg text-zinc-400 max-w-2xl mb-12">{subtitle}</p>}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
