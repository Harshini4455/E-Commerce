const express = require('express');
const path = require('path');
const app = express();
const fs = require("fs")
// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import products data
const products = require('./products.json');

// Routes
app.get('/', (req, res) => {
  res.render('index', { products });
});

app.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.render('product', { product });
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/wishlist', (req, res) => {
  res.render('wishlist');
});

// API endpoints for cart and wishlist
app.post('/api/cart', (req, res) => {
  // Cart operations would be handled here
  res.json({ success: true });
});

app.post('/api/wishlist', (req, res) => {
  // Wishlist operations would be handled here
  res.json({ success: true });
});

// Update app.js with these additions

// Add this near the top with other requires

// Helper function to read products
function getProducts() {
  const productsData = fs.readFileSync(path.join(__dirname, 'products.json'));
  return JSON.parse(productsData);
}

// Cart and Wishlist API endpoints
// Initialize in-memory storage (in a real app, use a database)
let carts = {};
let wishlists = {};

// Middleware to handle session (simplified for demo)
app.use((req, res, next) => {
  // For demo purposes, we'll use a fixed session ID
  // In a real app, you'd use proper session management
  req.sessionId = 'demo-user';
  next();
});

// Cart API
app.get('/api/cart', (req, res) => {
  res.json(carts[req.sessionId] || []);
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  if (!carts[req.sessionId]) {
    carts[req.sessionId] = [];
  }
  
  const existingItem = carts[req.sessionId].find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    carts[req.sessionId].push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity || 1
    });
  }
  
  res.json({ success: true, cart: carts[req.sessionId] });
});

app.post('/api/cart/update', (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!carts[req.sessionId]) {
    return res.status(400).json({ error: 'Cart not found' });
  }
  
  const item = carts[req.sessionId].find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      carts[req.sessionId] = carts[req.sessionId].filter(item => item.id !== productId);
    } else {
      item.quantity = quantity;
    }
    res.json({ success: true, cart: carts[req.sessionId] });
  } else {
    res.status(404).json({ error: 'Item not found in cart' });
  }
});

app.post('/api/cart/remove', (req, res) => {
  const { productId } = req.body;
  
  if (!carts[req.sessionId]) {
    return res.status(400).json({ error: 'Cart not found' });
  }
  
  carts[req.sessionId] = carts[req.sessionId].filter(item => item.id !== productId);
  res.json({ success: true, cart: carts[req.sessionId] });
});

// Wishlist API
app.get('/api/wishlist', (req, res) => {
  res.json(wishlists[req.sessionId] || []);
});

app.post('/api/wishlist/add', (req, res) => {
  const { productId } = req.body;
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  if (!wishlists[req.sessionId]) {
    wishlists[req.sessionId] = [];
  }
  
  const existingItem = wishlists[req.sessionId].find(item => item.id === productId);
  
  if (!existingItem) {
    wishlists[req.sessionId].push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    res.json({ success: true, wishlist: wishlists[req.sessionId] });
  } else {
    res.json({ success: true, message: 'Item already in wishlist', wishlist: wishlists[req.sessionId] });
  }
});

app.post('/api/wishlist/remove', (req, res) => {
  const { productId } = req.body;
  
  if (!wishlists[req.sessionId]) {
    return res.status(400).json({ error: 'Wishlist not found' });
  }
  
  wishlists[req.sessionId] = wishlists[req.sessionId].filter(item => item.id !== productId);
  res.json({ success: true, wishlist: wishlists[req.sessionId] });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});