document.addEventListener("DOMContentLoaded", function () {
    let toastTimer;

    function showToast(message) {
        const toast = document.getElementById('cart-toast');

        toast.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }
    
    // Get cart elements
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Check that required HTML elements exist
    if (!cartItems || !cartTotal) {
        console.error("Cart elements not found.");
        return;
    }

    // Get cart from localStorage
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
        console.error("Invalid cart data in localStorage:", error);
        localStorage.removeItem("cart");
        cart = [];
    }

    /* ---------- DISPLAY CART ---------- */

    function displayCart() {
        cartItems.innerHTML = "";

        // Empty cart
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <p class="message">Your cart is empty!</p>
                    <p>You haven't added any products yet.</p>
                    <a href="makeup-remover.html">
                        CONTINUE SHOPPING
                    </a>
                </div>
            `;

            cartTotal.textContent = "0.00";
            return;
        }

        let total = 0;

        cart.forEach(function (product, index) {
            // Make sure quantity and price are numbers
            const price = Number(product.price) || 0;
            const quantity = Number(product.quantity) || 1;

            const subtotal = price * quantity;
            total += subtotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="cart-product-image"
                >

                <div class="cart-product-info">
                    <h2>${product.name}</h2>
                    <p>
                        Price: RM ${price.toFixed(2)}
                    </p>

                    <div class="quantity">
                        <button
                            type="button"
                            onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            type="button"
                            onclick="increaseQuantity(${index})">
                            +
                        </button>
                    </div>

                    <p>
                        Subtotal:
                        <strong>
                            RM ${subtotal.toFixed(2)}
                        </strong>
                    </p>

                    <button
                        type="button"
                        class="remove-button"
                        onclick="removeProduct(${index})"
                        aria-label="Remove ${product.name}"
                    >
                        <img src="trash.png" alt="Trash">
                    </button>

                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        cartTotal.textContent = total.toFixed(2);
    }


    /* ---------- INCREASE QUANTITY ---------- */

    window.increaseQuantity = function (index) {

        if (!cart[index]) return;

        cart[index].quantity = Number(cart[index].quantity) || 1;
        cart[index].quantity++;

        saveCart();
    };


    /* ---------- DECREASE QUANTITY ---------- */

    window.decreaseQuantity = function (index) {
        if (!cart[index]) return;

        cart[index].quantity = Number(cart[index].quantity) || 1;

        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
    };


    /* ---------- REMOVE PRODUCT ---------- */
    window.removeProduct = function (index) {
        if (!cart[index]) return;
        cart.splice(index, 1);
        saveCart();
    };


    /* ---------- SAVE CART ---------- */
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }


    /* ---------- CHECKOUT ---------- */
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            const loggedInUser =
                sessionStorage.getItem("loggedInUser");

            // Check login
            if (!loggedInUser) {
                alert("Please log in before checkout.");
                window.location.href = "login.html";
                return;
            }

            // Check cart
            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            // Go to payment
            window.location.href = "payment.html";
        });
    }

    displayCart();
});