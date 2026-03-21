/* ============================================================
   GAVIN HAMMOND PIANO LESSONS — script.js
   Vanilla JS: scroll-reveal, nav, FAQ accordion, smooth scroll,
   mobile menu, form validation, footer year.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  /* ---- Sticky nav ---- */
  const nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init

  /* ---- Mobile menu ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  function openMobileMenu() {
    navLinks.classList.add('nav__links--open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    navLinks.classList.remove('nav__links--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ---- Scroll Reveal (Intersection Observer) ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---- FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(function (other) {
        const otherBtn    = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn && otherAnswer && other !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.hidden = true;
        }
      });

      // Toggle this item
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  /* ---- Contact Form ---- */
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form && feedback) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const nameField    = form.querySelector('#name');
      const emailField   = form.querySelector('#email');
      const messageField = form.querySelector('#message');
      let valid = true;

      [nameField, emailField, messageField].forEach(function (field) {
        field.classList.remove('form-input--error');
        if (!field.value.trim()) {
          field.classList.add('form-input--error');
          valid = false;
        }
      });

      if (emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        emailField.classList.add('form-input--error');
        valid = false;
      }

      if (!valid) {
        feedback.hidden = false;
        feedback.className = 'form-feedback form-feedback--error';
        feedback.textContent = 'Please fill in all required fields with a valid email.';
        return;
      }

      // Send via EmailJS
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      emailjs.sendForm('service_jdvioa3', 'template_rgbtbud', form)
        .then(function () {
          feedback.hidden = false;
          feedback.className = 'form-feedback form-feedback--success';
          feedback.textContent = 'Thanks! Gavin will be in touch within 24 hours. You can also call or text (505) 267-0558.';
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, function (error) {
          feedback.hidden = false;
          feedback.className = 'form-feedback form-feedback--error';
          feedback.textContent = 'Something went wrong — please call or text (505) 267-0558 directly.';
          console.error('EmailJS error:', error);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    });

    // Clear error on input
    form.querySelectorAll('.form-input').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('form-input--error');
      });
    });
  }

})();
