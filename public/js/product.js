document.addEventListener('DOMContentLoaded', function() {
    // Quantity selector functionality
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    if (minusBtn && plusBtn && quantityInput) {
      minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value > 1) {
          quantityInput.value = value - 1;
        }
      });
      
      plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        quantityInput.value = value + 1;
      });
      
      quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 1) {
          quantityInput.value = 1;
        }
      });
    }
  
    // Add to Cart button event listener
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', function() {
        const productId = parseInt(this.dataset.id);
        const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
        addToCart(productId, quantity);
      });
    }
  
    // Add to Wishlist button event listener
    const addToWishlistBtn = document.querySelector('.add-to-wishlist-btn');
    if (addToWishlistBtn) {
      addToWishlistBtn.addEventListener('click', function() {
        const productId = parseInt(this.dataset.id);
        addToWishlist(productId);
      });
    }
  
    // These functions should be imported from cart.js and wishlist.js in a real app
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
          showToast(`Item added to cart`);
          updateCartCount();
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
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
          showToast(`Item added to wishlist`);
          updateWishlistCount();
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    }
  
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
  
    async function updateWishlistCount() {
      try {
        const response = await fetch('/api/wishlist');
        const wishlist = await response.json();
        const count = wishlist.length;
        document.querySelectorAll('.wishlist-count').forEach(el => {
          el.textContent = count;
        });
      } catch (error) {
        console.error('Error updating wishlist count:', error);
      }
    }
  
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
  });