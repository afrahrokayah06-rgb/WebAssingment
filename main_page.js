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

  /* ---------- Display logged-in user ---------- */
  const userAccountName = document.getElementById("userAccountName");
  const userAccountLink = document.getElementById("userAccountLink");

  const loggedInUser = sessionStorage.getItem("loggedInUser");

  if (loggedInUser) {

      try {

          const user = JSON.parse(loggedInUser);

          if (user.fullName && userAccountName) {
              userAccountName.textContent = user.fullName;
          }

          if (userAccountLink) {
              userAccountLink.href = "#account";
          }

      } catch (error) {

          console.error("Error reading logged-in user:", error);

      }
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


      // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    /* ---------- ADD TO CART ---------- */
    const cartButtons = document.querySelectorAll(".cart");

    cartButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // Get product information
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };

            // Check if product already exists
            const existingProduct = cart.find(function (item) {
                return item.id === product.id;
            });


            if (existingProduct) {
                // Increase quantity
                existingProduct.quantity++;

            } else {
                // Add new product
                cart.push(product);
            }

            // Save cart
            localStorage.setItem("cart", JSON.stringify(cart));

            // Update cart number
            updateCartCount();

            // Show toast
            showToast("Added to Cart");
        });
    });

  // Update Cart (number)
  function updateCartCount() {

      const totalItems = cart.reduce(function (total, item) {
          return total + item.quantity;
      }, 0);

      const cartLink = document.querySelector('a[href="cart.html"]');

      if (cartLink) {

          cartLink.innerHTML = `
              <img src="cart.png" alt="" class="nav-icon">
              Cart (${totalItems})
          `;
      }
  }

  // Run when page loads
  updateCartCount();

});