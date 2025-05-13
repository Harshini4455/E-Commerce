document.addEventListener('DOMContentLoaded', function() {
    // Helper function for API calls
    async function fetchCart() {
      try {
        const response = await fetch('/api/cart');
        return await response.json();
      } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
      }
    }
  
    async function addToCart(productId, quantity = 1) {
      try {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity })
        });
        const data = await response.json();
        if (data.success) {
          updateCartCount();
          updateCartUI();
          showToast(`Item added to cart`);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  
    async function updateCartItem(productId, quantity) {
      try {
        const response = await fetch('/api/cart/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity })
        });
        const data = await response.json();
        if (data.success) {
          updateCartUI();
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  
    async function removeFromCart(productId) {
      try {
        const response = await fetch('/api/cart/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId })
        });
        const data = await response.json();
        if (data.success) {
          updateCartCount();
          updateCartUI();
          showToast(`Item removed from cart`);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  
    // Update cart count in navbar
    async function updateCartCount() {
      try {
        const cart = await fetchCart();
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
          el.textContent = count;
        });
      } catch (error) {
        console.error('Error updating cart count:', error);
      }
    }
  
    // Update cart UI
    async function updateCartUI() {
      try {
        const cart = await fetchCart();
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartEmpty = document.querySelector('.cart-empty');
        const subtotalElement = document.querySelector('.subtotal');
        const shippingElement = document.querySelector('.shipping');
        const totalElement = document.querySelector('.total-amount');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (!cart || cart.length === 0) {
          if (cartEmpty) cartEmpty.style.display = 'block';
          if (cartItemsContainer) cartItemsContainer.innerHTML = '';
          if (subtotalElement) subtotalElement.textContent = '$0.00';
          if (shippingElement) shippingElement.textContent = '$0.00';
          if (totalElement) totalElement.textContent = '$0.00';
          if (checkoutBtn) checkoutBtn.disabled = true;
          return;
        }
        
        if (cartEmpty) cartEmpty.style.display = 'none';
        
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 10;
        const total = subtotal + shipping;
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
        if (checkoutBtn) checkoutBtn.disabled = false;
        
        // Render cart items
        if (cartItemsContainer) {
          cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
              <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
              </div>
              <div class="cart-item-actions">
                <button class="remove-item" data-id="${item.id}">
                  <i class="fas fa-trash"></i>
                </button>
                <div class="quantity-controls">
                  <button class="quantity-btn minus" data-id="${item.id}">-</button>
                  <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                  <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
              </div>
            </div>
          `).join('');
        }
      } catch (error) {
        console.error('Error updating cart UI:', error);
      }
    }
  
    // Event delegation for cart operations
    document.addEventListener('click', function(e) {
      // Add to cart from product card
      if (e.target.closest('.add-to-cart')) {
        const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
        addToCart(productId);
      }
      
      // Add to cart from product page
      if (e.target.closest('.add-to-cart-btn')) {
        const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
        const quantity = parseInt(document.querySelector('.quantity-input')?.value) || 1;
        addToCart(productId, quantity);
      }
      
      // Remove item
      if (e.target.closest('.remove-item')) {
        const productId = parseInt(e.target.closest('.remove-item').dataset.id);
        removeFromCart(productId);
      }
      
      // Decrease quantity
      if (e.target.closest('.minus')) {
        const productId = parseInt(e.target.closest('.minus').dataset.id);
        const input = e.target.closest('.quantity-controls').querySelector('.quantity-input');
        const newQuantity = parseInt(input.value) - 1;
        if (newQuantity >= 1) {
          input.value = newQuantity;
          updateCartItem(productId, newQuantity);
        }
      }
      
      // Increase quantity
      if (e.target.closest('.plus')) {
        const productId = parseInt(e.target.closest('.plus').dataset.id);
        const input = e.target.closest('.quantity-controls').querySelector('.quantity-input');
        const newQuantity = parseInt(input.value) + 1;
        input.value = newQuantity;
        updateCartItem(productId, newQuantity);
      }
    });
  
    // Handle manual quantity input changes
    document.addEventListener('change', function(e) {
      if (e.target.classList.contains('quantity-input')) {
        const productId = parseInt(e.target.dataset.id);
        const newQuantity = parseInt(e.target.value) || 1;
        if (newQuantity >= 1) {
          updateCartItem(productId, newQuantity);
        } else {
          e.target.value = 1;
        }
      }
    });
  
    // Show toast notification
    function showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }
  
    // Initialize UI
    updateCartCount();
    updateCartUI();
  });