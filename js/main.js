/**
 * Swaranthara School of Music - Interactive JavaScript Engine
 * Features: Web Audio Piano Synth, Video Modal, Gallery Lightbox,
 * WhatsApp Link Generator, Counter Animation, FAQ Accordion, Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPianoSynth();
  initVideoModal();
  initGalleryLightbox();
  initCounters();
  initFAQ();
  initContactForm();
  initTrialModal();
  initGlobalSparkles();
});

/* ==========================================================================
   1. Navbar & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  function toggleMenu() {
    hamburgerBtn?.classList.toggle('active');
    mobileNav?.classList.toggle('open');
    mobileBackdrop?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  }

  hamburgerBtn?.addEventListener('click', toggleMenu);
  mobileBackdrop?.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav?.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 100;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink?.classList.add('active');
      } else {
        navLink?.classList.remove('active');
      }
    });
  });
}

/* ==========================================================================
   2. Web Audio API Piano & Synthesizer Engine
   ========================================================================== */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const NOTE_FREQUENCIES = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
  'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
  'E5': 659.25
};

const KEYBOARD_MAP = {
  'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
  'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
  'u': 'A#4', 'j': 'B4', 'k': 'C5', 'o': 'C#5', 'l': 'D5',
  'p': 'D#5', ';': 'E5'
};

function playNote(noteName, instrument = 'piano') {
  const ctx = getAudioContext();
  const freq = NOTE_FREQUENCIES[noteName];
  if (!freq) return;

  const now = ctx.currentTime;

  if (instrument === 'piano') {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + 1.7);
    osc2.stop(now + 1.7);
    osc3.stop(now + 1.7);
  } else if (instrument === 'strings') {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.1);
  } else {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(0.7, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.9);
  }

  const keyEl = document.querySelector(`.piano-key[data-note="${noteName}"]`);
  if (keyEl) {
    keyEl.classList.add('active');
    spawnNoteSparkles(keyEl, noteName);
    setTimeout(() => keyEl.classList.remove('active'), 180);
  }
}

/**
 * Spawns radiant glowing sparky musical notes & particles floating up from the pressed key
 */
function spawnNoteSparkles(keyEl, noteName) {
  if (!keyEl) return;
  const synthCard = keyEl.closest('.hero-synth-card') || keyEl.closest('.piano-wrapper');
  if (!synthCard) return;

  const keyRect = keyEl.getBoundingClientRect();
  const cardRect = synthCard.getBoundingClientRect();

  const startX = keyRect.left - cardRect.left + (keyRect.width / 2);
  const startY = keyRect.top - cardRect.top + 10;

  const noteSymbols = ['♪', '♫', '♬', '𝄞', '✦', '✨', '★', '♩'];
  const colors = ['#ff6b18', '#ff944d', '#ffa94d', '#60a5fa', '#38bdf8', '#ffd166', '#ffffff'];

  // Spawn 3 to 5 sparkling notes and light beams
  const count = 4;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'piano-spark-particle';
    const sym = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    spark.textContent = sym;
    spark.style.color = color;
    spark.style.left = `${startX}px`;
    spark.style.top = `${startY}px`;

    const distanceX = (Math.random() - 0.5) * 90;
    const distanceY = 60 + Math.random() * 90;
    const rot = (Math.random() - 0.5) * 90;
    const duration = 0.75 + Math.random() * 0.45;
    const scale = 0.9 + Math.random() * 0.7;

    spark.style.setProperty('--dx', `${distanceX}px`);
    spark.style.setProperty('--dy', `-${distanceY}px`);
    spark.style.setProperty('--rot', `${rot}deg`);
    spark.style.setProperty('--scale', `${scale}`);
    spark.style.animation = `sparkFloat ${duration}s cubic-bezier(0.16, 0.84, 0.44, 1) forwards`;

    synthCard.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, duration * 1000);
  }

  // Pulse the stave line with glowing energy
  const staveLine = document.querySelector('.keyboard-sparky-stave');
  if (staveLine) {
    staveLine.classList.add('pulse-glow');
    setTimeout(() => staveLine.classList.remove('pulse-glow'), 350);
  }
}

