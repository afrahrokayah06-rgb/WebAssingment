document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Check if user is logged in ---------- */
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        alert("Please log in before making a payment.");
        window.location.href = "login.html";
        return;
    }


/* ---------- Get whatever is in the cart ---------- */
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const paymentItems =
        document.getElementById("payment-items");
    const paymentTotal =
        document.getElementById("payment-total");
    const payTotal =
        document.getElementById("pay-total");


/* ---------- Check if cart is empty ---------- */
    if (cart.length === 0) {
        alert("Your cart is empty!");
        window.location.href = "main_page.html";
    }


/* ---------- Display Cart ---------- */
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


/* ---------- Input Elements ---------- */

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

/* ---------- Card Number Formatting ---------- */
    cardNumber.addEventListener("input", function () {
        let value = cardNumber.value.replace(/\D/g, "");

        value = value.substring(0, 16);

        cardNumber.value = value;
    });



/* ---------- Expiry Date Formatting ---------- */
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


/* ---------- CVV - NUMBERS ONLY ---------- */
    cvv.addEventListener("input", function () {
        cvv.value =
            cvv.value.replace(/\D/g, "")
                     .substring(0, 3);
    });
    
/* ---------- Card Number Validation ---------- */
    function isValidCardNumber(number) {
        const digits = number.replace(/\s/g, "");

        return /^\d{16}$/.test(digits);
    }

/* ---------- Expiry Date Validation ---------- */
    function isValidExpiry(value) {

        // Must be in MM/YY format
        if (!/^\d{2}\/\d{2}$/.test(value)) {
            return false;
        }

        const parts = value.split("/");

        const month = parseInt(parts[0]);
        const year = parseInt(parts[1]);

        // Month must be 01-12
        if (month < 1 || month > 12) {
            return false;
        }

        // Year must be 00-99
        if (year < 0 || year > 99) {
            return false;
        }

        return true;
    }

/* ---------- Email Validation ---------- */
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

/* ---------- Form Submission ---------- */
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

        /* ---------- Stop if Invalid ---------- */
        if (!valid) {
            paymentMessage.textContent =
                "Please correct the errors above.";

            paymentMessage.className =
                "error-message";
            return;
        }

        /* ---------- Payment Success ---------- */
        const successPopup =
            document.getElementById("success-popup");


        // Get logged-in user
        const loggedInUserData =
            sessionStorage.getItem("loggedInUser");

        if (!loggedInUserData) {
            alert("Please log in again.");
            window.location.href = "login.html";
            return;
        }

        const loggedInUser =
            JSON.parse(loggedInUserData);


        // Get all registered users
        let users =
            JSON.parse(localStorage.getItem("makeupUsers")) || [];


        // Find the current user
        const userIndex =
            users.findIndex(function (user) {
                return user.email === loggedInUser.email;
            });


        if (userIndex === -1) {
            alert("User account could not be found.");
            return;
        }


        // Get current user
        const user = users[userIndex];


        // Make sure membership values exist
        if (typeof user.points !== "number") {
            user.points = 0;
        }

        if (typeof user.lifetimePoints !== "number") {
            user.lifetimePoints = 0;
        }

        if (!Array.isArray(user.redeemed)) {
            user.redeemed = [];
        }

        if (!Array.isArray(user.activity)) {
            user.activity = [];
        }


        // Determine membership tier
        let pointsPerRinggit = 1;

        if (user.lifetimePoints >= 3000) {
            pointsPerRinggit = 2;
        }
        else if (user.lifetimePoints >= 1000) {
            pointsPerRinggit = 1.5;
        }


        // Calculate points from purchase
        const earnedPoints =
            Math.floor(total * pointsPerRinggit);


        // Add points
        user.points += earnedPoints;

        user.lifetimePoints += earnedPoints;


        // Add activity
        user.activity.unshift({

            date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }),

            desc: "Purchase — " + cart.length + " item(s)",

            spent: "RM " + total.toFixed(2),

            points: "+" + earnedPoints

        });


        // Save updated user
        users[userIndex] = user;

        localStorage.setItem(
            "makeupUsers",
            JSON.stringify(users)
        );


        // Show success popup
        if (successPopup) {
            successPopup.style.display = "flex";
        }


        // Clear cart
        localStorage.removeItem("cart");


        // Redirect
        setTimeout(function () {

            window.location.href =
                "order-success.html";

        }, 2000);
    });
});