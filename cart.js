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
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    /* ---------- CART DISPLAY ---------- */
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");


    function displayCart() {
        cartItems.innerHTML = "";

        // If cart is empty
        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <h2>Your cart is empty</h2>
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
            const subtotal = product.price * product.quantity;
            total += subtotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${product.image}"
                     alt="${product.name}"
                     class="cart-product-image">
                <div class="cart-product-info">
                    <h2>${product.name}</h2>
                    <p>
                        Price: RM ${product.price.toFixed(2)}
                    </p>

                    <div class="quantity">
                        <button onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span>
                            ${product.quantity}
                        </span>

                        <button onclick="increaseQuantity(${index})">
                            +
                        </button>
                    </div>

                    <p>
                        Subtotal:
                        <strong>
                            RM ${subtotal.toFixed(2)}
                        </strong>
                    </p>

                    <button onclick="removeProduct(${index})">
                        REMOVE
                    </button>
                </div>
            `;

            cartItems.appendChild(cartItem);
        });

        // Display total
        cartTotal.textContent = total.toFixed(2);

    }


    // Increase quantity
    window.increaseQuantity = function (index) {
        cart[index].quantity++;
        saveCart();
    };


    // Decrease quantity
    window.decreaseQuantity = function (index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }

        saveCart();
    };


    // Remove product
    window.removeProduct = function (index) {
        cart.splice(index, 1);
        saveCart();
    };


    // Save cart
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }


    // Display cart
    displayCart();
});