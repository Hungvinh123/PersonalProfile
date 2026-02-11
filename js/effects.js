/* ============================================
   PREMIUM EFFECTS JS - Tool Store
   ============================================ */

(function () {
  'use strict';

  // ========================
  // 1. PARTICLE BACKGROUND
  // ========================
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Mouse interaction
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(108, 99, 255, ' + this.opacity + ')';
        ctx.fill();
      }
    }

    // Create particles
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(108, 99, 255, ' + (0.1 * (1 - dist / 150)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ========================
  // 2. CUSTOM CURSOR
  // ========================
  function initCursor() {
    if (window.innerWidth < 1025) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX - 4 + 'px';
      dot.style.top = mouseY - 4 + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX - 17.5 + 'px';
      ring.style.top = ringY - 17.5 + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    var hoverElements = document.querySelectorAll('a, button, .btn, input[type="submit"], .tool-card, .fw-package');
    hoverElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
    });
  }

  // ========================
  // 3. TYPING ANIMATION
  // ========================
  function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const texts = ['Web Designer', 'Frontend Developer', 'Software Engineer', 'Tool Developer'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const current = texts[textIndex];

      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === current.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500; // Pause before next word
      }

      setTimeout(type, typingSpeed);
    }
    type();
  }

  // ========================
  // 4. SCROLL REVEAL
  // ========================
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ========================
  // 5. QR MODAL
  // ========================
  function initQRModal() {
    var overlay = document.getElementById('qr-modal-overlay');
    if (!overlay) return;

    // Open modal
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.open-qr-modal');
      if (btn) {
        e.preventDefault();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close modal
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('.qr-modal-close')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Code Verification Logic
    const verifyBtn = document.getElementById('btn-verify-code');
    const codeInput = document.getElementById('tool-code-input');
    const downloadArea = document.getElementById('download-unlock-area');
    const CORRECT_CODE = 'VINHHOANGCHESS';

    if (verifyBtn && codeInput && downloadArea) {
      verifyBtn.addEventListener('click', function () {
        const enteredCode = codeInput.value.trim().toUpperCase();

        if (enteredCode === '') {
          Swal.fire({
            icon: 'warning',
            title: 'Opps!',
            text: 'Vui lòng nhập mã tải tool!',
            background: '#1a1a2e',
            color: '#fff',
            confirmButtonColor: '#6C63FF'
          });
          return;
        }

        if (enteredCode === CORRECT_CODE) {
          Swal.fire({
            icon: 'success',
            title: 'Xác minh thành công!',
            text: 'Bạn có thể tải tool ngay bây giờ.',
            background: '#1a1a2e',
            color: '#fff',
            confirmButtonColor: '#00D4AA'
          });

          downloadArea.style.display = 'block';
          verifyBtn.disabled = true;
          verifyBtn.style.opacity = '0.5';
          codeInput.disabled = true;

          // Confetti for success
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6C63FF', '#00D4AA', '#FECA57']
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Sai mã!',
            text: 'Mã không đúng hoặc đã hết hạn. Vui lòng liên hệ Admin!',
            background: '#1a1a2e',
            color: '#fff',
            confirmButtonColor: '#FF6B6B'
          });
          codeInput.value = '';
        }
      });

      // Enter key support
      codeInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          verifyBtn.click();
        }
      });
    }
  }

  // ========================
  // 6. COUNTER ANIMATION
  // ========================
  function initCounters() {
    var counters = document.querySelectorAll('.counter-value');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.target) || 0;
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  // ========================
  // 7. TILT EFFECT ON CARDS
  // ========================
  function initTilt() {
    if (window.innerWidth < 1025) return;

    var cards = document.querySelectorAll('.tool-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / 20;
        var rotateY = (centerX - x) / 20;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ========================
  // INIT ALL
  // ========================
  window.addEventListener('load', function () {
    // Small delay to let page render
    setTimeout(function () {
      initParticles();
      initCursor();
      initTyping();
      initScrollReveal();
      initQRModal();
      initCounters();
      initTilt();
    }, 500);
  });

})();
