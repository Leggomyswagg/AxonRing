
echo 5 >"/home/tylong882/.local/share/cros-motd"
mkdir AxonRing
cd AxonRing
mkdir backend frontend
npm init -y
npm install express mongoose axios cors dotenv
MONGODB_URI=your_mongo_atlas_uri
CJ_API_KEY=your_cj_api_key
CJ_API_SECRET=your_cj_api_secret  # If required
PORT=5000
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// Product Schema (simple example)
const productSchema = new mongoose.Schema({
});
const Product = mongoose.model('Product', productSchema);
// Endpoint to import products from CJ (example: search and save)
app.post('/api/import-products', async (req, res) => {
});
// Endpoint for orders (place order with CJ)
app.post('/api/place-order', async (req, res) => {
});
// Get products for frontend
app.get('/api/products', async (req, res) => {
});
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
[200~tylong882@penguin:~$ 
install
npm install
npm install
`npm audit fix --force

cd axonring_v2
nmp run
pwd
nmp install
npm install
npm run dev
pwd
l
ls
npm run dev
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
npm install
npm instal
npm install
run npm audit fix --force
npm audit fix --force
npm run dev
git init
git add .
git commit -m "first commit"
git branch -m <tylong882@gmail.com>
git config --global user.name "Tylong"
git config --global user.email "tylong882@gmail.com"
git config --global user.name "Tylong"
git add .
git commit -m "first commit"
git add .
git commit -m "first commit"
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin main
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin main
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
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin main
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin main
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin main
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin mai[200~git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin mai
git remote set-url origin https://Leggomyswagg@[github.com/Leggomyswagg/axonring.git](https://github.com/Leggomyswagg/axonring.git)
git remote set-url origin https://Leggomyswagg@[github.com/Leggomyswagg/axonring.git]
git branch -M main
git push -u origin main
git remote set-url origin https://Leggomyswagg@[github.com/Leggomyswagg/axonring.git](https://github.com/Leggomyswagg/axonring.git)
git remote set-url origin https://Leggomyswagg@github.com/Leggomyswagg/axonring.git
git branch -M main
git push -u origin main
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git remote set-url origin https://Leggomyswagg@github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin main
git remote set-url origin https://github.com/Leggomyswagg/AxonRing.git
git branch -M main
git push -u origin main
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
ls
git add .
git commit -m "first commit"
git push -u origin main
git add .
git commit -m "first commit"
git push -u origin main
git add .
git commit -m "first commit"
git push -u origin main
npm install --legacy-peer-deps
npm fund
git add .
git commit -m "fix dependency conflict"
git push
npm install vite@^6.0.0 --save-dev --legacy-peer-deps
git add .
git commit -m "downgrade vite to fix deployment"
git push
npm i @vercel/speed-insights
git add
git add .
git push
ls
cd ~/axonring_v2
git add src/data/products.ts
git commit -m "update products with unique images and real descriptions"
git push
cd ~/axonring_v2
git add src/data/products.ts
git commit -m "update products with unique images and real descriptions"
git push
git add src/data/products.ts
git commit -m "raise AI Pro and Display prices"
git pus
git add src/data/products.ts
git commit -m "raise AI Pro and Display prices"
git push
find . -name "products.ts" 2>/dev/null
ls ~
find ~/src -name "products.ts" 2>/dev/null
find ~/AxonRing -name "products.ts" 2>/dev/null
tylong882@penguin:~$ find ~/src -name "products.ts" 2>/dev/null
tylong882@penguin:~$ find ~/AxonRing -name "products.ts" 2>/dev/null
tylong882@penguin:~$tylong882@penguin:~$ find ~/src -name "products.ts" 2>/dev/null
tylong882@penguin:~$ find ~/AxonRing -name "products.ts" 2>/dev/null
tylong882@penguin:~$tylong882@penguin:~$ find ~/src -name "products.ts" 2>/dev/null
tylong882@penguin:~$ find ~/AxonRing -name "products.ts" 2>/dev/null
tylong882@penguin:~$find ~ -name "catalog.ts" 2>/dev/null
cd ~/f8e2cc5ed_axonring_v2_vercel
cp src/data/catalog.ts src/data/catalog.ts.backup
nano src/data/catalog.ts
sed -i 's/price: 219.99/price: 329.99/g' src/data/catalog.ts
sed -i 's/originalPrice: 299.99/originalPrice: 429.99/g' src/data/catalog.ts
sed -i 's/price: 249.99/price: 349.99/g' src/data/catalog.ts
sed -i 's/originalPrice: 329.99/originalPrice: 449.99/g' src/data/catalog.ts
git add src/data/catalog.ts
git commit -m "raise AI Pro and Display prices"
git push
grep -n "price" src/data/catalog.ts | head -20
sed -i 's/price: 219,/price: 329,/g' src/data/catalog.ts
sed -i 's/price: 249,/price: 349,/g' src/data/catalog.ts
sed -i 's/price: 219,/price: 329,/g' src/data/catalog.ts
sed -i 's/price: 249,/price: 349,/g' src/data/catalog.ts
grep -n "price: 329\|price: 349" src/data/catalog.ts
git add src/data/catalog.ts
git commit -m "raise AI Pro and Display prices"
git push
git pull origin main --rebase
git push
git stash
git pull origin main --rebase
git stash pop
git push
ls
npm init @shopify/app@latest
sudo
usage: sudo -h | -K | -k | -V
usage: sudo -v [-ABkNnS] [-g group] [-h host] [-p prompt] [-u user]
usage: sudo -l [-ABkNnS] [-g group] [-h host] [-p prompt] [-U user] [-u user] [command [arg ...]]
usage: sudo [-ABbEHkNnPS] [-r role] [-t type] [-C num] [-D directory] [-g group] [-h host] [-p prompt] [-R directory] [-T timeout] [-u user] [VAR=value] [-i | -s] [command [arg ...]]
usage: sudo -e [-ABkNnS] [-r role] [-t type] [-C num] [-D directory] [-g group] [-h host] [-p prompt] [-R directory] [-T timeout] [-u user] file .[200~mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc~npm install -g @shopify/cli@latest
npm init @shopify/app@latest
cd ~
mkdir axonring-shopify
cd axonring-shopify
npm init @shopify/app@latest
cd ~/axonring
mkdir axonring
cd axonring
npm init @shopify/app@latest
npm install --legacy-peer-deps
npm run dev
R
cd ~
mkdir axonring-shopify
cd axonring-shopify
npm init @shopify/app@latest
Error coming from `npm install`
Command failed with exit code 1: npm install
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely
publicized security vulnerabilities, which have been fixed in the current version. Please
update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
npm warn tar TAR_ENTRY_ERROR ENOSPC: no space left on device, write
npm error A complete log of this run can be found in:
/home/tylong882/.npm/_logs/2026-04-07T21_31_58_833Z-debug-0.log
────────────────────────────────────────────────────────────────────────────────
npm error code 1
npm error path /home/tylong882/axonring-shopify
npm error command failed
npm error command sh -c create-app
npm error A complete log of this run can be found in: /home/tylong882/.npm/_logs/2026-04-07T21_02_53_803Z-debug-0.log
tylong882@penguin:~/axonring-shopify$ 
df -h ~
npm cache clean --force
cd ~
rm -rf axonring-shopify
du -sh ~/axonring
rm -rf ~/axonring/node_modules
df -h ~
rm -rf ~/axonring/node_modules
npm cache clean --force
df -h ~
Filesystem      Size  Used Avail Use% Mounted on
/dev/vdc         11G  5.3G  5.3G  51% /
cd ~
npm init @shopify/app@lates
cd ~
npm init @shopify/app@latest
npm install -g pnpm
pnpm create @shopify/app@latest
[200~curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NVM_DIR="$HOME/.config/nvm"
cd ~/axon
ls src/
cd ~/axon
ls src/
ls ~/axonring/src/components/
ls ~/axon
ls ~/axonring
ls ~/axon/app/routes
export PATH=~/.npm-global/bin:$PATH
source ~/.bashrc
node --version
nvm install 22
nvm use 22
node --version
pnpm create @shopify/app@latest
cd axon
shopify app dev
cd ~/axon
pnpm remove react-router-dom
pnpm add react-router@7.14.0
shopify app dev
mkdir -p ~/axon/app/components
mkdir -p ~/axon/app/data
mkdir -p ~/axon/app/styles
cat > ~/axon/app/styles/axonring.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.gradient-text {
  background: linear-gradient(135deg, #00D4FF, #7B61FF, #00D4FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.glass {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.hero-gradient {
  background: linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.7) 40%, rgba(10,22,40,0.4) 100%);
}
.product-card { transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
.product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,212,255,0.15); }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
.animate-float { animation: float 6s ease-in-out infinite; }
EOF

cat > ~/axon/app/routes/_index.tsx << 'ENDOFFILE'
import { json } from "@shopify/shopify-app-react-router/server";
import { useLoaderData, Link } from "react-router";
import { useState } from "react";
import "../styles/axonring.css";

const products = [
  { id: "axonring-titanium", name: "AxonRing Titanium", price: 89.99, originalPrice: 129.99, category: "Classic", badge: "Best Seller", image: "https://media.base44.com/images/public/69cf01ab6d65304465076290/a980644a7_generated_image.png", shortDesc: "Aerospace titanium NFC ring — featherlight, indestructible.", rating: 4.8, reviews: 312 },
  { id: "axonring-ceramic-pro", name: "AxonRing Ceramic Pro", price: 74.99, originalPrice: 99.99, category: "Classic", image: "https://media.base44.com/images/public/69cf01ab6d65304465076290/910e0d0e5_generated_image.png", shortDesc: "High-gloss ceramic NFC ring — hypoallergenic & scratch-proof.", rating: 4.7, reviews: 198 },
  { id: "axonring-sport-ecg", name: "AxonRing Sport ECG", price: 184.99, originalPrice: 249.99, category: "Sport", badge: "Best Seller", image: "https://media.base44.com/images/public/69cf01ab6d65304465076290/5a3af9234_generated_image.png", shortDesc: "Waterproof ECG & SpO2 health monitoring sport ring.", rating: 4.9, reviews: 421 },
  { id: "axonring-ai-pro", name: "AxonRing AI Pro", price: 329.99, originalPrice: 429.99, category: "Tech", badge: "New", image: "https://media.base44.com/images/public/69cf01ab6d65304465076290/bdbce4578_generated_image.png", shortDesc: "Bluetooth AI smart ring with personalized health coaching.", rating: 4.8, reviews: 167 },
  { id: "axonring-luxe-gold", name: "AxonRing Luxe Gold", price: 159.99, originalPrice: 219.99, category: "Luxury", badge: "Luxury", image: "https://media.base44.com/images/public/69cf01ab6d65304465076290/ff6cebe23_generated_image.png", shortDesc: "Matte black with 18K gold interior & crystal accent.", rating: 4.8, reviews: 134 },
  { id: "axonring-polymer-lite", name: "AxonRing Polymer Lite", price: 49.99, originalPrice: 79.99, category: "Essential", badge: "Value Pick", image: "https://media.base44.com/images/public/69cf01ab6d65304465076290/b594fda10_generated_image.png", shortDesc: "Lightweight polymer NFC ring — the perfect starter ring.", rating: 4.5, reviews: 589 },
  { id: "axonring-display", name: "AxonRing Display", price: 349.99, originalPrice: 449.99, category: "Tech", badge: "New", image: "https://media.base44.com/images/public/69cf01ab6d65304465076290/77975f28b_generated_image.png", shortDesc: "Smart ring with touch display screen for health & notifications.", rating: 4.7, reviews: 143 },
  { id: "axonring-aqua", name: "AxonRing Aqua", price: 79.99, originalPrice: 109.99, category: "Sport", image: "https://media.base44.com/images/public/69cf01ab6d65304465076290/6b2102416_generated_image.png", shortDesc: "Waterproof NFC ring — swim, surf, tap, repeat.", rating: 4.6, reviews: 278 },
];

export default function Index() {
  const [cart, setCart] = useState<{id:string,name:string,price:number,qty:number}[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  const addToCart = (p: typeof products[0]) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i);
      return [...prev, {id:p.id, name:p.name, price:p.price, qty:1}];
    });
  };

  const badgeColor = (badge?: string) => {
    if (badge === "Luxury") return "bg-gradient-to-r from-amber-500 to-yellow-400 text-black";
    if (badge === "New") return "bg-gradient-to-r from-green-500 to-emerald-400 text-white";
    if (badge === "Value Pick") return "bg-gradient-to-r from-teal-500 to-green-400 text-white";
    return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white";
  };

  return (
    <div style={{background:"hsl(220,25%,6%)",minHeight:"100vh",fontFamily:"Inter,sans-serif",color:"white"}}>
      {/* Announcement Bar */}
      <div style={{background:"linear-gradient(90deg,#0891b2,#2563eb,#0891b2)",textAlign:"center",padding:"8px",fontSize:"13px",fontWeight:500}}>
        FREE SHIPPING over $199 &nbsp;|&nbsp; Use code <strong>NFC2026</strong> for 15% off
      </div>

      {/* Navbar */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(10,18,35,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 24px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#00D4FF,#2563eb)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:16,height:16,borderRadius:"50%",border:"2px solid white"}}/>
            </div>
            <span style={{fontSize:20,fontWeight:800,letterSpacing:-0.5}}><span style={{color:"white"}}>AXON</span><span style={{color:"#00D4FF"}}>RING</span></span>
          </div>
          <div style={{display:"flex",gap:32,fontSize:14,fontWeight:500}}>
            {["Home","Shop","NFC Tech","About"].map(l => (
              <a key={l} href="#" style={{color:"#9ca3af",textDecoration:"none",transition:"color 0.2s"}} onMouseOver={e=>(e.currentTarget.style.color="#00D4FF")} onMouseOut={e=>(e.currentTarget.style.color="#9ca3af")}>{l}</a>
            ))}
          </div>
          <button onClick={() => setCartOpen(true)} style={{position:"relative",background:"none",border:"none",cursor:"pointer",color:"#9ca3af",padding:8}}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span style={{position:"absolute",top:2,right:2,background:"#00D4FF",color:"black",fontSize:10,fontWeight:700,width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{position:"relative",minHeight:"90vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(10,22,40,0.97) 0%,rgba(10,22,40,0.7) 50%,rgba(10,22,40,0.4) 100%)"}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 70% 50%, rgba(0,212,255,0.08) 0%, transparent 60%)"}}/>
        <div style={{position:"relative",zIndex:10,maxWidth:1200,margin:"0 auto",padding:"80px 24px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:999,background:"rgba(0,212,255,0.08)",border:"1px solid rgba(0,212,255,0.2)",marginBottom:32}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#00D4FF"}}/>
            <span style={{fontSize:11,fontWeight:700,color:"#00D4FF",letterSpacing:2,textTransform:"uppercase"}}>NFC-Powered Smart Wearable</span>
          </div>
          <h1 style={{fontSize:"clamp(48px,8vw,88px)",fontWeight:900,lineHeight:0.95,marginBottom:24}}>
            <span style={{color:"white"}}>The Future</span><br/>
            <span style={{color:"white"}}>On Your </span>
            <span style={{background:"linear-gradient(135deg,#00D4FF,#7B61FF)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Finger</span>
          </h1>
          <p style={{fontSize:18,color:"#9ca3af",lineHeight:1.7,maxWidth:520,marginBottom:40}}>
            Tap to pay. Tap to unlock. Tap to connect. AxonRing combines premium craftsmanship with advanced NFC technology.
          </p>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <button onClick={() => document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})} style={{display:"flex",alignItems:"center",gap:8,padding:"16px 32px",background:"linear-gradient(135deg,#00D4FF,#2563eb)",color:"white",fontWeight:700,fontSize:15,border:"none",borderRadius:10,cursor:"pointer",boxShadow:"0 8px 32px rgba(0,212,255,0.25)"}}>
              Shop Collection →
            </button>
            <button style={{padding:"16px 32px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",color:"white",fontWeight:600,fontSize:15,borderRadius:10,cursor:"pointer",backdropFilter:"blur(10px)"}}>
              Explore NFC
            </button>
          </div>
          <div style={{display:"flex",gap:32,marginTop:48,flexWrap:"wrap"}}>
            {[["🔒","256-bit Encryption"],["⚡","No Charging Needed"],["📡","Universal NFC"]].map(([icon,label]) => (
              <div key={label} style={{display:"flex",alignItems:"center",gap:8,color:"#6b7280",fontSize:13,fontWeight:500}}>
                <span style={{color:"#00D4FF"}}>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" style={{maxWidth:1200,margin:"0 auto",padding:"80px 24px"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <h2 style={{fontSize:40,fontWeight:800,marginBottom:16}}>
            Shop the <span style={{background:"linear-gradient(135deg,#00D4FF,#7B61FF)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Collection</span>
          </h2>
          <p style={{color:"#6b7280",fontSize:16}}>Premium NFC smart rings for every lifestyle</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:24}}>
          {products.map(p => {
            const disc = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
            return (
              <div key={p.id} className="product-card" style={{background:"hsl(220,25%,9%)",borderRadius:16,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer"}}>
                <div style={{position:"relative",aspectRatio:"1",overflow:"hidden",background:"hsl(220,25%,12%)"}}>
                  <img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s"}} onMouseOver={e=>(e.currentTarget.style.transform="scale(1.08)")} onMouseOut={e=>(e.currentTarget.style.transform="scale(1)")}/>
                  {p.badge && <span className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase rounded-full ${badgeColor(p.badge)}`} style={{position:"absolute",top:12,left:12,padding:"4px 10px",fontSize:10,fontWeight:700,borderRadius:999}}>{p.badge}</span>}
                  <span style={{position:"absolute",top:12,right:12,padding:"3px 8px",fontSize:10,fontWeight:700,color:"#00D4FF",background:"rgba(0,212,255,0.1)",borderRadius:999,border:"1px solid rgba(0,212,255,0.2)"}}>-{disc}%</span>
                </div>
                <div style={{padding:16}}>
                  <p style={{fontSize:10,fontWeight:700,color:"#00D4FF",textTransform:"uppercase",letterSpacing:2,marginBottom:4}}>{p.category}</p>
                  <h3 style={{fontSize:15,fontWeight:700,color:"white",marginBottom:4}}>{p.name}</h3>
                  <p style={{fontSize:12,color:"#6b7280",marginBottom:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.shortDesc}</p>
                  <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:12}}>
                    {"★★★★★".split("").map((s,i) => <span key={i} style={{color: i < Math.round(p.rating) ? "#f59e0b" : "#374151",fontSize:12}}>{s}</span>)}
                    <span style={{fontSize:11,color:"#6b7280",marginLeft:4}}>({p.reviews})</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:20,fontWeight:800,color:"white"}}>${p.price}</span>
                      <span style={{fontSize:12,color:"#6b7280",textDecoration:"line-through"}}>${p.originalPrice}</span>
                    </div>
                    <button onClick={() => addToCart(p)} style={{padding:"8px 16px",background:"linear-gradient(135deg,#00D4FF,#2563eb)",color:"white",fontWeight:600,fontSize:12,border:"none",borderRadius:8,cursor:"pointer"}}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"48px 24px",textAlign:"center",color:"#4b5563",fontSize:13}}>
        <div style={{marginBottom:8,fontSize:20,fontWeight:800}}><span style={{color:"white"}}>AXON</span><span style={{color:"#00D4FF"}}>RING</span></div>
        <p>© 2026 AxonRing Smart Wearables. All rights reserved.</p>
        <p style={{marginTop:8,color:"#374151"}}>hello@[axonring.com](https://axonring.com) · 1-800-AXONRING · San Francisco, CA</p>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <div style={{position:"fixed",inset:0,zIndex:100}}>
          <div onClick={() => setCartOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}/>
          <div style={{position:"absolute",right:0,top:0,bottom:0,width:380,background:"hsl(220,25%,9%)",borderLeft:"1px solid rgba(255,255,255,0.08)",padding:24,overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h2 style={{fontSize:20,fontWeight:700}}>Your Cart ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:20}}>✕</button>
            </div>
            {cart.length === 0 ? (
              <p style={{color:"#6b7280",textAlign:"center",marginTop:48}}>Your cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    <div>
                      <p style={{fontSize:14,fontWeight:600,color:"white"}}>{item.name}</p>
                      <p style={{fontSize:12,color:"#6b7280"}}>Qty: {item.qty}</p>
                    </div>
                    <p style={{fontSize:15,fontWeight:700,color:"#00D4FF"}}>${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
                <div style={{marginTop:24,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                    <span style={{fontWeight:600}}>Total</span>
                    <span style={{fontSize:20,fontWeight:800,color:"#00D4FF"}}>${cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2)}</span>
                  </div>
                  <button style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#00D4FF,#2563eb)",color:"white",fontWeight:700,fontSize:15,border:"none",borderRadius:10,cursor:"pointer"}}>
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


cd ~/axon
shopify app dev
source ~/.bashrc
nvm use 22
cd ~/axon
rm -rf node_modules
pnpm install
shopify app dev
cd ~/axon
cat package.json | grep react-router
find ~/axon/node_modules -maxdepth 2 -name "react-router-dom" -type d
grep -r "react-router-dom" ~/axon/app --include="*.tsx" --include="*.ts" -l
grep "react-router-dom" ~/axon/pnpm-lock.yaml | head -5
cd ~/axon
rm -rf node_modules .react-router build
pnpm install
shopify app dev
cd ~/axon
rm -rf node_modules .react-router build
pnpm install
source ~/.bashrc
nvm use 22
c
source ~/.bashrc
nvm use 22
cd ~/axon
rm -rf node_modules .react-router build
pnpm install
shopify app dev
pnpm approve-builds
shopify app dev
pnpm approve-builds
cd ~/axon
shopify app dev
nvm use 22
echo "nvm use 22" >> ~/.bashrc
nvm use --delete-prefix v22.22.2
[200~pnpm add react-router-dom@npm:react-router@7.14.0
shopify app dev~
find ~/axon/node_modules -name "react-router-dom" -type d 2>/dev/null
ls ~/axon/node_modules/.pnpm | grep react-router-dom
cd ~/axon
nano package.json
vi package.json
cd ~/axon
cp package.json package.json.bak
python3 -c "
import json
with open('package.json') as f:
    pkg = json.load(f)
pkg['pnpm'] = {'overrides': {'react-router-dom': 'npm:react-router@7.14.0'}}
with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
print('Done')
"
rm -rf node_modules
pnpm install
cd ~/axon
python3 -c "
import json
with open('package.json') as f:
    pkg = json.load(f)
pkg['dependencies']['react-router'] = '7.14.0'
pkg['dependencies']['react-router-dom'] = '7.14.0'
pkg['dependencies']['@react-router/dev'] = '7.14.0'
pkg['dependencies']['@react-router/fs-routes'] = '7.14.0'
pkg['dependencies']['@react-router/node'] = '7.14.0'
pkg['dependencies']['@react-router/serve'] = '7.14.0'
with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
print('Done')
"
rm -rf node_modules pnpm-lock.yaml
pnpm install --no-frozen-lockfile
shopify app dev
cd ~/axon
python3 -c "
import json
with open('package.json') as f:
    pkg = json.load(f)
pkg['dependencies']['react-router'] = '7.14.0'
pkg['dependencies']['react-router-dom'] = '7.14.0'
pkg['dependencies']['@react-router/dev'] = '7.14.0'
pkg['dependencies']['@react-router/fs-routes'] = '7.14.0'
pkg['dependencies']['@react-router/node'] = '7.14.0'
pkg['dependencies']['@react-router/serve'] = '7.14.0'
with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
print('Done')
"
rm -rf node_modules pnpm-lock.yaml
pnpm install --no-frozen-lockfile
shopify app dev
cd ~/axon
python3 -c "
import json
with open('package.json') as f:
    pkg = json.load(f)
pkg['dependencies']['react-router'] = '7.14.0'
pkg['dependencies']['react-router-dom'] = '7.14.0'
pkg['dependencies']['@react-router/dev'] = '7.14.0'
pkg['dependencies']['@react-router/fs-routes'] = '7.14.0'
pkg['dependencies']['@react-router/node'] = '7.14.0'
pkg['dependencies']['@react-router/serve'] = '7.14.0'
with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
print('Done')
"
rm -rf node_modules pnpm-lock.yaml
pnpm install --no-frozen-lockfile
shopify app dev
cd ~/axon
python3 -c "
import json
with open('package.json') as f:
    pkg = json.load(f)
pkg['dependencies']['react-router'] = '7.14.0'
pkg['dependencies']['react-router-dom'] = '7.14.0'
pkg['dependencies']['@react-router/dev'] = '7.14.0'
pkg['dependencies']['@react-router/fs-routes'] = '7.14.0'
pkg['dependencies']['@react-router/node'] = '7.14.0'
pkg['dependencies']['@react-router/serve'] = '7.14.0'
with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
print('Done')
"
rm -rf node_modules pnpm-lock.yaml
pnpm install --no-frozen-lockfile
shopify app dev
cd ~/axon  # or wherever your [axonring.com](https://axonring.com) repo is
git add -A
git commit -m "Fix product images, add logo & favicon"
git push
git remote set-url origin https://github.com/Leggomyswagg/axonring.git
git push -u origin main
git remote set-url origin https://github.com/Leggomyswagg/axonring.git
git push -u origin main
git remote set-url origin https://github.com/Leggomyswagg/AxRings.git
git push -u origin main
git remote set-url origin https://github.com/Leggomyswagg/AxonRing.git
git push -u origin main
ls
npm i @vercel/analytics
import { Analytics } from "@vercel/analytics/next"
[200~import { Analytics } from "@vercel/analytics/next"~
pnpm i @vercel/analytics
ls
// ── AxonRing Static Product & Collection Catalog ──
// Source of truth for all product/collection data.
// Prices are in DOLLARS (not cents) to match checkout logic.
export interface Variant {
}
export interface Product {
}
export interface Collection {
}
// ── Ring sizes available on all products ──
const SIZES = ['6', '7', '8', '9', '10', '11', '12'];
function makeVariants(productId: string, basePrice: number): Variant[] {
}
const HERO_BASE = 'https://d64gsuwffb70l.cloudfront.net';
export const PRODUCTS: Product[] = [
cd ~/axon
git remote -v
cd ~/axon
git remote -v
cd ~/axon
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git push -u origin main
cd ~/axon
git pull origin main --allow-unrelated-histories
git push -u origin main
git pull
[200~git branch --set-upstream-to=origin/<branch> main~
--set-upstream-to=origin/<branch> main
set-upstream-to=origin/<branch> main
git pull <remote> <branch>
git pull origin main --allow-unrelated-histories --no-rebase
git push -u origin main
Username for 'https://github.com': it push -u origin main --force
git push -u origin main --force
ls ~/axon/app/src/data/
ls ~/axonring/app/srs/data/
find ~ -name "products.ts" 2>/dev/null
cd ~
tar -xzf ~/Downloads/axonring_react_site.tar.gz
cd app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git add -A
git commit -m "Deploy updated React storefront with correct product images"
git push -u origin main --forcecd ~
tar -xzf ~/Downloads/axonring_react_site.tar.gz
cd app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git add -A
git commit -m "Deploy updated React storefront with correct product images"
cd ~
tar -xzf ~/Downloads/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git add -A
git commit -m "Deploy updated React storefront with correct product images"
git push -u origin main --force
df -h ~
sudo apt-get clean
pnpm store prune
rm -rf ~/axon/node_modules
df -h ~df -h ~
cd ~/axon
git remote -v
df -h ~
rm -rf ~/axon/node_modules
rm -rf ~/axon/.pnpm-store
sudo apt-get clean
sudo apt-get autoremove -y
df -h ~
du -sh ~/* 2>/dev/null | sort -rh | head -10
rm -rf ~/node_modules
rm -rf ~/"node_modules (1)"
rm -rf ~/Archive.zip
rm -rf ~/"Archive (1).zip"
rm -rf ~/f8e2cc5ed_axonring_v2_vercel
df -h ~
ls ~/Downloads/
ls ~/linux/
ls ~/Downloads/
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/ed4cf8cb6_axonring_react_sitetar.gz"
[200~tylong882@penguin:~$ wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/ed4cf8cb6_axonring_react_sitetar.gz"
--2026-04-14 00:52:41--  https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/ed4cf8cb6_axonring_react_sitetar.gz
Resolving base44.app (base44.app)... 216.24.57.7, 216.24.57.251
Connecting to base44.app (base44.app)|216.24.57.7|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://media.base44.com/files/public/69cf01ab6d65304465076290/ed4cf8cb6_axonring_react_sitetar.gz [following]
--2026-04-14 00:52:42--  https://media.base44.com/files/public/69cf01ab6d65304465076290/ed4cf8cb6_axonring_react_sitetar.gz
Resolving media.base44.com (media.base44.com)... 2600:9000:234b:9e00:14:ddef:40:93a1, 2600:9000:234b:7c00:14:ddef:40:93a1, 2600:9000:234b:c000:14:ddef:40:93a1, ...
Connecting to media.base44.com (media.base44.com)|2600:9000:234b:9e00:14:ddef:40:93a1|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 125514 (123K) [application/octet-stream]
Saving to: ‘/home/tylong882/axonring_react_site.tar.gz’
/home/tylong882/axonrin 100%[==============================>] 122.57K  --.-KB/s    in 0.1s    
Last-modified header invalid -- time-stamp ignored.
2026-04-14 00:52:43 (1.12 MB/s) - ‘/home/tylong882/axonring_react_site.tar.gz’ saved [125514/125514]
tylong882@penguin:~$ ~cd ~
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git add -A
git commit -m "Deploy updated React storefront with correct product images"
git push -u origin main --force
git branch -m master main
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/665e95061_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "Fix: add featureBanners and lifestyleImages exports"
git push -u origin main --force
cd ~/app
git commit --allow-empty -m "Trigger redeploy"
git push origin main
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/35c5a4288_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "Fix: add categories export to products.ts"
git push -u origin main --force
cd ~/app
git commit --allow-empty -m "Force cache clear"
git push origin main
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/479f49bf8_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "Fix: add markReviewHelpful export"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/4ddfaabba_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: new logos + hero text update"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/bb4862e96_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: luxury redesign - black/gold, lifestyle photos, conversion copy"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/8e4d4bbfa_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: hero combines world/wallet copy with lifestyle grid"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/6165b8ca9_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: NFC features grid with matching images"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/894e77488_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: 8 products, Ultra flagship, gold theme overhaul"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/894e77488_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: 8 products, Ultra flagship, gold theme overhaul"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/66a5814df_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: real product images for Ultra, NFC features, and health dashboard"
git push -u origin main --force
npm i @vercel/speed-insights
import { SpeedInsights } from "@vercel/speed-insights/next"
cd ~
rm -rf ~/app
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/de7f2e2c4_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "fix: Ultra gallery images + non-blocking product page load"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/96f81f754_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: real lifestyle photos for all NFC feature cards"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/73cdc852a_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "feat: full-bleed Ultra cinematic hero banner"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/8f6ddafa4_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
git commit -m "fix: Ultra ring visible in remote camera and business card feature cards"
git push -u origin main --force
cd ~
rm -rf ~/app
wget -O ~/axonring_react_site.tar.gz "https://base44.app/api/apps/69cf01ab6d65304465076290/files/mp/public/69cf01ab6d65304465076290/2e4cd5d77_axonring_react_sitetar.gz"
tar -xzf ~/axonring_react_site.tar.gz
cd ~/app
git init
git remote add origin https://github.com/Leggomyswagg/AxonRing.git
git branch -m master main
git add -A
