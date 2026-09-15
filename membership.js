document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       ACCOUNT / LOGIN
    ========================================================= */

    const loggedInUserData = sessionStorage.getItem("loggedInUser");

    // User must be logged in
    if (!loggedInUserData) {
        window.location.href = "login.html";
        return;
    }

    let loggedInUser;

    try {
        loggedInUser = JSON.parse(loggedInUserData);
    } catch (error) {
        console.error("Invalid logged-in user data:", error);
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
        return;
    }

    const email = loggedInUser.email;
    const fullName = loggedInUser.fullName || "Member";

    if (!email) {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
        return;
    }


    /* =========================================================
       USER ACCOUNT DATA
       Uses the same "makeupUsers" storage as login/register.js
    ========================================================= */

    let users = JSON.parse(localStorage.getItem("makeupUsers")) || [];

    let userIndex = users.findIndex(function (user) {
        return user.email === email;
    });

    // Account no longer exists
    if (userIndex === -1) {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
        return;
    }

    let user = users[userIndex];


    /* =========================================================
       CREATE MEMBERSHIP DATA IF IT DOESN'T EXIST
    ========================================================= */

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

    saveUser();


    /* =========================================================
       SAVE USER
    ========================================================= */

    function saveUser() {

        users[userIndex] = user;

        localStorage.setItem(
            "makeupUsers",
            JSON.stringify(users)
        );
    }


    /* =========================================================
       TOAST
    ========================================================= */

    let toastTimer;

    function showToast(message) {

        const toast = document.getElementById("mem-toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2200);
    }


    /* =========================================================
       DATE
    ========================================================= */

    function todayLabel() {

        return new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }


    /* =========================================================
       FORMAT NUMBER
    ========================================================= */

    function fmt(number) {

        return Number(number).toLocaleString();
    }


    /* =========================================================
       MEMBERSHIP TIERS
    ========================================================= */

    const TIERS = [

        {
            id: "bronze",
            name: "Bronze",
            min: 0,
            max: 999,

            perks: [
                "1 point for every $1 spent",
                "Birthday reward",
                "Member-only promotions"
            ]
        },

        {
            id: "silver",
            name: "Silver",
            min: 1000,
            max: 2999,

            perks: [
                "1.5 points for every $1 spent",
                "Free birthday gift",
                "Early access to sales",
                "Free standard shipping"
            ]
        },

        {
            id: "gold",
            name: "Gold",
            min: 3000,
            max: Infinity,

            perks: [
                "2 points for every $1 spent",
                "Free birthday gift + surprise treat",
                "Early access to new arrivals",
                "Complimentary beauty service yearly"
            ]
        }

    ];


    function getCurrentTier(points) {

        return TIERS
            .slice()
            .reverse()
            .find(function (tier) {

                return points >= tier.min;

            }) || TIERS[0];
    }


    /* =========================================================
       REWARDS
    ========================================================= */

    const baseRewards = [

        {
            id: "r1",
            name: "RM5 Off Your Next Purchase",
            cost: 500
        },

        {
            id: "r2",
            name: "RM15 Off Your Next Purchase",
            cost: 800
        },

        {
            id: "r3",
            name: "RM25 Off Your Next Purchase",
            cost: 1200
        },

        {
            id: "r4",
            name: "RM50 Off Your Next Purchase",
            cost: 2500
        },

    ];


    let showAllRewards = false;


    /* =========================================================
       EARN POINTS
    ========================================================= */

    function earnPoints(points, description) {

        user.points += points;

        user.lifetimePoints += points;

        user.activity.unshift({

            date: todayLabel(),

            desc: description,

            spent: "—",

            points: "+" + points

        });

        saveUser();

        renderAll();

        showToast("+" + points + " points earned!");
    }

    /* =========================================================
       REDEEM REWARD
    ========================================================= */

    function redeem(reward) {

        if (!reward) {
            return;
        }


        // Prevent redeeming the same reward twice
        if (user.redeemed.includes(reward.id)) {

            showToast("You already redeemed this reward.");

            return;
        }


        // Not enough points
        if (user.points < reward.cost) {

            showToast("Not enough points.");

            return;
        }


        user.points -= reward.cost;

        user.redeemed.push(reward.id);


        user.activity.unshift({

            date: todayLabel(),

            desc: "Redeemed: " + reward.name,

            spent: "—",

            points: "-" + reward.cost

        });


        saveUser();

        renderAll();

        showToast("Reward redeemed!");
    }


    /* =========================================================
       VIEW ALL REWARDS
    ========================================================= */

    const viewAllLink =
        document.getElementById("view-all-link");


    if (viewAllLink) {

        viewAllLink.addEventListener("click", function (event) {

            event.preventDefault();

            showAllRewards = !showAllRewards;

            renderRewards();

        });

    }


    /* =========================================================
       RENDER SUMMARY
    ========================================================= */

    function renderSummary() {

        const welcomeText =
            document.getElementById("welcome-text");

        const pointsNumber =
            document.getElementById("points-number");

        const statCurrent =
            document.getElementById("stat-current");

        const statLifetime =
            document.getElementById("stat-lifetime");

        const tierBadge =
            document.getElementById("tier-badge");

        const tierCurrentLabel =
            document.getElementById("tier-current-label");

        const tierRemainingLabel =
            document.getElementById("tier-remaining-label");

        const progressFill =
            document.getElementById("progress-fill");

        const tierDesc =
            document.getElementById("tier-desc");


        if (welcomeText) {

            welcomeText.textContent =
                "Welcome, " + user.fullName;

        }


        if (pointsNumber) {

            pointsNumber.textContent =
                fmt(user.points);

        }


        if (statCurrent) {

            statCurrent.textContent =
                fmt(user.points);

        }


        if (statLifetime) {

            statLifetime.textContent =
                fmt(user.lifetimePoints);

        }


        const tier =
            getCurrentTier(user.points);


        if (tierBadge) {

            tierBadge.textContent =
                tier.name + " Member";

        }


        if (tierCurrentLabel) {

            tierCurrentLabel.textContent =
                tier.name;

        }


        const tierIndex =
            TIERS.indexOf(tier);

        const nextTier =
            TIERS[tierIndex + 1];


        if (nextTier) {

            const remaining =
                nextTier.min - user.points;


            if (tierRemainingLabel) {

                tierRemainingLabel.textContent =
                    fmt(remaining) +
                    " pts to " +
                    nextTier.name;

            }


            const percentage =
                Math.min(
                    100,
                    (
                        (user.points - tier.min) /
                        (nextTier.min - tier.min)
                    ) * 100
                );


            if (progressFill) {

                progressFill.style.width =
                    percentage + "%";

            }


            if (tierDesc) {

                tierDesc.textContent =
                    "You're a " +
                    tier.name +
                    " member. Keep earning points to unlock " +
                    nextTier.name +
                    "-tier perks.";

            }

        }

        else {

            if (tierRemainingLabel) {

                tierRemainingLabel.textContent =
                    "You've reached the top tier!";

            }


            if (progressFill) {

                progressFill.style.width = "100%";

            }


            if (tierDesc) {

                tierDesc.textContent =
                    "You're enjoying our top Gold-tier perks — thank you for being a loyal member!";

            }

        }

    }


    /* =========================================================
       RENDER TIERS
    ========================================================= */

    function renderTiers() {

        const grid =
            document.getElementById("tiers-grid");


        if (!grid) {
            return;
        }


        const currentTier =
            getCurrentTier(user.points);


        grid.innerHTML = "";


        TIERS.forEach(function (tier) {

            const achieved =
                user.points >= tier.min;


            const isCurrent =
                tier.id === currentTier.id;


            let noteHTML = "";


            if (isCurrent) {

                noteHTML = "";

            }

            else if (achieved) {

                noteHTML =
                    `<div class="tier-achieved-note">
                        &check; Achieved
                    </div>`;

            }

            else {

                const needed =
                    tier.min - user.points;


                noteHTML =
                    `<div class="tier-locked-note">
                        Earn ${fmt(needed)} more points to unlock
                    </div>`;

            }


            const rangeText =
                tier.max === Infinity

                    ? fmt(tier.min) + "+ points"

                    : fmt(tier.min) +
                      " – " +
                      fmt(tier.max) +
                      " points";


            const card =
                document.createElement("div");


            card.className =
                "tier-box " +
                tier.id +
                (isCurrent ? " current" : "");


            card.innerHTML = `

                ${
                    isCurrent
                    ? '<span class="current-ribbon">Your Current Tier</span>'
                    : ''
                }

                <div class="tier-icon">★</div>

                <div class="tier-name">
                    ${tier.name}
                </div>

                <div class="tier-range">
                    ${rangeText}
                </div>

                <ul class="tier-perks">

                    ${tier.perks.map(function (perk) {

                        return `<li>${perk}</li>`;

                    }).join("")}

                </ul>

                ${noteHTML}

            `;


            grid.appendChild(card);

        });

    }


    /* =========================================================
       RENDER REWARDS
    ========================================================= */

    function renderRewards() {

        const grid =
            document.getElementById("rewards-grid");


        const link =
            document.getElementById("view-all-link");


        if (!grid) {
            return;
        }


        const rewards =
            showAllRewards
            ? baseRewards.concat(extraRewards)
            : baseRewards;


        if (link) {

            link.textContent =
                showAllRewards
                ? "View less rewards"
                : "View all rewards";

        }


        grid.innerHTML = "";


        rewards.forEach(function (reward) {

            const card =
                document.createElement("div");


            card.className =
                "reward-card";


            const isRedeemed =
                user.redeemed.includes(reward.id);


            const canAfford =
                user.points >= reward.cost;


            let buttonHTML;


            if (isRedeemed) {

                buttonHTML =
                    `<button class="redeemed" disabled>
                        Redeemed
                    </button>`;

            }

            else if (!canAfford) {

                buttonHTML =
                    `<button disabled>
                        Not Enough Points
                    </button>`;

            }

            else {

                buttonHTML =
                    `<button data-id="${reward.id}">
                        Redeem
                    </button>`;

            }


            card.innerHTML = `

                <div class="reward-swatch"></div>

                <div class="reward-body">

                    <h3>
                        ${reward.name}
                    </h3>

                    <span class="reward-points">
                        ${fmt(reward.cost)} points
                    </span>

                    ${buttonHTML}

                </div>

            `;


            grid.appendChild(card);

        });


        grid.querySelectorAll("button[data-id]")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const reward =
                            rewards.find(function (item) {

                                return item.id ===
                                    button.dataset.id;

                            });


                        redeem(reward);

                    }
                );

            });

    }


    /* =========================================================
       RENDER ACTIVITY
    ========================================================= */

    function renderActivity() {

        const body =
            document.getElementById("activity-body");


        if (!body) {
            return;
        }


        body.innerHTML = "";


        if (user.activity.length === 0) {

            body.innerHTML = `

                <tr class="empty-row">

                    <td colspan="4">
                        No activity yet — start earning points!
                    </td>

                </tr>

            `;

            return;
        }


        user.activity
            .slice(0, 6)
            .forEach(function (item) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${item.date}
                    </td>

                    <td>
                        ${item.desc}
                    </td>

                    <td>
                        ${item.spent}
                    </td>

                    <td class="points-earned">
                        ${item.points}
                    </td>

                `;


                body.appendChild(row);

            });

    }


    /* =========================================================
       RENDER EVERYTHING
    ========================================================= */

    function renderAll() {

        renderSummary();

        renderTiers();

        renderRewards();

        renderActivity();

    }


    // Initial page render
    renderAll();

});