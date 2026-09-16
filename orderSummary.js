document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       ORDER NUMBER & DATE
       (generated earlier in payment.js, this page just displays them)
    ========================= */

    const orderNumberEl = document.getElementById("orderNumber");
    const orderDateEl = document.getElementById("orderDate");

    const savedOrderNumber = sessionStorage.getItem("currentOrderNumber");
    const savedOrderDate = sessionStorage.getItem("currentOrderDate");

    if (savedOrderNumber && savedOrderDate) {

        orderNumberEl.textContent = "#" + savedOrderNumber;
        orderDateEl.textContent = savedOrderDate;

    } else {

        orderNumberEl.textContent = "No order found";
        orderDateEl.textContent = "-";

    }


    /* =========================
       ORDER ITEMS
       (saved as "lastOrderItems" in payment.js right before the
       real cart was cleared)
    ========================= */

    const orderItemsContainer = document.getElementById("orderItemsContainer");
    const orderSubtotalEl = document.getElementById("orderSubtotal");
    const orderShippingEl = document.getElementById("orderShipping");
    const orderTotalEl = document.getElementById("orderTotal");
    const orderDiscountRow = document.getElementById("orderDiscountRow");
    const orderDiscountEl = document.getElementById("orderDiscount");

    const orderItems = JSON.parse(sessionStorage.getItem("lastOrderItems")) || [];

    orderItemsContainer.innerHTML = "";

    if (orderItems.length === 0) {

        orderItemsContainer.innerHTML =
            "<p style='color:#7a6f60; font-size:14px;'>No items found for this order.</p>";

    } else {

        orderItems.forEach(function (product) {

            const price = Number(product.price) || 0;
            const quantity = Number(product.quantity) || 1;
            const lineTotal = price * quantity;

            const itemRow = document.createElement("div");
            itemRow.classList.add("summary-item");

            itemRow.innerHTML =
                "<span class='item-name'>" + product.name + "</span>" +
                "<span class='item-qty'>x" + quantity + "</span>" +
                "<span class='item-price'>RM" + lineTotal.toFixed(2) + "</span>";

            orderItemsContainer.appendChild(itemRow);

        });

    }

    /* Use the exact totals payment.js already calculated (including
       any reward discount) rather than recalculating them here */

    const subtotal = Number(sessionStorage.getItem("lastOrderSubtotal")) || 0;
    const shipping = Number(sessionStorage.getItem("lastOrderShipping")) || 0;
    const discount = Number(sessionStorage.getItem("lastOrderDiscount")) || 0;
    const total = Number(sessionStorage.getItem("lastOrderTotal")) || 0;

    orderSubtotalEl.textContent = "RM" + subtotal.toFixed(2);
    orderShippingEl.textContent = shipping === 0 ? "FREE" : "RM" + shipping.toFixed(2);
    orderTotalEl.textContent = "RM" + total.toFixed(2);

    if (discount > 0) {

        orderDiscountRow.style.display = "flex";
        orderDiscountEl.textContent = "- RM" + discount.toFixed(2);

    }

});