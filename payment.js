document.addEventListener("DOMContentLoaded", function () {



    /* =====================================================
       GET CART
       ===================================================== */

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    const paymentItems =
        document.getElementById("payment-items");

    const paymentTotal =
        document.getElementById("payment-total");

    const payTotal =
        document.getElementById("pay-total");


    /* =====================================================
       CHECK IF CART IS EMPTY
       ===================================================== */

    if (cart.length === 0) {

        paymentItems.innerHTML = `
            <p>Your cart is empty.</p>

            <a href="index.html">
                Continue Shopping
            </a>
        `;

        return;
    }


    /* =====================================================
       DISPLAY ORDER
       ===================================================== */

    let total = 0;


    cart.forEach(function (product) {

        const subtotal =
            product.price * product.quantity;

        total += subtotal;


        const item = document.createElement("div");

        item.className = "payment-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="payment-item-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    RM ${product.price.toFixed(2)}
                    × ${product.quantity}
                </p>

            </div>

            <strong>
                RM ${subtotal.toFixed(2)}
            </strong>

        `;


        paymentItems.appendChild(item);

    });


    paymentTotal.textContent =
        total.toFixed(2);

    payTotal.textContent =
        total.toFixed(2);


    /* =====================================================
       INPUT ELEMENTS
       ===================================================== */

    const paymentForm =
        document.getElementById("payment-form");

    const cardName =
        document.getElementById("card-name");

    const cardNumber =
        document.getElementById("card-number");

    const expiry =
        document.getElementById("expiry");

    const cvv =
        document.getElementById("cvv");

    const email =
        document.getElementById("email");


    /* =====================================================
       CARD NUMBER FORMATTING
       ===================================================== */

    cardNumber.addEventListener("input", function () {

        // Remove anything that isn't a number
        let value =
            cardNumber.value.replace(/\D/g, "");

        // Limit to 16 digits
        value =
            value.substring(0, 16);

        // Add spaces every 4 digits
        value =
            value.replace(/(.{4})/g, "$1 ").trim();

        cardNumber.value = value;

    });


    /* =====================================================
       EXPIRY FORMATTING
       ===================================================== */

    expiry.addEventListener("input", function () {

        let value =
            expiry.value.replace(/\D/g, "");

        value =
            value.substring(0, 4);

        if (value.length >= 3) {

            value =
                value.substring(0, 2)
                + "/"
                + value.substring(2);

        }

        expiry.value = value;

    });


    /* =====================================================
       CVV - NUMBERS ONLY
       ===================================================== */

    cvv.addEventListener("input", function () {

        cvv.value =
            cvv.value.replace(/\D/g, "")
                     .substring(0, 3);

    });


    /* =====================================================
       CARD NUMBER - LUHN VALIDATION
       ===================================================== */

    function isValidCardNumber(number) {

        // Remove spaces
        const digits = number.replace(/\s/g, "");

        // Check that it contains exactly 16 digits
        return /^\d{16}$/.test(digits);
    }


    /* =====================================================
       EXPIRY VALIDATION
       ===================================================== */

    function isValidExpiry(value) {

        if (!/^\d{2}\/\d{2}$/.test(value)) {

            return false;

        }


        const parts =
            value.split("/");

        const month =
            parseInt(parts[0]);

        const year =
            parseInt(parts[1]);


        // Month must be 01-12
        if (month < 1 || month > 12) {

            return false;

        }


        // Convert YY to 20YY
        const fullYear =
            2000 + year;


        const now =
            new Date();


        const currentMonth =
            now.getMonth() + 1;

        const currentYear =
            now.getFullYear();


        // Card must not be expired
        if (
            fullYear < currentYear ||
            (
                fullYear === currentYear &&
                month < currentMonth
            )
        ) {

            return false;

        }


        return true;

    }


    /* =====================================================
       EMAIL VALIDATION
       ===================================================== */

    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    }


    /* =====================================================
       FORM SUBMISSION
       ===================================================== */

    paymentForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // Clear previous errors
        document.querySelectorAll(".error")
            .forEach(function (error) {

                error.textContent = "";

            });


        const paymentMessage =
            document.getElementById("payment-message");

        paymentMessage.textContent = "";

        paymentMessage.className = "";


        let valid = true;


        /* ---------- Name ---------- */

        if (cardName.value.trim() === "") {

            document.getElementById(
                "card-name-error"
            ).textContent =
                "Please enter the cardholder name.";

            valid = false;

        }


        /* ---------- Card Number ---------- */

        if (!isValidCardNumber(cardNumber.value)) {

            document.getElementById(
                "card-number-error"
            ).textContent =
                "Please enter a valid 16-digit card number.";

            valid = false;

        }


        /* ---------- Expiry ---------- */

        if (!isValidExpiry(expiry.value)) {

            document.getElementById(
                "expiry-error"
            ).textContent =
                "Please enter a valid expiry date.";

            valid = false;

        }


        /* ---------- CVV ---------- */

        if (!/^\d{3}$/.test(cvv.value)) {

            document.getElementById(
                "cvv-error"
            ).textContent =
                "CVV must contain 3 digits.";

            valid = false;

        }


        /* ---------- Email ---------- */

        if (!isValidEmail(email.value.trim())) {

            document.getElementById(
                "email-error"
            ).textContent =
                "Please enter a valid email address.";

            valid = false;

        }


        /* =================================================
           STOP IF INVALID
           ================================================= */

        if (!valid) {

            paymentMessage.textContent =
                "Please correct the errors above.";

            paymentMessage.className =
                "error-message";

            return;

        }


        /* =================================================
           DEMO PAYMENT SUCCESS
           ================================================= */

        paymentMessage.textContent =
            "Payment successful!";

        paymentMessage.className =
            "success";


        /*
         * DO NOT STORE CARD NUMBER OR CVV.
         *
         * Clear the cart after successful payment.
         */

        localStorage.removeItem("cart");


        /*
         * Redirect to confirmation page
         * after a short delay.
         */

        setTimeout(function () {

            window.location.href =
                "order-success.html";

        }, 1500);

    });

});