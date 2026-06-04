document.addEventListener('DOMContentLoaded', () => {
  // 1. Tab Switcher Logic (Live Preview vs Mockup Showcase)
  const modeTabs = document.querySelectorAll('.mode-tab');
  const viewModes = document.querySelectorAll('.view-mode');

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs and views
      modeTabs.forEach(t => t.classList.remove('active'));
      viewModes.forEach(v => v.classList.remove('active'));

      // Add active to clicked tab and corresponding view
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // 2. Flash Sale Countdown Timer
  const timeBoxes = document.querySelectorAll('.time-box');
  if (timeBoxes.length === 3) {
    // Set a random end time (e.g., 5 hours, 32 mins, 10 secs from now)
    let totalSeconds = 5 * 3600 + 32 * 60 + 10;
    
    const updateTimer = () => {
      if (totalSeconds <= 0) return;
      totalSeconds--;
      
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      timeBoxes[0].textContent = String(hours).padStart(2, '0');
      timeBoxes[1].textContent = String(minutes).padStart(2, '0');
      timeBoxes[2].textContent = String(seconds).padStart(2, '0');
    };
    
    setInterval(updateTimer, 1000);
    updateTimer();
  }

  // 3. Best Sellers Filter Logic
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('#best-sellers .product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const filter = tab.getAttribute('data-filter');
      
      productCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          // Small animation effect
          card.classList.remove('animate-fade-up');
          void card.offsetWidth; // trigger reflow
          card.classList.add('animate-fade-up');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Cart Drawer Logic
  const cartIcon = document.getElementById('cart-trigger');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartClose = document.getElementById('cart-close');
  const addCartBtns = document.querySelectorAll('.btn-add-cart');
  const cartBadge = document.querySelector('.cart-badge');
  
  let cartCount = parseInt(cartBadge?.textContent || '0');

  const openCart = () => {
    if(cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    if(cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (cartIcon) cartIcon.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  
  // Close on outside click
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  // Add to cart animation
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Visual feedback on button
      const originalText = btn.textContent;
      btn.classList.add('btn-loading');
      
      setTimeout(() => {
        btn.classList.remove('btn-loading');
        btn.textContent = 'تمت الإضافة ✓';
        btn.style.backgroundColor = 'var(--color-success)';
        btn.style.color = 'white';
        
        // Update badge count
        cartCount++;
        if (cartBadge) {
          cartBadge.textContent = cartCount;
          cartBadge.style.animation = 'pulse 0.3s ease';
          setTimeout(() => { cartBadge.style.animation = ''; }, 300);
        }
        
        // Open cart to show user (optional UX choice, doing it after 1 sec)
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
          openCart();
        }, 1000);
        
      }, 800); // Simulate network request
    });
  });

  // 5. Scroll Animations (Intersection Observer)
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(el => observer.observe(el));
});
