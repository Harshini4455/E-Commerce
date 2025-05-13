document.addEventListener('DOMContentLoaded', function() {
    // Animate product cards on hover
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
    
    // Hero section animation
    const hero = document.querySelector('.hero');
    if (hero) {
      gsap.from(hero, {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.3
      });
      
      gsap.from(hero.querySelector('h1'), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6
      });
      
      gsap.from(hero.querySelector('p'), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.8
      });
      
      gsap.from(hero.querySelector('.btn'), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1
      });
    }
    
    // Product grid animation
    const productGrid = document.querySelector('.products-grid');
    if (productGrid) {
      gsap.from('.product-card', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power2.out'
      });
    }
    
    // Product page animation
    const productPage = document.querySelector('.product-page');
    if (productPage) {
      gsap.from('.product-gallery', {
        opacity: 0,
        x: -20,
        duration: 0.8,
        delay: 0.3
      });
      
      gsap.from('.product-info', {
        opacity: 0,
        x: 20,
        duration: 0.8,
        delay: 0.5
      });
    }
    
    // Cart and wishlist page animations
    const cartPage = document.querySelector('.cart-page');
    const wishlistPage = document.querySelector('.wishlist-page');
    
    if (cartPage) {
      gsap.from('.cart-container > *', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.3
      });
    }
    
    if (wishlistPage) {
      gsap.from('.wishlist-container', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.3
      });
    }
  });