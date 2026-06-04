document.addEventListener('DOMContentLoaded', () => {

  // --- 0. PRELOADER ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Hide after 1.5s to ensure line animation completes
    setTimeout(() => {
      preloader.style.animation = 'preloaderFadeOut 0.5s ease forwards';
      setTimeout(() => { preloader.remove(); }, 500);
    }, 1500);
  }

  // --- 0. CUSTOM CURSOR ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    if (cursorDot && cursorOutline) {
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      // Slight delay for outline
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    }
  });

  // Mobile Menu Logic
  const openMobileMenuBtn = document.getElementById('open-mobile-menu');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (openMobileMenuBtn && closeMobileMenuBtn && mobileMenuOverlay) {
    openMobileMenuBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    closeMobileMenuBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close when clicking outside
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Configurator Sidebar Logic
  const configToggle = document.getElementById('config-toggle');
  const configuratorSidebar = document.getElementById('configurator-sidebar');
  const colorDots = document.querySelectorAll('.color-dot');

  if (configToggle && configuratorSidebar) {
    configToggle.addEventListener('click', () => {
      configuratorSidebar.classList.toggle('active');
    });
  }

  if (colorDots) {
    colorDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        // Remove active class from all
        colorDots.forEach(d => d.classList.remove('active'));
        // Add active to clicked
        e.target.classList.add('active');
        // Update CSS variable
        const newColor = e.target.getAttribute('data-color');
        document.documentElement.style.setProperty('--color-brand', newColor);
      });
    });
  }

  // Hover effects for cursor on interactive elements
  const interactables = document.querySelectorAll('a, button, .bento-item, .product-card');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorOutline) cursorOutline.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorOutline) cursorOutline.classList.remove('cursor-hover');
    });
  });

  // --- 0. DARK MODE TOGGLE ---
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.documentElement;
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    if (darkModeToggle) darkModeToggle.innerHTML = '<i class="ph ph-sun"></i>';
  }
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '<i class="ph ph-moon"></i>';
      } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '<i class="ph ph-sun"></i>';
      }
    });
  }

  // --- 0. 3D TILT EFFECT (Vanilla Tilt) ---
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".bento-item"), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      scale: 1.02
    });
    
    VanillaTilt.init(document.querySelectorAll(".product-card"), {
      max: 8,
      speed: 400,
      glare: false,
      scale: 1.01
    });
  }

  // Add shine class to primary buttons
  document.querySelectorAll('.btn-primary').forEach(btn => btn.classList.add('btn-shine'));

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
