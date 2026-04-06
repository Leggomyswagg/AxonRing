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