function initPianoSynth() {
  const pianoKeys = document.querySelectorAll('.piano-key');
  const instrumentSelect = document.getElementById('instrument-select');
  const demoTuneBtn = document.getElementById('play-demo-tune-btn');

  pianoKeys.forEach(key => {
    key.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const note = key.getAttribute('data-note');
      const inst = instrumentSelect ? instrumentSelect.value : 'piano';
      playNote(note, inst);
    });

    key.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const note = key.getAttribute('data-note');
      const inst = instrumentSelect ? instrumentSelect.value : 'piano';
      playNote(note, inst);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    const key = e.key.toLowerCase();
    if (KEYBOARD_MAP[key]) {
      const note = KEYBOARD_MAP[key];
      const inst = instrumentSelect ? instrumentSelect.value : 'piano';
      playNote(note, inst);
    }
  });

  demoTuneBtn?.addEventListener('click', () => {
    const melody = [
      { note: 'C4', dur: 250 }, { note: 'D4', dur: 250 }, { note: 'E4', dur: 250 },
      { note: 'F4', dur: 250 }, { note: 'G4', dur: 350 }, { note: 'E4', dur: 250 },
      { note: 'C4', dur: 350 }, { note: 'G4', dur: 350 }, { note: 'A4', dur: 250 },
      { note: 'B4', dur: 250 }, { note: 'C5', dur: 500 }
    ];

    let delay = 0;
    const inst = instrumentSelect ? instrumentSelect.value : 'piano';
    demoTuneBtn.disabled = true;
    demoTuneBtn.innerHTML = '<i class="fas fa-volume-up fa-spin"></i> Playing...';

    melody.forEach((item, index) => {
      setTimeout(() => {
        playNote(item.note, inst);
        if (index === melody.length - 1) {
          setTimeout(() => {
            demoTuneBtn.disabled = false;
            demoTuneBtn.innerHTML = '<i class="fas fa-play"></i> Play Melody';
          }, 600);
        }
      }, delay);
      delay += item.dur + 80;
    });
  });
}

/* ==========================================================================
   3. Video Modal System
   ========================================================================== */
function initVideoModal() {
  const modalBackdrop = document.getElementById('video-modal');
  const iframe = document.getElementById('video-modal-iframe');
  const closeBtn = document.getElementById('video-modal-close');
  const videoCards = document.querySelectorAll('[data-youtube-id]');

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.getAttribute('data-youtube-id');
      if (videoId && iframe) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        modalBackdrop?.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeVideo() {
    modalBackdrop?.classList.remove('open');
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeVideo);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeVideo();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) {
      closeVideo();
    }
  });
}

/* ==========================================================================
   4. Interactive Gallery Lightbox & Category Filtering
   ========================================================================== */
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || img?.alt || 'Swaranthara School of Music';
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightboxModal?.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightboxModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   5. Live Animated Number Counters
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target + (counter.getAttribute('data-suffix') || '');
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Contact Form & WhatsApp Message Generator
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-inquiry-form');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const course = form.querySelector('[name="course"]')?.value || 'General Music Course';
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !phone) {
      showToast('Please enter your Name and Contact Phone Number');
      return;
    }

    const formattedMsg = `*New Student Inquiry - Swaranthara Music School*%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Email:* ${encodeURIComponent(email || 'Not provided')}%0A` +
      `*Interested Course:* ${encodeURIComponent(course)}%0A` +
      `*Message:* ${encodeURIComponent(message || 'I would like to know batch timings and fee structure.')}`;

    const whatsappUrl = `https://wa.me/918105575750?text=${formattedMsg}`;

    showToast('Redirecting to WhatsApp with your inquiry...');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      form.reset();
    }, 800);
  });
}

