document.addEventListener('DOMContentLoaded', function() {
    // Helper function for API calls
    async function fetchWishlist() {
      try {
        const response = await fetch('/api/wishlist');
        return await response.json();
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
      }
    }
  
    async function addToWishlist(productId) {
      try {
        const response = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId })
        });
        const data = await response.json();
        if (data.success) {
          updateWishlistCount();
          updateWishlistUI();
          showToast(`Item added to wishlist`);
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    }
  
    async function removeFromWishlist(productId) {
      try {
        const response = await fetch('/api/wishlist/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId })
        });
        const data = await response.json();
        if (data.success) {
          updateWishlistCount();
          updateWishlistUI();
          showToast(`Item removed from wishlist`);
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    }
  
    // Update wishlist count in navbar
    async function updateWishlistCount() {
      try {
        const wishlist = await fetchWishlist();
        const count = wishlist.length;
        document.querySelectorAll('.wishlist-count').forEach(el => {
          el.textContent = count;
        });
      } catch (error) {
        console.error('Error updating wishlist count:', error);
      }
    }
  
    // Update wishlist UI
    async function updateWishlistUI() {
      try {
        const wishlist = await fetchWishlist();
        const wishlistContainer = document.querySelector('.wishlist-container');
        const wishlistEmpty = document.querySelector('.wishlist-empty');
        
        if (!wishlist || wishlist.length === 0) {
          if (wishlistEmpty) wishlistEmpty.style.display = 'block';
          if (wishlistContainer) wishlistContainer.innerHTML = '';
          return;
        }
        
        if (wishlistEmpty) wishlistEmpty.style.display = 'none';
        
        // Render wishlist items
        if (wishlistContainer) {
          wishlistContainer.innerHTML = wishlist.map(item => `
            <div class="wishlist-item" data-id="${item.id}">
              <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="wishlist-item-details">
                <h3 class="wishlist-item-title">${item.name}</h3>
                <p class="wishlist-item-price">$${item.price.toFixed(2)}</p>
              </div>
              <div class="wishlist-item-actions">
                <button class="remove-wishlist-item" data-id="${item.id}">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="btn add-to-cart-from-wishlist" data-id="${item.id}">Add to Cart</button>
              </div>
            </div>
          `).join('');
        }
      } catch (error) {
        console.error('Error updating wishlist UI:', error);
      }
    }
  
    // Event delegation for wishlist operations
    document.addEventListener('click', function(e) {
      // Add to wishlist from product card
      if (e.target.closest('.add-to-wishlist')) {
        const productId = parseInt(e.target.closest('.add-to-wishlist').dataset.id);
        addToWishlist(productId);
      }
      
      // Add to wishlist from product page
      if (e.target.closest('.add-to-wishlist-btn')) {
        const productId = parseInt(e.target.closest('.add-to-wishlist-btn').dataset.id);
        addToWishlist(productId);
      }
      
      // Remove item from wishlist
      if (e.target.closest('.remove-wishlist-item')) {
        const productId = parseInt(e.target.closest('.remove-wishlist-item').dataset.id);
        removeFromWishlist(productId);
      }
      
      // Add to cart from wishlist
      if (e.target.closest('.add-to-cart-from-wishlist')) {
        const productId = parseInt(e.target.closest('.add-to-cart-from-wishlist').dataset.id);
        addToCart(productId);
        removeFromWishlist(productId); // Optional: remove from wishlist when adding to cart
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
    updateWishlistCount();
    updateWishlistUI();
  
    // This function should be imported from cart.js in a real app
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
          showToast(`Item added to cart`);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  
    // This function should be imported from cart.js in a real app
    async function updateCartCount() {
      try {
        const response = await fetch('/api/cart');
        const cart = await response.json();
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
          el.textContent = count;
        });
      } catch (error) {
        console.error('Error updating cart count:', error);
      }
    }
  });