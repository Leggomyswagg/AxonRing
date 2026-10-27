export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  shortDesc: string;
  image: string;
  category: string;
  features: string[];
  nfcCapabilities: string[];
  material: string;
  waterproof: string;
  battery: string;
  sizes: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  flagship?: boolean;
}

const CDN = 'https://d64gsuwffb70l.cloudfront.net';

export const products: Product[] = [
  // ─── FLAGSHIP ───────────────────────────────────────────────────────────────
  {
    id: 'axonring-ultra',
    name: 'AxonRing Ultra',
    price: 549.99,
    originalPrice: 649.99,
    description: 'The most advanced smart ring ever made. AxonRing Ultra is the only ring in the world with a built-in micro-display and tactile button — giving you real-time notifications, health metrics, and gesture controls right on your finger. Pair it with the AxonRing app for full customization of your display, NFC shortcuts, and health dashboards. ECG, blood pressure, body temperature, SpO2, and AI-powered health coaching — all wrapped in aerospace-grade titanium.',
    shortDesc: 'The world\'s first smart ring with micro-display & button.',
    image: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/ee5dd0726_generated_image.png',
    category: 'Flagship',
    features: ['Micro-Display', 'Tactile Button', 'ECG Monitor', 'Blood Pressure', 'SpO2', 'AI Health Coach', 'Body Temperature', 'Gesture Control'],
    nfcCapabilities: ['Multi-Card Payments', 'Secure Access', 'Digital Wallet', 'Identity Verification', 'Programmable NFC', 'Custom Shortcuts'],
    material: 'Aerospace-Grade Titanium',
    waterproof: 'IP68 - 100m',
    battery: '4-6 days',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    rating: 5.0,
    reviews: 47,
    inStock: true,
    badge: 'New',
    flagship: true,
  },

  // ─── TOP 7 ───────────────────────────────────────────────────────────────────
  {
    id: 'axonring-elite',
    name: 'AxonRing Elite',
    price: 399.99,
    originalPrice: 499.99,
    description: 'The pinnacle of smart ring technology — before Ultra. AxonRing Elite features premium materials, ECG monitoring, AI health insights, and multi-card NFC support. A statement piece for those who demand the best.',
    shortDesc: 'Premium ECG-enabled NFC ring with AI health insights.',
    image: `${CDN}/69afc9463ade716221889914_1773187929465_e9130587.jpg`,
    category: 'Premium',
    features: ['ECG Monitor', 'Blood Pressure', 'AI Health Coach', 'Body Temperature'],
    nfcCapabilities: ['Multi-Card Payments', 'Secure Access', 'Digital Wallet', 'Identity Verification'],
    material: 'Titanium + Carbon Fiber',
    waterproof: 'IP68 - 100m',
    battery: '5-7 days',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    rating: 4.9,
    reviews: 189,
    inStock: true,
    badge: 'Premium',
  },
  {
    id: 'axonring-prestige',
    name: 'AxonRing Prestige',
    price: 349.99,
    originalPrice: 449.99,
    description: 'Wear success. The AxonRing Prestige is crafted from polished tungsten carbide with an 18k gold-plated finish. A luxury ring that turns heads while silently managing your payments, access, and digital identity.',
    shortDesc: '18k gold-plated tungsten NFC ring — wear success.',
    image: `${CDN}/69afc9463ade716221889914_1773188007617_99971f74.png`,
    category: 'Luxury',
    features: ['18K Gold Plated', 'NFC Payments', 'Health Tracking', 'Premium Packaging'],
    nfcCapabilities: ['Contactless Payments', 'VIP Access', 'Digital Business Card', 'Identity Sharing'],
    material: 'Tungsten Carbide + 18K Gold',
    waterproof: 'IP68 - 50m',
    battery: '7-10 days',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    badge: 'Luxury',
  },
  {
    id: 'axonring-executive',
    name: 'AxonRing Executive',
    price: 349.99,
    originalPrice: 429.99,
    description: 'Command the room. The AxonRing Executive is built for professionals — encrypted office access, secure payments, and a polished tungsten carbide build that pairs perfectly with a suit.',
    shortDesc: 'Luxury NFC ring engineered for business professionals.',
    image: `${CDN}/69afc9463ade716221889914_1773187930017_ed0f7c8e.jpg`,
    category: 'Premium',
    features: ['ECG Monitor', 'Stress Level', 'Meeting Timer', 'Posture Alerts'],
    nfcCapabilities: ['Encrypted Payments', 'Office Access', 'Digital Portfolio', 'Secure File Share'],
    material: 'Tungsten Carbide',
    waterproof: 'IP68 - 50m',
    battery: '5-7 days',
    sizes: ['7', '8', '9', '10', '11', '12'],
    rating: 4.8,
    reviews: 134,
    inStock: true,
  },
  {
    id: 'axonring-luxe',
    name: 'AxonRing Luxe',
    price: 229.99,
    originalPrice: 299.99,
    description: 'Inspired by fine jewellery. The Luxe ring features a diamond-cut tungsten band with a brushed finish and rose gold accent stripe. Elegance you can tap with.',
    shortDesc: 'Diamond-cut luxury NFC ring with rose gold accent.',
    image: `${CDN}/69afc9463ade716221889914_1773188006603_68b1f4fe.png`,
    category: 'Luxury',
    features: ['NFC Payments', 'Health Tracking', 'Diamond-Cut Finish', 'Premium Gift Box'],
    nfcCapabilities: ['Contactless Payments', 'VIP Access', 'Digital Business Card', 'Identity Sharing'],
    material: 'Tungsten',
    waterproof: 'IP67 - 30m',
    battery: '30 days',
    sizes: ['5', '6', '7', '8', '9', '10', '11', '12'],
    rating: 4.8,
    reviews: 134,
    inStock: true,
    badge: 'Luxury',
  },
  {
    id: 'axonring-pro',
    name: 'AxonRing Pro',
    price: 249.99,
    originalPrice: 319.99,
    description: 'The everyday essential. AxonRing Pro gives you everything you actually use — tap-to-pay, access control, contact sharing — wrapped in a brushed steel finish that works with any outfit.',
    shortDesc: 'Professional NFC ring built for everyday life.',
    image: `${CDN}/69afc9463ade716221889914_1773188004219_f2663bb3.jpg`,
    category: 'Everyday',
    features: ['NFC Payments', 'Access Control', 'Contact Sharing', 'Activity Tracking'],
    nfcCapabilities: ['Contactless Payments', 'Smart Lock', 'Digital Business Card', 'Transit Pass'],
    material: 'Stainless Steel 316L',
    waterproof: 'IP68 - 50m',
    battery: '10-14 days',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    rating: 4.7,
    reviews: 623,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: 'axonring-sport',
    name: 'AxonRing Sport',
    price: 179.99,
    originalPrice: 229.99,
    description: 'Built for athletes who don\'t slow down. Carbon fiber construction, advanced fitness tracking, and tap-to-pay at the gym — all in a ring tough enough to keep up with you.',
    shortDesc: 'Carbon fiber NFC ring — built for the gym and beyond.',
    image: `${CDN}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
    category: 'Sport',
    features: ['Advanced Fitness Tracking', 'Heart Rate Monitor', 'NFC Payments', 'Carbon Fiber Build'],
    nfcCapabilities: ['Contactless Payments', 'Gym Access', 'Health Data Share', 'Emergency Info'],
    material: 'Carbon Fiber',
    waterproof: 'IP68 - 100m',
    battery: '7-10 days',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    rating: 4.7,
    reviews: 445,
    inStock: true,
  },
  {
    id: 'axonring-lite',
    name: 'AxonRing Lite',
    price: 99.99,
    originalPrice: 129.99,
    description: 'Your first step into the future. The Lite brings essential NFC features at an accessible price — pay, unlock, and share contacts without touching your phone.',
    shortDesc: 'The perfect entry into the AxonRing world.',
    image: `${CDN}/69afc9463ade716221889914_1773187999116_9e4a6e8b.jpg`,
    category: 'Essential',
    features: ['NFC Payments', 'Access Control', 'Contact Sharing', 'Sleep Tracking'],
    nfcCapabilities: ['Contactless Payments', 'Access Control', 'Contact Sharing'],
    material: 'Stainless Steel',
    waterproof: 'IP67 - 30m',
    battery: '14 days',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    rating: 4.5,
    reviews: 512,
    inStock: true,
  },
];

export const heroBanner = 'https://media.base44.com/images/public/69cf01ab6d65304465076290/ba08a3e5c_generated_image.png';

export const heroImage = `${CDN}/69afc9463ade716221889914_1773187929465_e9130587.jpg`;

export const lifestyleImages = [
  'https://media.base44.com/images/public/69cf01ab6d65304465076290/1bdaaaf53_generated_image.png',
  'https://media.base44.com/images/public/69cf01ab6d65304465076290/24bd95bd1_generated_image.png',
  'https://media.base44.com/images/public/69cf01ab6d65304465076290/e913d576e_generated_image.png',
  'https://media.base44.com/images/public/69cf01ab6d65304465076290/d097c2120_generated_image.png',
];

// Health & feature marketing images
export const featureImages = {
  healthDashboard: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/d097c2120_generated_image.png',
  gpsMotion: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/24bd95bd1_generated_image.png',
  remoteCamera: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/ae20c7ce9_generated_image.png',
  nfcCapabilities: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/1bdaaaf53_generated_image.png',
  tiktokControl: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/ae20c7ce9_generated_image.png',
  accessControl: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/8b19c3527_generated_image.png',
  cycling: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/de11638fc_generated_image.png',
  lifestyle: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/0d0893d77_generated_image.png',
  working: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/fd1bccac0_generated_image.png',
  ultraRender1: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/ee5dd0726_generated_image.png',
  ultraRender2: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/ab0b0a5c2_generated_image.png',
  unboxing: 'https://media.base44.com/images/public/69cf01ab6d65304465076290/2aa7ef3be_generated_image.png',
};

export const featureBanners = [
  `${CDN}/69afc9463ade716221889914_1773187931200_ec86bb2a.png`,
  `${CDN}/69afc9463ade716221889914_1773187933781_a8c91325.png`,
];

export const LOGO_URL = 'https://media.base44.com/files/public/69cf01ab6d65304465076290/48f7d23ff_AxonRingNFCLogo.png';
export const LOGO_NFC_URL = 'https://media.base44.com/files/public/69cf01ab6d65304465076290/48f7d23ff_AxonRingNFCLogo.png';
export const LOGO_RING_URL = 'https://media.base44.com/files/public/69cf01ab6d65304465076290/f3c2703e3_AxonRingLogo.png';
