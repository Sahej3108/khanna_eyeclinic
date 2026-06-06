/* =========================================================
   KHANNA EYE CENTRE — MAIN JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- HAMBURGER MENU ---- */
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('open');
      if (nav) nav.classList.toggle('open');
    });
  }

  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!hamburger || !nav) return;
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  /* ---- STICKY HEADER ---- */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---- HERO SLIDER ---- */
  var slides = document.querySelectorAll('.slide');
  var dots   = document.querySelectorAll('.slider-dots .dot');
  var sliderPrev = document.getElementById('sliderPrev');
  var sliderNext = document.getElementById('sliderNext');
  var currentSlide = 0;
  var sliderTimer = null;

  function goToSlide(index) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].style.zIndex = 1;
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].style.zIndex = 3;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    sliderTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 5000);
  }

  function resetSlider() { clearInterval(sliderTimer); startSlider(); }

  if (sliderPrev) sliderPrev.addEventListener('click', function () { goToSlide(currentSlide - 1); resetSlider(); });
  if (sliderNext) sliderNext.addEventListener('click', function () { goToSlide(currentSlide + 1); resetSlider(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goToSlide(parseInt(this.dataset.index || 0));
      resetSlider();
    });
  });

  if (slides.length) startSlider();

  /* ---- REVIEWS SLIDER ---- */
  var reviewsTrack = document.getElementById('reviewsTrack');
  var reviewDotBtns = document.querySelectorAll('.reviews-controls .slider-dot-btn');
  var reviewGroups = document.querySelectorAll('#reviewsTrack .review-slide-group');
  var totalGroups = reviewGroups.length;
  var currentReview = 0;

  function goToReview(index) {
    if (!reviewsTrack || !totalGroups) return;
    if (index < 0) index = totalGroups - 1;
    if (index >= totalGroups) index = 0;
    currentReview = index;
    reviewsTrack.style.transform = 'translateX(-' + (index * (100 / totalGroups)) + '%)';
    reviewDotBtns.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });
  }

  reviewDotBtns.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goToReview(i); });
  });

  if (totalGroups) {
    setInterval(function () { goToReview(currentReview + 1); }, 5000);
  }

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = this.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = this.classList.contains('open');

      document.querySelectorAll('.faq-question.open').forEach(function (q) {
        q.classList.remove('open');
        var a = q.closest('.faq-item').querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });

      if (!isOpen && answer) {
        this.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ---- ANIMATED COUNTERS ---- */
  function formatCount(val, target) {
    if (target >= 100000) {
      var lakhs = val / 100000;
      return (Number.isInteger(lakhs) ? lakhs : parseFloat(lakhs.toFixed(1))) + ' Lakhs';
    }
    return val.toLocaleString('en-IN');
  }

  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    var target    = parseInt(el.getAttribute('data-target'), 10);
    var duration  = 2000;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased    = 1 - (1 - progress) * (1 - progress);
      el.textContent = formatCount(Math.round(eased * target), target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatCount(target, target);
      }
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    var cObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) animateCounter(entry.target);
      });
    }, { threshold: 0.2 });
    counters.forEach(function (el) { cObserver.observe(el); });
  }

  /* ---- APPOINTMENT FORM (contact section) ---- */
  /* ---- APPOINTMENT FORM VALIDATION ---- */
var apptForm = document.getElementById('appointmentForm');
if (apptForm) {
  apptForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = document.getElementById('cf-name');
    var phone   = document.getElementById('cf-phone');
    var treat   = document.getElementById('cf-treatment');
    var success = document.getElementById('cf-success');

    var isValid = true;

    /* Name */
    if (!name.value.trim()) {
      name.style.borderColor = '#e53935';
      isValid = false;
    } else {
      name.style.borderColor = '#2e7d32';
    }

    /* Phone — must be 10 digits */
    if (phone.value.trim().length !== 10) {
      document.getElementById('cf-phone-wrap').style.borderColor = '#e53935';
      isValid = false;
    } else {
      document.getElementById('cf-phone-wrap').style.borderColor = '#2e7d32';
    }

    /* Treatment */
    if (!treat.value) {
      treat.style.borderColor = '#e53935';
      isValid = false;
    } else {
      treat.style.borderColor = '#2e7d32';
    }

    if (!isValid) return;

    /* Success */
    var btn = this.querySelector('button[type="submit"]');
    btn.textContent = "Booked! We'll contact you soon.";
    btn.style.background = '#1b5e20';
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = 'Make an Appointment';
      btn.style.background = '';
      btn.disabled = false;
      apptForm.reset();
      name.style.borderColor = '';
      document.getElementById('cf-phone-wrap').style.borderColor = '';
      treat.style.borderColor = '';
    }, 3000);

  });

  /* Phone: only allow numbers */
  var phoneInput = document.getElementById('cf-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
  }
}
  /* ---- APPOINTMENT MODAL ---- */
setTimeout(function() {
  var modalOverlay = document.getElementById('modalOverlay');
  var modalClose   = document.getElementById('modalClose');
  var modalForm    = document.getElementById('modalForm');

  if (!modalOverlay) {
    console.error('Modal overlay not found!');
    return;
  }

  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  var modalBtns = document.querySelectorAll('.open-modal');
  console.log('Modal buttons found:', modalBtns.length);

  modalBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openModal();
    });
  });

  if (modalClose) {
  modalClose.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });
}
console.log('modalClose found:', modalClose);

  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  if (modalForm) {
    modalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      btn.textContent = "Booked! We'll contact you soon.";
      btn.style.background = '#1b5e20';
      btn.disabled = true;
      setTimeout(function() {
        btn.textContent = 'Make an Appointment';
        btn.style.background = '';
        btn.disabled = false;
        modalForm.reset();
        closeModal();
      }, 3000);
    });
  }
}, 100);

  /* ---- ACTIVE NAV LINK ---- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPage) link.classList.add('active');
  });

});
