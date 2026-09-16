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
  const accountMenu = document.getElementById("accountMenu");
  
  let loggedInUser = null;

    try {
    const storedUser = sessionStorage.getItem("loggedInUser");

    if (storedUser) {
        loggedInUser = JSON.parse(storedUser);
    }

    } catch (error) {

    console.error("Unable to read logged-in user:", error);
    sessionStorage.removeItem("loggedInUser");
    }


    if (loggedInUser) {

    if (loggedInUser.fullName && userAccountName) {
        userAccountName.textContent = loggedInUser.fullName;
    }

    if (userAccountLink) {
        userAccountLink.href = "#account";
    }
    }


/* ---------- Dropdown ---------- */
    if (userAccountLink && accountMenu) {

    userAccountLink.addEventListener("click", function (event) {

        if (!loggedInUser) {
            return;
        }

        event.preventDefault();

        const isOpen = accountMenu.classList.toggle("open");

        accountMenu.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );
    });


    /* Close dropdown when clicking elsewhere */
    document.addEventListener("click", function (event) {
        const accountDropdown =
            document.querySelector(".account-dropdown");

        if (
            accountDropdown &&
            !accountDropdown.contains(event.target)
        ) {
            accountMenu.classList.remove("open");
            accountMenu.setAttribute("aria-hidden", "true");
        }
    });
    }


/* ---------- Logout ---------- */
    const logoutButton =
    document.getElementById("logout-button");

    if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {

        event.preventDefault();

        sessionStorage.removeItem("loggedInUser");

        window.location.href = "main_page.html";
    });
    }


/* ---------- Delete Account ---------- */
    const deleteAccountButton =
        document.getElementById("delete-account-button");

    if (deleteAccountButton) {
        deleteAccountButton.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const confirmed = window.confirm(
                "Are you sure you want to delete your account?"
            );

            if (!confirmed) {
                return;
            }

            /* Get currently logged-in user */
            let loggedInUser = null;

            try {

                const storedUser =
                    sessionStorage.getItem("loggedInUser");

                if (storedUser) {
                    loggedInUser = JSON.parse(storedUser);
                }

            } catch (error) {

                console.error(
                    "Unable to read logged-in user:",
                    error
                );

            }


            /* Make sure a user is logged in */
            if (!loggedInUser || !loggedInUser.email) {

                alert("No logged-in account was found.");

                return;
            }


            /* Get registered users */
            let users = [];

            try {

                users =
                    JSON.parse(
                        localStorage.getItem("makeupUsers")
                    ) || [];

            } catch (error) {

                console.error(
                    "Unable to read users:",
                    error
                );

            }


            /* Remove the logged-in user's account */
            users = users.filter(function (user) {

                return user.email !== loggedInUser.email;

            });


            /* Save updated users */
            localStorage.setItem(
                "makeupUsers",
                JSON.stringify(users)
            );


            /* Remove login session */
            sessionStorage.removeItem("loggedInUser");


            /* Remove remembered email if it belongs to this account */
            const rememberedEmail =
                localStorage.getItem("rememberedEmail");

            if (rememberedEmail === loggedInUser.email) {

                localStorage.removeItem("rememberedEmail");

            }


            /* Close account dropdown */
            if (accountMenu) {

                accountMenu.classList.remove("open");

                accountMenu.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            alert("Your account has been deleted successfully.");


            /* Return to main page */
            window.location.href = "main_page.html";

        });

    }
    /* ---------- Hero Video Sound Toggle ---------- */
const heroVideo = document.getElementById('hero-video');
const soundToggle = document.getElementById('hero-sound-toggle');

if (heroVideo && soundToggle) {
  soundToggle.addEventListener('click', function () {
    heroVideo.muted = !heroVideo.muted;
    soundToggle.textContent = heroVideo.muted ? '🔇' : '🔊';
    soundToggle.setAttribute('aria-label', heroVideo.muted ? 'Unmute video' : 'Mute video');
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
  var CATEGORY_ROUTES = [
    { keywords: ['lipstick', 'lip', 'lips', 'lip gloss', 'lip stain'], page: 'makeup-lips.html' },
    { keywords: ['mascara', 'eyeliner', 'eye liner', 'eyeshadow', 'eye shadow', 'eyes'], page: 'makeup-eyes.html' },
    { keywords: ['foundation', 'concealer', 'blush', 'bronzer', 'face'], page: 'makeup-face.html' },
    { keywords: ['nail polish', 'nail', 'nails', 'press-on', 'press on'], page: 'makeup-nails.html' },
    { keywords: ['makeup remover', 'remover', 'wipes', 'micellar'], page: 'makeup-remover.html' }
  ];

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var term = searchForm.querySelector('input[name="q"]').value.trim().toLowerCase();
    if (term.length === 0) { return; }

    var match = CATEGORY_ROUTES.find(function (route) {
      return route.keywords.some(function (kw) {
        return term.includes(kw) || kw.includes(term);
      });
    });

    if (match) {
      window.location.href = match.page;
    } else {
      alert('No matches found for "' + term + '". Try Lipstick, Mascara, Foundation, Nail Polish, or Makeup Remover.');
    }
  });
}

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