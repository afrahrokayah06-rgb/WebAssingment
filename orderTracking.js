document.addEventListener("DOMContentLoaded", function () {

    const orderNumberEl = document.getElementById("orderNumber");
    const orderDateEl = document.getElementById("orderDate");

    if (orderNumberEl && orderDateEl) {

        const savedOrderNumber = sessionStorage.getItem("currentOrderNumber");
        const savedOrderDate = sessionStorage.getItem("currentOrderDate");

        if (savedOrderNumber && savedOrderDate) {

            orderNumberEl.textContent = "#" + savedOrderNumber;
            orderDateEl.textContent = savedOrderDate;

        } else {

            orderNumberEl.textContent = "No order found";
            orderDateEl.textContent = "-";

        }

    }


    const steps = document.querySelectorAll(".timeline-step");
    const deliveryCheck = document.getElementById("deliveryCheck");
    const timeline = document.getElementById("timeline");

    const cancelControl = document.getElementById("cancelControl");
    const cancelOrderBtn = document.getElementById("cancelOrderBtn");
    const cancelConfirm = document.getElementById("cancelConfirm");
    const cancelBackBtn = document.getElementById("cancelBackBtn");
    const cancelConfirmBtn = document.getElementById("cancelConfirmBtn");
    const cancelledMessage = document.getElementById("cancelledMessage");
    const cancelTimer = document.getElementById("cancelTimer");

    /* ---------- CANCELLATION WINDOW (based on real elapsed time) ----------
       In a real system this would be 1 hour, matching the FAQ policy.
       For this demo it's shortened to 10 seconds so it's actually
       demonstrable. This is completely independent of the visual
       timeline animation below, which just simulates courier updates. */

    const CANCEL_WINDOW_MS = 10 * 1000; // 10 seconds for demo

    let currentStep = 0;
    let progressTimer = null;
    let cancelCountdownTimer = null;

    /* ---------- If this order was already cancelled earlier, show
       that immediately and skip everything else ---------- */

    if (sessionStorage.getItem("orderCancelled") === "true") {

        timeline.style.display = "none";
        cancelledMessage.style.display = "block";

    } else {

        startTimeline();
        startCancelCountdown();

    }


    function startTimeline() {

        /* How long each step "takes" before moving to the next one. */
        const STEP_DURATION = 5000; // milliseconds

        function activateStep(index) {

            steps.forEach(function (step, i) {

                step.classList.remove("active");

                if (i < index) {

                    step.classList.add("completed");

                } else if (i > index) {

                    step.classList.remove("completed");

                }

            });

            if (steps[index]) {

                steps[index].classList.add("active");

            }

        }

        activateStep(currentStep);

        progressTimer = setInterval(function () {

            currentStep++;

            if (currentStep >= steps.length) {

                steps[steps.length - 1].classList.remove("active");
                steps[steps.length - 1].classList.add("completed");

                clearInterval(progressTimer);

                deliveryCheck.style.display = "block";

                return;
            }

            activateStep(currentStep);

        }, STEP_DURATION);

    }


    /* ---------- Time-based cancel eligibility ---------- */

    function startCancelCountdown() {

        const placedAtRaw = sessionStorage.getItem("orderPlacedAt");
        const placedAt = placedAtRaw ? parseInt(placedAtRaw) : Date.now();

        function updateCountdown() {

            const elapsed = Date.now() - placedAt;
            const remaining = CANCEL_WINDOW_MS - elapsed;

            if (remaining <= 0) {

                /* Window has expired — hide the option entirely */

                cancelControl.style.display = "none";
                clearInterval(cancelCountdownTimer);
                return;

            }

            cancelControl.style.display = "block";

            const secondsLeft = Math.ceil(remaining / 1000);
            cancelTimer.textContent =
                "You can cancel within " + secondsLeft + "s";

        }

        updateCountdown();

        cancelCountdownTimer = setInterval(updateCountdown, 1000);

    }


    /* =========================
       CANCEL ORDER FLOW
    ========================= */

    cancelOrderBtn.addEventListener("click", function () {

        cancelControl.style.display = "none";
        cancelConfirm.style.display = "block";

    });

    cancelBackBtn.addEventListener("click", function () {

        cancelConfirm.style.display = "none";

        /* Only bring the cancel option back if the time window
           hasn't expired while the confirmation was open */

        const placedAtRaw = sessionStorage.getItem("orderPlacedAt");
        const placedAt = placedAtRaw ? parseInt(placedAtRaw) : Date.now();
        const stillEligible = (Date.now() - placedAt) < CANCEL_WINDOW_MS;

        if (stillEligible) {

            cancelControl.style.display = "block";

        }

    });

    cancelConfirmBtn.addEventListener("click", function () {

        /* Stop both timers permanently */

        if (progressTimer) {

            clearInterval(progressTimer);

        }

        if (cancelCountdownTimer) {

            clearInterval(cancelCountdownTimer);

        }

        sessionStorage.setItem("orderCancelled", "true");

        timeline.style.display = "none";
        cancelControl.style.display = "none";
        cancelConfirm.style.display = "none";
        deliveryCheck.style.display = "none";

        cancelledMessage.style.display = "block";

    });


    /* =========================
       DELIVERY CONFIRMATION
    ========================= */

    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");
    const deliveryIssue = document.getElementById("deliveryIssue");

    confirmYes.addEventListener("click", function () {

        /* Order confirmed as delivered — send the user to the feedback page */

        window.location.href = "feedback.html";

    });

    confirmNo.addEventListener("click", function () {

        deliveryCheck.style.display = "none";
        deliveryIssue.style.display = "block";

    });

});