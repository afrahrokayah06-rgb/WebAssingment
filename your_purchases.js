document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       CHECK LOGIN
    ========================= */

    const loggedInUser =
        sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert("Please log in to view your orders.");

        window.location.href = "login.html";

        return;
    }


    /* =========================
       GET LOGGED-IN USER
    ========================= */

    let currentUser;

    try {

        currentUser =
            JSON.parse(loggedInUser);

    } catch (error) {

        console.error("Invalid login data.");

        sessionStorage.removeItem("loggedInUser");

        window.location.href = "login.html";

        return;
    }


    /* =========================
       GET ORDER HISTORY
    ========================= */

    let allOrders = [];

    try {

        allOrders =
            JSON.parse(
                localStorage.getItem("orderHistory")
            ) || [];

    } catch (error) {

        console.error(
            "Could not read order history:",
            error
        );

        allOrders = [];
    }


    /* =========================
       GET ELEMENTS
    ========================= */

    const ordersContainer =
        document.getElementById("ordersContainer");

    if (!ordersContainer) {
        return;
    }


    /* =========================
       ONLY THIS USER'S ORDERS
    ========================= */

    const orderHistory =
        allOrders.filter(function (order) {

            return (
                order.userEmail &&
                currentUser.email &&
                order.userEmail.toLowerCase() ===
                currentUser.email.toLowerCase()
            );

        });


    /* =========================
    NO ORDERS
    ========================= */

    if (orderHistory.length === 0) {

        ordersContainer.innerHTML = `
            <div class="no-orders">

                <h2>No Orders Yet</h2>

                <p>
                    You haven't placed any orders yet.
                </p>

                <a href="main_page.html">
                    Start Shopping
                </a>

            </div>
        `;

        /* Hide bottom Continue Shopping button */
        const ordersActions =
            document.querySelector(".orders-actions");

        if (ordersActions) {
            ordersActions.style.display = "none";
        }

        return;
    }

    /* =========================
       DISPLAY ORDERS
    ========================= */

    orderHistory.forEach(function (order) {

        const orderCard =
            document.createElement("div");

        orderCard.className =
            "order-card";


        /* =========================
           STATUS
        ========================= */

        let status =
            order.status || "Order Placed";

        let statusClass =
            "status-default";


        if (order.cancelled === true) {

            status = "Cancelled";
            statusClass = "status-cancelled";

        }
        else if (status === "Delivered") {

            statusClass = "status-delivered";

        }
        else if (status === "Received") {

            statusClass = "status-received";

        }
        else if (status === "Not Received") {

            statusClass = "status-not-received";

        }


        /* =========================
           ITEMS
        ========================= */

        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        /* =========================
           ITEM COUNT
        ========================= */

        const itemCount =
            items.reduce(
                function (total, item) {

                    return total +
                        (Number(item.quantity) || 1);

                },
                0
            );


        /* =========================
           HEADER
        ========================= */

        const header =
            document.createElement("div");

        header.className =
            "order-card-header";


        const headerLeft =
            document.createElement("div");


        const numberEl =
            document.createElement("div");

        numberEl.className =
            "order-number";

        numberEl.textContent =
            "#" + (order.orderNumber || "");


        const dateEl =
            document.createElement("div");

        dateEl.className =
            "order-date";

        dateEl.textContent =
            order.orderDate || "-";


        headerLeft.appendChild(numberEl);
        headerLeft.appendChild(dateEl);


        const statusEl =
            document.createElement("div");

        statusEl.className =
            "order-status " + statusClass;

        statusEl.textContent =
            status;


        header.appendChild(headerLeft);
        header.appendChild(statusEl);


        /* =========================
           ORDER INFORMATION
        ========================= */

        const orderInfo =
            document.createElement("div");

        orderInfo.className =
            "order-info";


        const countEl =
            document.createElement("span");

        countEl.textContent =
            itemCount + " item(s)";


        const totalEl =
            document.createElement("span");

        totalEl.className =
            "order-total";

        totalEl.textContent =
            "RM" +
            Number(order.total || 0)
                .toFixed(2);


        orderInfo.appendChild(countEl);
        orderInfo.appendChild(totalEl);


        /* =========================
           ITEM PREVIEW
        ========================= */

        const itemsPreview =
            document.createElement("div");

        itemsPreview.className =
            "order-items-preview";


        items.slice(0, 3).forEach(
            function (item) {

                const preview =
                    document.createElement("div");

                preview.className =
                    "order-item-preview";


                const name =
                    document.createElement("span");

                name.className =
                    "order-item-preview-name";

                name.textContent =
                    item.name || "Unnamed item";


                const quantity =
                    document.createElement("span");

                quantity.className =
                    "order-item-preview-qty";

                quantity.textContent =
                    "×" +
                    (Number(item.quantity) || 1);


                preview.appendChild(name);
                preview.appendChild(quantity);

                itemsPreview.appendChild(preview);

            }
        );


        if (items.length > 3) {

            const more =
                document.createElement("div");

            more.className =
                "order-item-preview";


            const moreText =
                document.createElement("span");

            moreText.textContent =
                "+ " +
                (items.length - 3) +
                " more item(s)";


            more.appendChild(moreText);

            itemsPreview.appendChild(more);

        }


        /* =========================
           BUTTONS
        ========================= */

        const buttons =
            document.createElement("div");

        buttons.className =
            "order-buttons";


        /* ---------- SUMMARY ---------- */

        const summaryLink =
            document.createElement("a");

        summaryLink.className =
            "btn-summary";

        summaryLink.textContent =
            "View Summary";

        summaryLink.href =
            "orderSummary.html?order=" +
            encodeURIComponent(
                order.orderNumber
            );


        /* ---------- TRACKING ---------- */

        const trackingLink =
            document.createElement("a");

        trackingLink.className =
            "btn-tracking";

        trackingLink.textContent =
            "Track Order";

        trackingLink.href =
            "orderTracking.html?order=" +
            encodeURIComponent(
                order.orderNumber
            );


        buttons.appendChild(summaryLink);
        buttons.appendChild(trackingLink);


        /* =========================
           CANCEL BUTTON
        ========================= */

        const cancelButton =
            document.createElement("button");

        cancelButton.className =
            "btn-cancel";

        cancelButton.type =
            "button";


        /* =========================
           ALREADY CANCELLED
        ========================= */

        if (order.cancelled === true) {

            cancelButton.textContent =
                "Order Cancelled";

            cancelButton.disabled = true;

        }


        /* =========================
           NORMAL ORDER
        ========================= */

        else {

            const CANCEL_WINDOW_MS =
                30 * 1000;


            const placedAt =
                Number(order.orderPlacedAt);


            /*
             * If the order doesn't have a timestamp,
             * cancellation cannot safely be calculated.
             */

            if (!placedAt || isNaN(placedAt)) {

                cancelButton.textContent =
                    "Cancellation Unavailable";

                cancelButton.disabled = true;

            }


            else {

                let cancelTimer;


                function updateCancelButton() {

                    const elapsed =
                        Date.now() - placedAt;


                    const remaining =
                        CANCEL_WINDOW_MS - elapsed;


                    if (remaining <= 0) {

                        cancelButton.textContent =
                            "Cancellation Expired";

                        cancelButton.disabled =
                            true;

                        clearInterval(
                            cancelTimer
                        );

                        return;
                    }


                    const secondsLeft =
                        Math.ceil(
                            remaining / 1000
                        );


                    cancelButton.textContent =
                        "Cancel Order (" +
                        secondsLeft +
                        "s)";

                }


                updateCancelButton();


                cancelTimer =
                    setInterval(
                        updateCancelButton,
                        1000
                    );


                /* =========================
                   CANCEL ORDER
                ========================= */

                cancelButton.addEventListener(
                    "click",
                    function () {

                        const elapsed =
                            Date.now() - placedAt;


                        /*
                         * Check time again.
                         */

                        if (
                            elapsed >=
                            CANCEL_WINDOW_MS
                        ) {

                            cancelButton.textContent =
                                "Cancellation Expired";

                            cancelButton.disabled =
                                true;

                            clearInterval(
                                cancelTimer
                            );

                            return;
                        }


                        /*
                         * Mark order cancelled.
                         */

                        order.cancelled = true;

                        order.status =
                            "Cancelled";


                        /*
                         * Find the order inside
                         * ALL orders.
                         */

                        const orderIndex =
                            allOrders.findIndex(
                                function (item) {

                                    return (
                                        item.orderNumber ===
                                        order.orderNumber
                                    );

                                }
                            );


                        if (orderIndex !== -1) {

                            allOrders[
                                orderIndex
                            ] = order;


                            /*
                             * IMPORTANT:
                             * Save ALL orders,
                             * not filtered orders.
                             */

                            localStorage.setItem(
                                "orderHistory",
                                JSON.stringify(
                                    allOrders
                                )
                            );

                        }


                        /*
                         * Stop countdown.
                         */

                        clearInterval(
                            cancelTimer
                        );


                        /*
                         * Update button.
                         */

                        cancelButton.textContent =
                            "Order Cancelled";

                        cancelButton.disabled =
                            true;


                        /*
                         * Update status.
                         */

                        statusEl.textContent =
                            "Cancelled";

                    }
                );

            }

        }


        buttons.appendChild(
            cancelButton
        );


        /* =========================
           BUILD CARD
        ========================= */

        orderCard.appendChild(
            header
        );

        orderCard.appendChild(
            orderInfo
        );

        orderCard.appendChild(
            itemsPreview
        );

        orderCard.appendChild(
            buttons
        );


        ordersContainer.appendChild(
            orderCard
        );

    });

});