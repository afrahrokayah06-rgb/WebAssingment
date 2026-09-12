document.addEventListener('DOMContentLoaded', function () {
 
  /* ---------- Mobile category menu toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.category-nav ul');
 
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.textContent = isOpen ? 'Close menu ✕' : 'Menu ☰';
    });
  }
 
  /* ---------- Product carousel (prev / next) ---------- */
  var carousel = document.querySelector('.carousel');
  var prevBtn = document.querySelector('.carousel-btn.prev');
  var nextBtn = document.querySelector('.carousel-btn.next');
 
  if (carousel && prevBtn && nextBtn) {
    var scrollStep = function () {
      var card = carousel.querySelector('.product-card');
      var cardWidth = card ? card.getBoundingClientRect().width : 220;
      return cardWidth + 20; // card width + gap
    };
 
    nextBtn.addEventListener('click', function () {
      carousel.scrollBy({ left: scrollStep(), behavior: 'smooth' });
    });
 
    prevBtn.addEventListener('click', function () {
      carousel.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
    });
  }
 
  /* ---------- Header search form ---------- */
  var searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var term = searchForm.querySelector('input[name="q"]').value.trim();
      if (term.length === 0) { return; }
      window.location.href = 'search-results.html?q=' + encodeURIComponent(term);
    });
  }
 
});
 
