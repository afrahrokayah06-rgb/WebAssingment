document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       CHECK LOGIN
    ========================= */

    const loggedInUser =
        sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert("Please log in to track your order.");

        window.location.href = "login.html";

        return;
    }


    /* =========================
       GET LOGGED-IN USER
    ========================= */

    const currentUser =
        JSON.parse(loggedInUser);


    /* =========================
       GET ORDER NUMBER FROM URL
    ========================= */

    const urlParams =
        new URLSearchParams(window.location.search);

    const selectedOrderNumber =
        urlParams.get("order");


    /* =========================
       GET ORDER HISTORY
    ========================= */

    const orderHistory =
        JSON.parse(
            localStorage.getItem("orderHistory")
        ) || [];


    /* =========================
       FIND SELECTED ORDER
    ========================= */

    let order = null;

    if (selectedOrderNumber) {

        order =
            orderHistory.find(function (item) {

                return (
                    item.orderNumber === selectedOrderNumber &&
                    item.userEmail === currentUser.email
                );

            });

    }


    /* =========================
       GET ELEMENTS
    ========================= */

    const orderNumberEl =
        document.getElementById("orderNumber");

    const orderDateEl =
        document.getElementById("orderDate");

    const steps =
        document.querySelectorAll(".timeline-step");

    const deliveryCheck =
        document.getElementById("deliveryCheck");

    const timeline =
        document.getElementById("timeline");

    const confirmYes =
        document.getElementById("confirmYes");

    const confirmNo =
        document.getElementById("confirmNo");

    const deliveryIssue =
        document.getElementById("deliveryIssue");

    const cancelledMessage =
        document.getElementById("cancelledMessage");


    /* =========================
       NO ORDER FOUND
    ========================= */

    if (!order) {

        orderNumberEl.textContent =
            "No order found";

        orderDateEl.textContent =
            "-";

        if (timeline) {
            timeline.style.display = "none";
        }

        if (deliveryCheck) {
            deliveryCheck.style.display = "none";
        }

        if (cancelledMessage) {
            cancelledMessage.style.display = "none";
        }

        return;
    }


    /* =========================
       DISPLAY ORDER INFORMATION
    ========================= */

    orderNumberEl.textContent =
        "#" + order.orderNumber;

    orderDateEl.textContent =
        order.orderDate || "-";


    /* =========================
       CHECK IF ORDER IS CANCELLED
    ========================= */

    if (order.cancelled === true) {

        if (timeline) {
            timeline.style.display = "none";
        }

        if (deliveryCheck) {
            deliveryCheck.style.display = "none";
        }

        if (deliveryIssue) {
            deliveryIssue.style.display = "none";
        }

        if (cancelledMessage) {
            cancelledMessage.style.display = "block";
        }

        return;
    }


    /* =========================
       NORMAL ORDER
    ========================= */

    if (cancelledMessage) {
        cancelledMessage.style.display = "none";
    }


    /* =========================
    ORDER TIMELINE
    ========================= */

    let progressTimer = null;

    const STATUS_BY_STEP = [
        "Order Placed",
        "Order Confirmed",
        "Preparing",
        "Shipped",
        "Delivered"
    ];


    function saveTrackingProgress() {

        const orderIndex =
            orderHistory.findIndex(function (item) {

                return (
                    item.orderNumber ===
                    order.orderNumber
                );

            });


        if (orderIndex !== -1) {

            orderHistory[orderIndex] =
                order;

            localStorage.setItem(
                "orderHistory",
                JSON.stringify(orderHistory)
            );

        }

    }


    function activateStep(index) {

        steps.forEach(function (step, i) {

            step.classList.remove("active");
            step.classList.remove("completed");


            if (i < index) {

                step.classList.add("completed");

            }

        });


        if (steps[index]) {

            steps[index].classList.add("active");

        }


        /*
        * Update order status to match
        * the current timeline step.
        */

        if (STATUS_BY_STEP[index]) {

            order.status =
                STATUS_BY_STEP[index];

        }


        order.trackingStep =
            index;


        saveTrackingProgress();

    }


    function startTimeline() {

        const STEP_DURATION = 5000;

        /*
        * Use saved tracking progress.
        * If there is no saved progress, start at step 0.
        */
        let currentStep =
            Number.isInteger(order.trackingStep)
                ? order.trackingStep
                : 0;


        function saveTrackingProgress() {

            const orderIndex =
                orderHistory.findIndex(function (item) {

                    return (
                        item.orderNumber === order.orderNumber &&
                        item.userEmail.toLowerCase() ===
                        currentUser.email.toLowerCase()
                    );

                });


            if (orderIndex !== -1) {

                orderHistory[orderIndex] = order;

                localStorage.setItem(
                    "orderHistory",
                    JSON.stringify(orderHistory)
                );

            }

        }


        function activateStep(index) {

            steps.forEach(function (step, i) {

                step.classList.remove("active");
                step.classList.remove("completed");

                if (i < index) {

                    step.classList.add("completed");

                }

            });


            if (steps[index]) {

                steps[index].classList.add("active");

            }

        }


        /* =========================
        RESTORE SAVED DELIVERY
        ========================= */

        if (order.deliveryStatus === "Received") {

            currentStep = steps.length - 1;

            activateStep(currentStep);

            steps[currentStep].classList.remove("active");
            steps[currentStep].classList.add("completed");

            if (deliveryCheck) {
                deliveryCheck.style.display = "none";
            }

            if (deliveryIssue) {
                deliveryIssue.style.display = "none";
            }

            return;
        }


        if (order.deliveryStatus === "Not Received") {

            currentStep = steps.length - 1;

            activateStep(currentStep);

            steps[currentStep].classList.remove("active");
            steps[currentStep].classList.add("completed");

            if (deliveryCheck) {
                deliveryCheck.style.display = "none";
            }

            if (deliveryIssue) {
                deliveryIssue.style.display = "block";
            }

            return;
        }


        /* =========================
        RESTORE NORMAL PROGRESS
        ========================= */

        if (currentStep >= steps.length) {

            currentStep = steps.length - 1;

        }


        activateStep(currentStep);


        /* =========================
        UPDATE STATUS
        ========================= */

        if (currentStep === 0) {

            order.status = "Order Placed";

        }
        else if (currentStep === 1) {

            order.status = "Order Confirmed";

        }
        else if (currentStep === 2) {

            order.status = "Preparing";

        }
        else if (currentStep === 3) {

            order.status = "Shipped";

        }
        else if (currentStep === 4) {

            order.status = "Delivered";

            /*
            * Do NOT mark Received here.
            * User still needs to confirm.
            */

            if (deliveryCheck) {
                deliveryCheck.style.display = "block";
            }

        }


        order.trackingStep = currentStep;

        saveTrackingProgress();


        /* =========================
        DON'T START TIMER IF DONE
        ========================= */

        if (currentStep >= steps.length - 1) {
            return;
        }


        /* =========================
        MOVE THROUGH TIMELINE
        ========================= */

        progressTimer =
            setInterval(function () {

                currentStep++;


                /* Timeline reached Delivered */

                if (currentStep >= steps.length - 1) {

                    clearInterval(progressTimer);

                    currentStep =
                        steps.length - 1;

                    activateStep(currentStep);


                    order.trackingStep =
                        currentStep;

                    order.status =
                        "Delivered";


                    saveTrackingProgress();


                    if (deliveryCheck) {

                        deliveryCheck.style.display =
                            "block";

                    }

                    return;
                }


                /* Update visual timeline */

                activateStep(currentStep);


                /* Save progress */

                order.trackingStep =
                    currentStep;


                if (currentStep === 1) {

                    order.status =
                        "Order Confirmed";

                }
                else if (currentStep === 2) {

                    order.status =
                        "Preparing";

                }
                else if (currentStep === 3) {

                    order.status =
                        "Shipped";

                }


                saveTrackingProgress();

            }, STEP_DURATION);

    }


    /* =========================
    START TRACKING
    ========================= */

    startTimeline();



    /* =========================
       START TRACKING
    ========================= */

    startTimeline();


    /* =========================
       DELIVERY CONFIRMATION
    ========================= */

    function saveDeliveryStatus(status) {

        const orderIndex =
            orderHistory.findIndex(function (item) {

                return (
                    item.orderNumber === order.orderNumber &&
                    item.userEmail.toLowerCase() ===
                    currentUser.email.toLowerCase()
                );

            });


        if (orderIndex === -1) {

            console.error("Order could not be found.");

            return false;
        }


        /* Update the order */

        order.status = status;
        order.deliveryStatus = status;


        /* Save updated order */

        orderHistory[orderIndex] = order;

        localStorage.setItem(
            "orderHistory",
            JSON.stringify(orderHistory)
        );


        console.log(
            "Order saved:",
            status
        );

        return true;
    }


    /* =========================
    RECEIVED
    ========================= */

    if (confirmYes) {

        confirmYes.addEventListener(
            "click",
            function () {

                const saved =
                    saveDeliveryStatus("Received");


                if (!saved) {
                    return;
                }


                /* Hide confirmation */

                if (deliveryCheck) {

                    deliveryCheck.style.display =
                        "none";

                }


                /* Go to feedback */

                window.location.href =
                    "feedback.html";

            }
        );

    }


    /* =========================
    NOT RECEIVED
    ========================= */

    if (confirmNo) {

        confirmNo.addEventListener(
            "click",
            function () {

                const saved =
                    saveDeliveryStatus("Not Received");


                if (!saved) {
                    return;
                }


                /* Hide confirmation */

                if (deliveryCheck) {

                    deliveryCheck.style.display =
                        "none";

                }


                /* Show delivery problem */

                if (deliveryIssue) {

                    deliveryIssue.style.display =
                        "block";

                }

            }
        );

    }

});