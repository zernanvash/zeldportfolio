// â”€â”€ Loader â”€â”€
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 700);
      }, 1800);
    });

    // â”€â”€ Custom Cursor â”€â”€
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursor-ring');
    let mx = 0, my = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    // ring follows with slight lag
    function animRing() {
      ring.style.left = mx + 'px';
      ring.style.top  = my + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

    // â”€â”€ Scroll Reveal â”€â”€
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));

    // â”€â”€ Parallax hero text â”€â”€
    const heroName = document.querySelector('.hero-name');
    const heroSub  = document.querySelector('.hero-sub');
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (heroName) heroName.style.transform = `translateY(${sy * 0.18}px)`;
      if (heroSub)  heroSub.style.transform  = `translateY(${sy * 0.1}px)`;
    }, { passive: true });

    // â”€â”€ Film strip tilt on hover â”€â”€
    const filmStrip = document.querySelector('.film-strip');
    if (filmStrip) {
      filmStrip.addEventListener('mousemove', e => {
        const r = filmStrip.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        filmStrip.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) scale(1.02)`;
        filmStrip.style.transition = 'transform 0.08s ease';
      });
      filmStrip.addEventListener('mouseleave', () => {
        filmStrip.style.transform = '';
        filmStrip.style.transition = 'transform 0.5s ease, border-color 0.3s';
      });
    }

    // â”€â”€ Stat counter animation â”€â”€
    const statNums = document.querySelectorAll('.stat-num');
    const statObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const raw = el.textContent.trim();
          const num = parseFloat(raw);
          if (!isNaN(num)) {
            let start = 0;
            const end = num;
            const suffix = raw.replace(/[\d.]/g, '');
            const dur = 1200;
            const startT = performance.now();
            const tick = t => {
              const elapsed = t - startT;
              const prog = Math.min(elapsed / dur, 1);
              const ease = 1 - Math.pow(1 - prog, 3);
              el.textContent = (Number.isInteger(end)
                ? Math.round(ease * end)
                : (ease * end).toFixed(1)) + suffix;
              if (prog < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
          statObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statObs.observe(el));
