// ── AxonRing Static Product & Collection Catalog ──
// Source of truth for all product/collection data.
// Prices are in DOLLARS (not cents) to match checkout logic.

export interface Variant {
  id: string;
  option1: string; // ring size
  price: number;   // dollars
  sku: string;
  inventory_qty: number;
}

export interface Product {
  id: string;
  handle: string;
  name: string;
  description: string;
  price: number; // dollars — base price (smallest variant)
  images: string[];
  tags: string[];
  metadata: { nfc: boolean; finish: string; material: string };
  variants: Variant[];
  features: string[];
  rating: number;
  review_count: number;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image_url: string;
  is_visible: boolean;
  product_ids: string[];
}

// ── Ring sizes available on all products ──
const SIZES = ['6', '7', '8', '9', '10', '11', '12'];

function makeVariants(productId: string, basePrice: number): Variant[] {
  return SIZES.map(size => ({
    id: `${productId}-${size}`,
    option1: size,
    price: basePrice,
    sku: `${productId.toUpperCase().replace(/-/g, '')}-${size}`,
    inventory_qty: 50,
  }));
}

const HERO_BASE = 'https://d64gsuwffb70l.cloudfront.net';

export const PRODUCTS: Product[] = [
  {
    id: 'axonring-elite',
    handle: 'axonring-elite',
    name: 'AxonRing Elite',
    description: 'The pinnacle of smart ring engineering. Crafted from aerospace-grade titanium with a ceramic coating, the Elite delivers unmatched NFC performance, advanced health tracking, and a lifetime finish guarantee. For those who demand the best.',
    price: 399,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
      `${HERO_BASE}/69d0c917003e3eb97e85a036_1775290974994_c1322658.jpg`,
    ],
    tags: ['elite', 'featured', 'best-seller'],
    metadata: { nfc: true, finish: 'Ceramic Black', material: 'Titanium + Ceramic' },
    variants: makeVariants('axonring-elite', 399),
    features: ['NFC Payments', 'Heart Rate Monitor', 'SpO2 Tracking', 'Sleep Analysis', 'Smart Home Control', 'Lifetime Warranty'],
    rating: 4.9,
    review_count: 312,
  },
  {
    id: 'axonring-adventure',
    handle: 'axonring-adventure',
    name: 'AxonRing Adventure',
    description: 'Built for the bold. Military-grade titanium, IP68 waterproofing, and a scratch-resistant surface that can handle anything nature throws at it. Tap to pay on the trail, at the summit, or in the water.',
    price: 219,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['pro', 'featured', 'best-seller'],
    metadata: { nfc: true, finish: 'Matte Titanium', material: 'Grade 5 Titanium' },
    variants: makeVariants('axonring-adventure', 219),
    features: ['NFC Payments', 'IP68 Waterproof', 'GPS Tracking', 'Heart Rate Monitor', '72hr Battery Life'],
    rating: 4.8,
    review_count: 478,
  },
  {
    id: 'axonring-pro',
    handle: 'axonring-pro',
    name: 'AxonRing Pro',
    description: 'The smart ring for everyday achievers. Brushed steel finish meets advanced NFC tech in a slim, comfortable profile. Seamlessly pay, unlock, and share your contact info with a single tap.',
    price: 249,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['pro', 'featured'],
    metadata: { nfc: true, finish: 'Brushed Steel', material: 'Stainless Steel' },
    variants: makeVariants('axonring-pro', 249),
    features: ['NFC Payments', 'Access Control', 'Contact Sharing', 'Activity Tracking', '48hr Battery'],
    rating: 4.7,
    review_count: 389,
  },
  {
    id: 'axonring-balance',
    handle: 'axonring-balance',
    name: 'AxonRing Balance',
    description: 'Designed for wellness. The Balance ring focuses on what matters most — your health. Continuous SpO2, stress monitoring, and guided breathing exercises, all in an ultra-slim tungsten band.',
    price: 169,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['pro', 'wellness'],
    metadata: { nfc: true, finish: 'Rose Gold', material: 'Tungsten' },
    variants: makeVariants('axonring-balance', 169),
    features: ['SpO2 Monitor', 'Stress Tracking', 'Sleep Analysis', 'NFC Payments', 'Guided Breathing'],
    rating: 4.7,
    review_count: 241,
  },
  {
    id: 'axonring-classic',
    handle: 'axonring-classic',
    name: 'AxonRing Classic',
    description: 'Timeless design meets modern technology. The Classic brings NFC payments and access control to a traditional ring silhouette. Perfect for those who want smart features without the tech look.',
    price: 149,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['standard'],
    metadata: { nfc: true, finish: 'Polished Silver', material: 'Tungsten Carbide' },
    variants: makeVariants('axonring-classic', 149),
    features: ['NFC Payments', 'Access Control', 'Contact Sharing', '30-Day Battery'],
    rating: 4.6,
    review_count: 198,
  },
  {
    id: 'axonring-prestige',
    handle: 'axonring-prestige',
    name: 'AxonRing Prestige',
    description: 'Luxury redefined. The Prestige features an 18k gold-plated tungsten band with a hand-polished finish. Every detail is crafted for those who wear success.',
    price: 349,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['elite', 'luxury'],
    metadata: { nfc: true, finish: '18k Gold Plated', material: 'Tungsten + Gold' },
    variants: makeVariants('axonring-prestige', 349),
    features: ['NFC Payments', 'Access Control', 'Health Tracking', '18k Gold Finish', 'Premium Packaging'],
    rating: 4.8,
    review_count: 156,
  },
  {
    id: 'axonring-executive',
    handle: 'axonring-executive',
    name: 'AxonRing Executive',
    description: 'Command the boardroom and the street. The Executive ring pairs a matte black ceramic finish with premium business features — digital business card sharing, meeting NFC triggers, and secure office access.',
    price: 289,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['elite', 'business'],
    metadata: { nfc: true, finish: 'Matte Black Ceramic', material: 'Ceramic' },
    variants: makeVariants('axonring-executive', 289),
    features: ['Digital Business Card', 'NFC Payments', 'Office Access Control', 'Health Tracking', '60hr Battery'],
    rating: 4.7,
    review_count: 203,
  },
  {
    id: 'axonring-sport',
    handle: 'axonring-sport',
    name: 'AxonRing Sport',
    description: 'Your fitness partner, on your finger. The Sport ring tracks every rep, every run, every heartbeat — with a reinforced carbon fiber band that weighs almost nothing.',
    price: 179,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['pro', 'fitness'],
    metadata: { nfc: true, finish: 'Carbon Fiber', material: 'Carbon Fiber' },
    variants: makeVariants('axonring-sport', 179),
    features: ['Advanced Fitness Tracking', 'Heart Rate Monitor', 'NFC Payments', 'IP68 Waterproof', 'Carbon Fiber Band'],
    rating: 4.6,
    review_count: 287,
  },
  {
    id: 'axonring-lite',
    handle: 'axonring-lite',
    name: 'AxonRing Lite',
    description: 'Your first step into the future. The Lite brings essential NFC features at an accessible price — pay, unlock, and share contacts without touching your phone.',
    price: 99,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['standard', 'new-arrival'],
    metadata: { nfc: true, finish: 'Polished Black', material: 'Stainless Steel' },
    variants: makeVariants('axonring-lite', 99),
    features: ['NFC Payments', 'Access Control', '14-Day Battery'],
    rating: 4.5,
    review_count: 512,
  },
  {
    id: 'axonring-minimal',
    handle: 'axonring-minimal',
    name: 'AxonRing Minimal',
    description: 'Less is more. The thinnest, lightest ring in our lineup. 2mm profile, featherweight tungsten, and full NFC capability. You\'ll forget you\'re wearing it.',
    price: 139,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['standard'],
    metadata: { nfc: true, finish: 'Brushed Titanium', material: 'Titanium' },
    variants: makeVariants('axonring-minimal', 139),
    features: ['NFC Payments', '2mm Ultra-Thin Profile', 'Contact Sharing', '21-Day Battery'],
    rating: 4.6,
    review_count: 167,
  },
  {
    id: 'axonring-luxe',
    handle: 'axonring-luxe',
    name: 'AxonRing Luxe',
    description: 'Inspired by fine jewellery. The Luxe ring features a diamond-cut tungsten band with a brushed finish and rose gold accent stripe. Elegance you can tap with.',
    price: 229,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['elite', 'luxury', 'new-arrival'],
    metadata: { nfc: true, finish: 'Diamond-Cut Rose Gold', material: 'Tungsten' },
    variants: makeVariants('axonring-luxe', 229),
    features: ['NFC Payments', 'Health Tracking', 'Diamond-Cut Finish', 'Premium Gift Box', '30hr Battery'],
    rating: 4.8,
    review_count: 134,
  },
  {
    id: 'axonring-focus',
    handle: 'axonring-focus',
    name: 'AxonRing Focus',
    description: 'Designed for deep work. The Focus ring uses biometric feedback to detect stress levels and nudges you toward better focus states throughout your day.',
    price: 199,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['pro', 'wellness', 'new-arrival'],
    metadata: { nfc: true, finish: 'Frosted Graphite', material: 'Titanium' },
    variants: makeVariants('axonring-focus', 199),
    features: ['Stress Biometrics', 'Focus Score', 'NFC Payments', 'Sleep Tracking', 'Haptic Feedback'],
    rating: 4.7,
    review_count: 98,
  },
  {
    id: 'axonring-harmony',
    handle: 'axonring-harmony',
    name: 'AxonRing Harmony',
    description: 'Balance your world. The Harmony ring blends sleep science with smart home automation — unlock your bedroom routine, dim your lights, and start your morning playlist with a single tap.',
    price: 189,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['pro', 'smart-home'],
    metadata: { nfc: true, finish: 'Pearl White', material: 'Tungsten' },
    variants: makeVariants('axonring-harmony', 189),
    features: ['Smart Home Control', 'Sleep Tracking', 'NFC Payments', 'Morning Routines', 'App Integration'],
    rating: 4.6,
    review_count: 142,
  },
  {
    id: 'axonring-serenity',
    handle: 'axonring-serenity',
    name: 'AxonRing Serenity',
    description: 'Made for mindful living. Ultra-smooth zirconia ceramic with a warm sand finish — the most comfortable ring in our lineup, designed for those who wear it 24/7.',
    price: 159,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['standard', 'wellness'],
    metadata: { nfc: true, finish: 'Sand Ceramic', material: 'Zirconia Ceramic' },
    variants: makeVariants('axonring-serenity', 159),
    features: ['NFC Payments', '24/7 Comfort Fit', 'Sleep Tracking', 'Mindfulness Nudges', 'Hypoallergenic'],
    rating: 4.7,
    review_count: 221,
  },
  {
    id: 'axonring-essence',
    handle: 'axonring-essence',
    name: 'AxonRing Essence',
    description: 'Stripped back to what matters. The Essence ring is a single continuous band of pure tungsten — no seams, no gaps, just clean geometry and reliable NFC technology.',
    price: 129,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['standard'],
    metadata: { nfc: true, finish: 'Gunmetal', material: 'Tungsten Carbide' },
    variants: makeVariants('axonring-essence', 129),
    features: ['NFC Payments', 'Access Control', 'Seamless Band', '21-Day Battery'],
    rating: 4.5,
    review_count: 176,
  },
  {
    id: 'axonring-innovate',
    handle: 'axonring-innovate',
    name: 'AxonRing Innovate',
    description: 'The tech-first ring. The Innovate packs the most features into the slimmest form factor — multi-protocol NFC, Bluetooth proximity alerts, and gesture controls for your connected devices.',
    price: 299,
    images: [
      `${HERO_BASE}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    ],
    tags: ['elite', 'tech', 'new-arrival'],
    metadata: { nfc: true, finish: 'Space Grey', material: 'Titanium Alloy' },
    variants: makeVariants('axonring-innovate', 299),
    features: ['Multi-Protocol NFC', 'Bluetooth 5.3', 'Gesture Controls', 'Health Tracking', 'OTA Updates'],
    rating: 4.8,
    review_count: 89,
  },
];

// ── Collections ──
export const COLLECTIONS: Collection[] = [
  {
    id: 'all-rings',
    handle: 'all-rings',
    title: 'All Rings',
    description: 'The complete AxonRing collection',
    image_url: `${HERO_BASE}/69d0c917003e3eb97e85a036_1775290974994_c1322658.jpg`,
    is_visible: true,
    product_ids: PRODUCTS.map(p => p.id),
  },
  {
    id: 'elite',
    handle: 'elite',
    title: 'Elite Collection',
    description: 'Uncompromising luxury and advanced technology',
    image_url: `${HERO_BASE}/69d0c917003e3eb97e85a036_1775290974994_c1322658.jpg`,
    is_visible: true,
    product_ids: PRODUCTS.filter(p => p.tags.includes('elite')).map(p => p.id),
  },
  {
    id: 'pro',
    handle: 'pro',
    title: 'Pro Collection',
    description: 'Advanced features for the everyday high-performer',
    image_url: `${HERO_BASE}/69d0c917003e3eb97e85a036_1775290974994_c1322658.jpg`,
    is_visible: true,
    product_ids: PRODUCTS.filter(p => p.tags.includes('pro')).map(p => p.id),
  },
  {
    id: 'standard',
    handle: 'standard',
    title: 'Standard Collection',
    description: 'Essential NFC smart ring features at accessible prices',
    image_url: `${HERO_BASE}/69d0c917003e3eb97e85a036_1775290974994_c1322658.jpg`,
    is_visible: true,
    product_ids: PRODUCTS.filter(p => p.tags.includes('standard')).map(p => p.id),
  },
  {
    id: 'new-arrivals',
    handle: 'new-arrivals',
    title: 'New Arrivals',
    description: 'Fresh drops — the latest rings just landed',
    image_url: `${HERO_BASE}/69d0c917003e3eb97e85a036_1775290974994_c1322658.jpg`,
    is_visible: true,
    product_ids: PRODUCTS.filter(p => p.tags.includes('new-arrival')).map(p => p.id),
  },
  {
    id: 'best-sellers',
    handle: 'best-sellers',
    title: 'Best Sellers',
    description: 'Customer favourites — the rings people love most',
    image_url: `${HERO_BASE}/69d0c917003e3eb97e85a036_1775290974994_c1322658.jpg`,
    is_visible: true,
    product_ids: PRODUCTS.filter(p => p.tags.includes('best-seller')).map(p => p.id),
  },
];

// ── Helpers ──
export function getProduct(handle: string): Product | undefined {
  return PRODUCTS.find(p => p.handle === handle);
}

export function getCollection(handle: string): Collection | undefined {
  return COLLECTIONS.find(c => c.handle === handle);
}

export function getCollectionProducts(handle: string): Product[] {
  const col = getCollection(handle);
  if (!col) return [];
  return col.product_ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q)) ||
    p.metadata.finish.toLowerCase().includes(q) ||
    p.metadata.material.toLowerCase().includes(q)
  );
}
