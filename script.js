document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealObserver = reduceMotion ? null : new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  function armReveal(element, delay = 0, variant = '') {
    if (!element) return;
    element.classList.add('reveal');
    if (variant) element.classList.add(variant);
    element.style.setProperty('--reveal-delay', `${delay}ms`);

    if (reduceMotion) {
      element.classList.add('in-view');
      return;
    }

    revealObserver.observe(element);
  }

  [
    ['.hero-subtitle', 80, 'reveal-left'],
    ['.hero-title-giant', 180, 'reveal-left'],
    ['.hero-title-frame', 300, 'reveal-right'],
    ['.hero-tagline', 420, 'reveal-left'],
    ['.hero-desc', 540, 'reveal-left'],
    ['.hero-actions', 650, 'reveal-left'],
    ['.hero-portrait', 380, 'reveal-pop'],
    ['.showreel-section .section-header', 0, 'reveal-pop'],
    ['.video-frame', 130, 'reveal-pop'],
    ['.showreel-actions', 260, ''],
    ['.artworks-section .section-header', 0, 'reveal-pop'],
    ['.artworks-filter', 130, ''],
    ['.contact-info-panel', 0, 'reveal-left'],
    ['.contact-form-card', 160, 'reveal-right'],
    ['footer', 0, '']
  ].forEach(([selector, delay, variant]) => {
    document.querySelectorAll(selector).forEach(element => armReveal(element, delay, variant));
  });

  function updateParallax() {
    if (reduceMotion) return;
    const scrolled = window.scrollY || window.pageYOffset || 0;
    const portrait = document.querySelector('.portrait-frame');
    const byline = document.querySelector('.hero-title-by');
    const maxHeroScroll = Math.min(scrolled, window.innerHeight);
    const portraitShift = Math.round(maxHeroScroll * 0.035);
    const bylineShift = Math.round(maxHeroScroll * -0.025);

    if (portrait) {
      portrait.style.setProperty('--portrait-shift', `${portraitShift}px`);
    }

    if (byline) {
      byline.style.translate = `0 ${bylineShift}px`;
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // Mobile navigation toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  
  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const open = mobileNavMenu.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', String(open));
      mobileNavToggle.innerHTML = open ? '&#x2715;' : '&#x2630;'; // X or Hamburger
    });
    
    // Close mobile menu on clicking any link
    mobileNavMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavMenu.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavToggle.innerHTML = '&#x2630;';
      });
    });
  }

  // Smooth scroll menu active indicators
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-nav-menu a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    const setLinkActive = (links) => {
      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };
    
    setLinkActive(navLinks);
    setLinkActive(mobileLinks);
  });

  // Artworks Gallery Data (using the actual local downloaded files)
  const artworks = [
    {
      title: "Metal Sentinel Concept",
      category: "video",
      categoryLabel: "Video Editing",
      file: "assets/img_3.png"
    },
    {
      title: "Liquid Splash Keyart",
      category: "graphic",
      categoryLabel: "Graphic Design",
      file: "assets/red_splash_high.png"
    },
    {
      title: "Cyberpunk Studio Composite",
      category: "graphic",
      categoryLabel: "Graphic Design",
      file: "assets/man_posing.jpg"
    },
    {
      title: "Fluid Ink Overlay",
      category: "motion",
      categoryLabel: "3D Motion",
      file: "assets/img_5.png"
    },
    {
      title: "Industrial Interface Asset",
      category: "graphic",
      categoryLabel: "Graphic Design",
      file: "assets/img_4.png"
    },
    {
      title: "Dark Ambient Backdrop",
      category: "motion",
      categoryLabel: "3D Motion",
      file: "assets/background_blurred.jpg"
    }
  ];

  // Render Artworks Grid
  const galleryGrid = document.getElementById('gallery-grid');
  
  function renderGallery(filterCategory = 'all') {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    
    const filteredArtworks = filterCategory === 'all' 
      ? artworks 
      : artworks.filter(art => art.category === filterCategory);
      
    filteredArtworks.forEach((art, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.setAttribute('data-category', art.category);
      
      card.innerHTML = `
        <div class="gallery-card-img-wrapper">
          <img src="${art.file}" alt="${art.title}" loading="lazy">
          <div class="gallery-card-overlay">
            <h4 class="gallery-card-title">${art.title}</h4>
            <span class="gallery-card-category">${art.categoryLabel}</span>
          </div>
        </div>
        <div class="gallery-card-meta">
          <span class="gallery-card-meta-title">${art.title}</span>
          <span class="gallery-card-meta-tag">${art.categoryLabel}</span>
        </div>
      `;
      
      card.addEventListener('click', () => openLightbox(art));
      armReveal(card, index * 80, 'reveal-pop');
      galleryGrid.appendChild(card);
    });
  }
  
  // Gallery Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderGallery(filter);
    });
  });

  // Lightbox Modal Functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxClose = document.getElementById('lightbox-close');
  
  function openLightbox(artwork) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = artwork.file;
    lightboxImg.alt = artwork.title;
    if (lightboxTitle) lightboxTitle.textContent = artwork.title;
    if (lightboxCategory) lightboxCategory.textContent = artwork.categoryLabel;
    
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock scrolling
  }
  
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = ''; // Unlock scrolling
  }
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // Contact Form Handling (Interactive Mockup Toast)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;
      
      if (!name || !email || !message) {
        showToast('Please fill in all fields.', 'error');
        return;
      }
      
      // Beautiful simulation of sending message
      showToast(`Thank you, ${name}! Your message was submitted.`, 'success');
      contactForm.reset();
    });
  }

  // Custom Toast Notification
  function showToast(msg, type = 'success') {
    // Check if toast already exists
    let toast = document.querySelector('.toast-notify');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notify';
      document.body.appendChild(toast);
      
      // Add toast styles dynamically if not in CSS
      const style = document.createElement('style');
      style.innerHTML = `
        .toast-notify {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1100;
          padding: 16px 28px;
          border-radius: 8px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 1.5px;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .toast-notify.show {
          transform: translateY(0);
          opacity: 1;
        }
        .toast-success {
          background: linear-gradient(135deg, #e52b2b, #731919);
          border-color: rgba(229,43,43,0.4);
          box-shadow: 0 10px 30px rgba(229, 43, 43, 0.3);
        }
        .toast-error {
          background: #333;
          border-color: rgba(255,255,255,0.2);
        }
      `;
      document.head.appendChild(style);
    }
    
    toast.textContent = msg;
    toast.className = `toast-notify show toast-${type}`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Initialize Gallery
  renderGallery('all');
});
