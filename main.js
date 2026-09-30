/**
 * AuraClean - Production Marketing Website
 * Main JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. Smooth Scrolling with Lenis & GSAP ScrollTrigger Integration
     -------------------------------------------------------------------------- */
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // Smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        // Close mobile menu if open
        closeMobileMenu();

        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -70 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. Sticky Navbar & Active Navigation State
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('is-pinned');
    } else {
      navbar.classList.remove('is-pinned');
    }
  }, { passive: true });

  // IntersectionObserver for active link highlights
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1,
  });

  sections.forEach((sec) => sectionObserver.observe(sec));

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Menu
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.innerHTML = '<i data-lucide="x"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. BlurCharReveal (Split Heading Text into Character Animation)
     -------------------------------------------------------------------------- */
  function setupBlurCharReveal() {
    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    const headings = document.querySelectorAll('.char-reveal');

    headings.forEach((heading) => {
      // Split preserving special inner elements like .hero-highlight
      const childNodes = Array.from(heading.childNodes);
      heading.innerHTML = '';

      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const words = text.split(/(\s+)/);

          words.forEach((word) => {
            if (/^\s+$/.test(word)) {
              heading.appendChild(document.createTextNode(word));
            } else if (word.length > 0) {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'word-wrap';
              for (let i = 0; i < word.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = word[i];
                wordSpan.appendChild(charSpan);
              }
              heading.appendChild(wordSpan);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // If it's an element like .hero-highlight, preserve it
          heading.appendChild(node);
        }
      });

      const chars = heading.querySelectorAll('.char');

      gsap.fromTo(
        chars,
        {
          opacity: 0,
          filter: 'blur(10px)',
          y: 10,
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.02,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Special animation for hero highlight pill
    const heroHighlight = document.getElementById('hero-highlight-pill');
    if (heroHighlight) {
      gsap.fromTo(
        heroHighlight,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.4,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: heroHighlight,
            start: 'top 90%',
          },
        }
      );
    }
  }

  setupBlurCharReveal();

  /* --------------------------------------------------------------------------
     5. FadeUp Animations
     -------------------------------------------------------------------------- */
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    const fadeTargets = document.querySelectorAll('.fade-target');
    fadeTargets.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }

  /* --------------------------------------------------------------------------
     6. Hero Floating Collage Animations & Parallax
     -------------------------------------------------------------------------- */
  const heroCards = document.querySelectorAll('.hero-float-card');
  const heroSection = document.getElementById('hero');

  if (!prefersReducedMotion && typeof gsap !== 'undefined' && heroCards.length > 0) {
    // 1. Initial Scale & Fade In
    gsap.fromTo(
      heroCards,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.3,
        ease: 'power2.out',
      }
    );

    // 2. Idle Floating (gentle y bob ±8px, 4-6s sine loop, out of phase)
    heroCards.forEach((card, index) => {
      const dur = 4 + index * 0.6;
      const delay = index * 0.4;
      gsap.to(card, {
        y: index % 2 === 0 ? 8 : -8,
        duration: dur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      });
    });

    // 3. Mouse Parallax (desktop only >= 810px)
    if (window.innerWidth >= 810 && heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (clientX - centerX) / centerX;
        const deltaY = (clientY - centerY) / centerY;

        heroCards.forEach((card, idx) => {
          const factor = (idx + 1) * 3.5;
          gsap.to(card, {
            x: -deltaX * factor,
            duration: 0.8,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        });
      });

      // Reset parallax on leave
      heroSection.addEventListener('mouseleave', () => {
        heroCards.forEach((card) => {
          gsap.to(card, { x: 0, duration: 0.8, ease: 'power2.out' });
        });
      });
    }

    // 4. Scroll Parallax (Images drift outward / upward)
    heroCards.forEach((card) => {
      const speed = parseFloat(card.getAttribute('data-speed')) || 1;
      gsap.to(card, {
        yPercent: -25 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Benefits Section Image Clip-Path Reveal & CountUp
     -------------------------------------------------------------------------- */
  const benefitsImgBox = document.getElementById('benefits-img-box');
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && benefitsImgBox) {
    gsap.fromTo(
      benefitsImgBox,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: benefitsImgBox,
          start: 'top 80%',
        },
      }
    );
  }

  // CountUp logic
  const counterElements = document.querySelectorAll('[data-counter]');
  counterElements.forEach((el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    let triggered = false;

    const countUpObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
            const countObj = { val: 0 };
            gsap.to(countObj, {
              val: target,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.floor(countObj.val) + suffix;
              },
            });
          } else {
            el.textContent = target + suffix;
          }
        }
      });
    }, { threshold: 0.3 });

    countUpObserver.observe(el);
  });

  /* --------------------------------------------------------------------------
     8. Services Carousel (Swiper 11)
     -------------------------------------------------------------------------- */
  if (typeof Swiper !== 'undefined') {
    const servicesSwiper = new Swiper('#services-swiper', {
      slidesPerView: 1.15,
      spaceBetween: 16,
      grabCursor: true,
      freeMode: true,
      loop: true,
      pagination: {
        el: '#services-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2.2,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 3.2,
          spaceBetween: 20,
        },
      },
    });

    // Staggered slide entrance
    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
      const slides = document.querySelectorAll('#services-swiper .swiper-slide');
      gsap.fromTo(
        slides,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#services-swiper',
            start: 'top 85%',
          },
        }
      );
    }
  }

  /* --------------------------------------------------------------------------
     9. Team Image Clip-Path Reveal
     -------------------------------------------------------------------------- */
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    const teamImages = document.querySelectorAll('.team-image-wrapper');
    teamImages.forEach((imgWrap) => {
      gsap.fromTo(
        imgWrap,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imgWrap,
            start: 'top 85%',
          },
        }
      );
    });
  }

  /* --------------------------------------------------------------------------
     10. Testimonials Carousel (Swiper 11) with Custom Progress Track
     -------------------------------------------------------------------------- */
  if (typeof Swiper !== 'undefined') {
    const progressBar = document.getElementById('testimonials-progress-bar');

    const testSwiper = new Swiper('#testimonials-swiper', {
      slidesPerView: 1.05,
      spaceBetween: 16,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1.6,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 2.6,
          spaceBetween: 20,
        },
      },
      on: {
        progress: function (swiper, progress) {
          if (progressBar) {
            const clamped = Math.max(0, Math.min(1, progress));
            const widthPct = 25 + clamped * 75;
            progressBar.style.width = `${widthPct}%`;
          }
        },
      },
    });
  }

  /* --------------------------------------------------------------------------
     11. Routine CTA Marquee Intersection Pause
     -------------------------------------------------------------------------- */
  const marqueeSection = document.getElementById('marquee-section');
  const marqueeTrack = document.getElementById('marquee-track');

  if (marqueeSection && marqueeTrack) {
    const marqueeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          marqueeTrack.style.animationPlayState = 'paused';
        } else {
          marqueeTrack.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.05 });

    marqueeObserver.observe(marqueeSection);
  }

  /* --------------------------------------------------------------------------
     12. Before & After Carousel and Interactive Comparison Slider
     -------------------------------------------------------------------------- */
  if (typeof Swiper !== 'undefined') {
    const baSwiper = new Swiper('#ba-swiper', {
      slidesPerView: 1.05,
      spaceBetween: 24,
      grabCursor: false, // Don't grab the entire card because of the slider handle
      allowTouchMove: true,
      pagination: {
        el: '#ba-pagination',
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 1.6,
          spaceBetween: 24,
        },
      },
    });

    // Comparison Sliders Setup
    const comparisonCards = document.querySelectorAll('.comparison-card');

    comparisonCards.forEach((card) => {
      let isDragging = false;
      let animatedHint = false;

      function updateSlider(xPos) {
        const rect = card.getBoundingClientRect();
        const offsetX = Math.max(0, Math.min(xPos - rect.left, rect.width));
        const pct = (offsetX / rect.width) * 100;
        card.style.setProperty('--slider-pos', `${pct}%`);
        card.setAttribute('aria-valuenow', Math.round(pct));
      }

      // Mouse / pointer events
      card.addEventListener('pointerdown', (e) => {
        isDragging = true;
        card.setPointerCapture(e.pointerId);
        updateSlider(e.clientX);
        e.stopPropagation(); // Prevent Swiper drag
      });

      card.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
        e.stopPropagation();
      });

      const stopDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          try {
            card.releasePointerCapture(e.pointerId);
          } catch (_) {}
        }
      };

      card.addEventListener('pointerup', stopDrag);
      card.addEventListener('pointercancel', stopDrag);

      // Touch drag event with stopPropagation so Swiper doesn't swipe
      card.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
        e.stopPropagation();
      }, { passive: false });

      card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
        e.stopPropagation();
      }, { passive: false });

      card.addEventListener('touchend', () => {
        isDragging = false;
      });

      // Keyboard arrow navigation
      card.addEventListener('keydown', (e) => {
        const currentVal = parseInt(card.getAttribute('aria-valuenow') || '50', 10);
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const newVal = Math.max(0, currentVal - 5);
          card.style.setProperty('--slider-pos', `${newVal}%`);
          card.setAttribute('aria-valuenow', newVal);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const newVal = Math.min(100, currentVal + 5);
          card.style.setProperty('--slider-pos', `${newVal}%`);
          card.setAttribute('aria-valuenow', newVal);
        }
      });

      // Intro Hint Animation: 50% -> 35% -> 50% on first view
      const hintObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedHint && typeof gsap !== 'undefined' && !prefersReducedMotion) {
            animatedHint = true;
            const posObj = { pos: 50 };
            gsap.timeline()
              .to(posObj, {
                pos: 35,
                duration: 0.6,
                ease: 'power2.inOut',
                onUpdate: () => {
                  card.style.setProperty('--slider-pos', `${posObj.pos}%`);
                  card.setAttribute('aria-valuenow', Math.round(posObj.pos));
                },
              })
              .to(posObj, {
                pos: 50,
                duration: 0.7,
                ease: 'power2.out',
                onUpdate: () => {
                  card.style.setProperty('--slider-pos', `${posObj.pos}%`);
                  card.setAttribute('aria-valuenow', Math.round(posObj.pos));
                },
              });
          }
        });
      }, { threshold: 0.4 });

      hintObserver.observe(card);
    });
  }

  /* --------------------------------------------------------------------------
     13. Supabase Integration & Booking Form Client-Side Validation
     -------------------------------------------------------------------------- */
  const SUPABASE_URL = 'https://oujjldbyjzofzbjecxwx.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_9XHxEdnC9_ymIbXwIDE8NQ_39n4AUAU';
  let supabaseClient = null;

  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  const bookingForm = document.getElementById('booking-form');
  const toastNotice = document.getElementById('toast-notice');

  function showToast(message) {
    if (!toastNotice) return;
    if (message) {
      const textSpan = toastNotice.querySelector('span');
      if (textSpan) textSpan.textContent = message;
    }
    toastNotice.classList.add('is-visible');
    setTimeout(() => {
      toastNotice.classList.remove('is-visible');
    }, 4000);
  }

  if (bookingForm) {
    const nameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const serviceSelect = document.getElementById('service-select');
    const messageInput = document.getElementById('message');
    const groupName = document.getElementById('group-fullname');
    const groupEmail = document.getElementById('group-email');

    function validateEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        groupName.classList.remove('has-error');
      }
    });

    emailInput.addEventListener('input', () => {
      if (validateEmail(emailInput.value.trim())) {
        groupEmail.classList.remove('has-error');
      }
    });

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let hasError = false;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        groupName.classList.add('has-error');
        hasError = true;
      } else {
        groupName.classList.remove('has-error');
      }

      if (!validateEmail(emailInput.value.trim())) {
        groupEmail.classList.add('has-error');
        hasError = true;
      } else {
        groupEmail.classList.remove('has-error');
      }

      if (!hasError) {
        const submitBtn = document.getElementById('submit-booking-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.7';
        }

        // Save booking data to Supabase
        const bookingPayload = {
          full_name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput ? phoneInput.value.trim() : null,
          service: serviceSelect ? serviceSelect.value : 'Regular cleaning',
          message: messageInput ? messageInput.value.trim() : null,
        };

        if (supabaseClient) {
          try {
            const { error } = await supabaseClient
              .from('bookings')
              .insert([bookingPayload]);

            if (error) {
              console.warn('Supabase booking notice:', error.message);
            }
          } catch (err) {
            console.warn('Supabase error:', err);
          }
        }

        showToast('Thank you! Your cleaning service request was received.');
        bookingForm.reset();

        if (submitBtn) {
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
          }, 1200);
        }
      }
    });
  }
});
