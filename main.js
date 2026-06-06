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
  slides[currentSlide].style.zIndex = 1;           /* ← reset old */
  if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].style.zIndex = 3;           /* ← bring new above others */
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
  /* Works with: #reviewsTrack + .slider-dot-btn (your actual HTML) */
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

      /* close all */
      document.querySelectorAll('.faq-question.open').forEach(function (q) {
        q.classList.remove('open');
        var a = q.closest('.faq-item').querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });

      /* open this one if it was closed */
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

  /* ---- APPOINTMENT FORM ---- */
  var apptForm = document.getElementById('appointmentForm');
  if (apptForm) {
    apptForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      btn.textContent = "Appointment Booked! We'll contact you soon.";
      btn.style.background = '#1b5e20';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Make an Appointment';
        btn.style.background = '';
        btn.disabled = false;
        apptForm.reset();
      }, 4000);
    });
  }

  /* ---- ACTIVE NAV LINK ---- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPage) link.classList.add('active');
  });

});