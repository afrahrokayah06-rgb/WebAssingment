document.addEventListener("DOMContentLoaded", function () {

    const MAX_QTY = 10;
    let toastTimer;

    /* ---------- TOAST ---------- */

    function showToast(message) {
        const toast = document.getElementById("cart-toast");

        if (!toast) {
            console.log(message);
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }


    /* ---------- GET CART ELEMENTS ---------- */

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (!cartItems || !cartTotal) {
        console.error("Cart elements not found.");
        return;
    }


    /* ---------- LOAD CART ---------- */
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch (error) {

        console.error(
            "Invalid cart data in localStorage:",
            error
        );

        localStorage.removeItem("cart");
        cart = [];
    }


    /* ---------- DISPLAY CART ---------- */
    function displayCart() {

        cartItems.innerHTML = "";

        /* Empty cart */

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

            const price = Number(product.price) || 0;

            let quantity =
                Number(product.quantity) || 1;


            /* Never allow more than 10 */

            quantity = Math.min(quantity, MAX_QTY);

            product.quantity = quantity;


            const subtotal =
                price * quantity;

            total += subtotal;


            const cartItem =
                document.createElement("div");

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
                            onclick="decreaseQuantity(${index})"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            type="button"
                            onclick="increaseQuantity(${index})"
                            aria-label="Increase quantity"
                            ${quantity >= MAX_QTY ? "disabled" : ""}
                        >
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
                        <img
                            src="trash.png"
                            alt="Trash"
                        >
                    </button>

                </div>
            `;


            cartItems.appendChild(cartItem);
        });


        cartTotal.textContent =
            total.toFixed(2);


        /* Save corrected quantities if necessary */

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );
    }


    /* ---------- INCREASE QUANTITY ---------- */

    window.increaseQuantity = function (index) {

        if (!cart[index]) {
            return;
        }


        let quantity =
            Number(cart[index].quantity) || 1;


        if (quantity >= MAX_QTY) {

            showToast(
                "Maximum " +
                MAX_QTY +
                " per product"
            );

            return;
        }


        quantity++;

        cart[index].quantity = quantity;

        saveCart();
    };


    /* ---------- DECREASE QUANTITY ---------- */

    window.decreaseQuantity = function (index) {

        if (!cart[index]) {
            return;
        }


        let quantity =
            Number(cart[index].quantity) || 1;


        if (quantity > 1) {

            quantity--;

            cart[index].quantity = quantity;

        } else {

            cart.splice(index, 1);
        }


        saveCart();
    };


    /* ---------- REMOVE PRODUCT ---------- */

    window.removeProduct = function (index) {

        if (!cart[index]) {
            return;
        }


        cart.splice(index, 1);

        saveCart();
    };


    /* ---------- SAVE CART ---------- */

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        displayCart();
    }


    /* ---------- CHECKOUT ---------- */

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            function () {

                const loggedInUser =
                    sessionStorage.getItem(
                        "loggedInUser"
                    );


                /* Check login */

                if (!loggedInUser) {

                    alert(
                        "Please log in before checkout."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                /* Check cart */

                if (cart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;
                }


                /* Go to payment */

                window.location.href =
                    "payment.html";
            }
        );
    }


    /* ---------- INITIAL DISPLAY ---------- */

    displayCart();

});