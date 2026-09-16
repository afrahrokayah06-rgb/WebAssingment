document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       GET SELECTED ORDER
    ========================= */

    const urlParams = new URLSearchParams(window.location.search);
    const selectedOrderNumber = urlParams.get("order");

    const orderNumberEl =
        document.getElementById("orderNumber");

    const orderDateEl =
        document.getElementById("orderDate");

    const orderItemsContainer =
        document.getElementById("orderItemsContainer");

    const orderSubtotalEl =
        document.getElementById("orderSubtotal");

    const orderShippingEl =
        document.getElementById("orderShipping");

    const orderTotalEl =
        document.getElementById("orderTotal");

    const orderDiscountRow =
        document.getElementById("orderDiscountRow");

    const orderDiscountEl =
        document.getElementById("orderDiscount");


    /* =========================
    CHECK LOGIN
    ========================= */

    const loggedInUser =
        sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert("Please log in to view your order.");

        window.location.href = "login.html";

        return;
    }

    const currentUser =
        JSON.parse(loggedInUser);


    /* =========================
    GET ORDER HISTORY
    ========================= */

    const orderHistory =
        JSON.parse(
            localStorage.getItem("orderHistory")
        ) || [];


    let order = null;


    /* ---------- If an order number was provided ---------- */

    if (selectedOrderNumber) {

        order = orderHistory.find(function (item) {

            return (
                item.orderNumber === selectedOrderNumber &&
                item.userEmail === currentUser.email
            );

        });

    }


    /* ---------- If no URL order was provided ---------- */

    if (!order) {

        const currentOrderNumber =
            sessionStorage.getItem("currentOrderNumber");

        if (currentOrderNumber) {

            order = orderHistory.find(function (item) {

                return (
                    item.orderNumber === currentOrderNumber &&
                    item.userEmail === currentUser.email
                );

            });

        }

    }



    /* =========================
       NO ORDER FOUND
    ========================= */

    if (!order) {

        orderNumberEl.textContent = "No order found";
        orderDateEl.textContent = "-";

        orderItemsContainer.innerHTML = `
            <p style="
                color:#7a6f60;
                font-size:14px;
            ">
                We could not find this order.
            </p>
        `;

        orderSubtotalEl.textContent = "RM0.00";
        orderShippingEl.textContent = "RM0.00";
        orderTotalEl.textContent = "RM0.00";

        orderDiscountRow.style.display = "none";

        return;
    }


    /* =========================
       ORDER NUMBER & DATE
    ========================= */

    orderNumberEl.textContent =
        "#" + order.orderNumber;

    orderDateEl.textContent =
        order.orderDate;


    /* =========================
       ORDER ITEMS
    ========================= */

    orderItemsContainer.innerHTML = "";

    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    if (items.length === 0) {

        orderItemsContainer.innerHTML = `
            <p style="
                color:#7a6f60;
                font-size:14px;
            ">
                No items found for this order.
            </p>
        `;

    } else {

        items.forEach(function (product) {

            const price =
                Number(product.price) || 0;

            const quantity =
                Number(product.quantity) || 1;

            const lineTotal =
                price * quantity;


            const itemRow =
                document.createElement("div");

            itemRow.classList.add("summary-item");


            /* Use textContent instead of inserting
               product names directly into HTML. */

            const name =
                document.createElement("span");

            name.className = "item-name";
            name.textContent = product.name;


            const qty =
                document.createElement("span");

            qty.className = "item-qty";
            qty.textContent = "x" + quantity;


            const priceEl =
                document.createElement("span");

            priceEl.className = "item-price";
            priceEl.textContent =
                "RM" + lineTotal.toFixed(2);


            itemRow.appendChild(name);
            itemRow.appendChild(qty);
            itemRow.appendChild(priceEl);

            orderItemsContainer.appendChild(itemRow);

        });

    }


    /* =========================
       TOTALS
    ========================= */

    const subtotal =
        Number(order.subtotal) || 0;

    const shipping =
        Number(order.shipping) || 0;

    const discount =
        Number(order.discount) || 0;

    const total =
        Number(order.total) || 0;


    orderSubtotalEl.textContent =
        "RM" + subtotal.toFixed(2);


    if (shipping === 0) {

        orderShippingEl.textContent = "FREE";

    } else {

        orderShippingEl.textContent =
            "RM" + shipping.toFixed(2);

    }


    orderTotalEl.textContent =
        "RM" + total.toFixed(2);


    /* =========================
       DISCOUNT
    ========================= */

    if (discount > 0) {

        orderDiscountRow.style.display = "flex";

        orderDiscountEl.textContent =
            "- RM" + discount.toFixed(2);

    } else {

        orderDiscountRow.style.display = "none";

    }

});