/* ==========================================================================
   8. Free Trial Booking Modal
   ========================================================================== */
function initTrialModal() {
  const trialModal = document.getElementById('trial-modal');
  const trialTriggers = document.querySelectorAll('[data-open-trial-modal]');
  const closeBtn = document.getElementById('trial-modal-close');
  const trialForm = document.getElementById('trial-booking-form');

  trialTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const course = btn.getAttribute('data-course-preset');
      if (course && trialForm) {
        const courseSelect = trialForm.querySelector('[name="trial_course"]');
        if (courseSelect) courseSelect.value = course;
      }
      trialModal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeTrial() {
    trialModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeTrial);
  trialModal?.addEventListener('click', (e) => {
    if (e.target === trialModal) closeTrial();
  });

  trialForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = trialForm.querySelector('[name="trial_name"]')?.value.trim();
    const phone = trialForm.querySelector('[name="trial_phone"]')?.value.trim();
    const course = trialForm.querySelector('[name="trial_course"]')?.value;
    const mode = trialForm.querySelector('[name="trial_mode"]')?.value;

    if (!name || !phone) {
      showToast('Please provide your name and phone number');
      return;
    }

    const msg = `*Free Trial Class Booking Request - Swaranthara*%0A` +
      `*Student Name:* ${encodeURIComponent(name)}%0A` +
      `*Contact:* ${encodeURIComponent(phone)}%0A` +
      `*Course:* ${encodeURIComponent(course)}%0A` +
      `*Preferred Mode:* ${encodeURIComponent(mode)}`;

    showToast('Scheduling your free trial slot...');
    setTimeout(() => {
      window.open(`https://wa.me/918105575750?text=${msg}`, '_blank');
      closeTrial();
      trialForm.reset();
    }, 600);
  });
}

/* ==========================================================================
   9. Toast Notification System
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-info-circle" style="color:var(--primary-gold)"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   10. Global Sparky Music Notes Interaction Generator
   ========================================================================== */
function initGlobalSparkles() {
  const interactiveElements = document.querySelectorAll('.btn, .glass-card, .nav-link, .video-card, .stat-box, .faq-question');
  const noteSymbols = ['♪', '♫', '♬', '𝄞', '✦', '✨', '★', '♩'];
  const colors = ['#ff6b18', '#ff944d', '#ffa94d', '#60a5fa', '#38bdf8', '#ffd166', '#ffffff'];

  interactiveElements.forEach(el => {
    el.addEventListener('click', (e) => {
      // Don't duplicate for piano keys which already have dedicated key sparks
      if (el.classList.contains('piano-key')) return;

      const clickX = e.clientX;
      const clickY = e.clientY;

      // Spawn 3 sparkling notes
      for (let i = 0; i < 3; i++) {
        const spark = document.createElement('div');
        spark.className = 'global-click-sparkle';
        const sym = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.textContent = sym;
        spark.style.color = color;
        spark.style.left = `${clickX}px`;
        spark.style.top = `${clickY}px`;

        const distanceX = (Math.random() - 0.5) * 80;
        const distanceY = 40 + Math.random() * 60;
        const rot = (Math.random() - 0.5) * 60;
        const duration = 0.65 + Math.random() * 0.35;
        const scale = 0.8 + Math.random() * 0.6;

        spark.style.setProperty('--dx', `${distanceX}px`);
        spark.style.setProperty('--dy', `-${distanceY}px`);
        spark.style.setProperty('--rot', `${rot}deg`);
        spark.style.setProperty('--scale', `${scale}`);
        spark.style.animation = `sparkFloat ${duration}s cubic-bezier(0.16, 0.84, 0.44, 1) forwards`;

        document.body.appendChild(spark);

        setTimeout(() => {
          spark.remove();
        }, duration * 1000);
      }
    });
  });
}
