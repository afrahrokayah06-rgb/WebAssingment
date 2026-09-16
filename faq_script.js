document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       FAQ SEARCH / FILTER
    ========================= */

    const faqSearch = document.getElementById("faqSearch");

    if (faqSearch) {

        const faqGroups = document.querySelectorAll(".faq-group");
        const faqNoResults = document.getElementById("faqNoResults");

        faqSearch.addEventListener("input", function () {

            const searchTerm = faqSearch.value.trim().toLowerCase();

            let anyVisible = false;

            faqGroups.forEach(function (group) {

                const items = group.querySelectorAll(".faq-item");

                let groupHasMatch = false;

                items.forEach(function (item) {

                    const questionText =
                        item.querySelector(".faq-question")
                            .textContent
                            .trim()
                            .toLowerCase();

                    const matches = questionText.includes(searchTerm);

                    item.style.display = matches ? "" : "none";

                    if (matches) {

                        groupHasMatch = true;
                        anyVisible = true;

                    }

                });

                /* Hide the whole category if nothing in it matches */

                group.style.display = groupHasMatch ? "" : "none";

            });

            /* Show a message if nothing matched anywhere */

            if (faqNoResults) {

                faqNoResults.style.display = anyVisible ? "none" : "block";

            }

        });

    }


    /* =========================
       FAQ ACCORDION
    ========================= */

    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const item = question.closest(".faq-item");
            const answer = item.querySelector(".faq-answer");

            /* Close any other open item (accordion behavior) */

            document.querySelectorAll(".faq-item").forEach(function (otherItem) {

                if (otherItem !== item) {

                    otherItem.classList.remove("active");
                    otherItem.querySelector(".faq-answer").style.maxHeight = null;

                }

            });

            /* Toggle the clicked item */

            const isOpening = !item.classList.contains("active");

            item.classList.toggle("active");

           if (isOpening) {
                 /* Calculate height including padding (42px = 18px top + 24px bottom) */
                answer.style.maxHeight = (answer.scrollHeight + 42) + "px";
            } else {
                answer.style.maxHeight = null;
            }

        });

    });


    /* =========================
       ACCOUNT DROPDOWN (nav bar)
    ========================= */

    const userAccountLink = document.getElementById("userAccountLink");
    const accountMenu = document.getElementById("accountMenu");

    if (userAccountLink && accountMenu) {

        userAccountLink.addEventListener("click", function (event) {

            const isLoggedIn = sessionStorage.getItem("loggedInUser");

            if (!isLoggedIn) {

                /* Not logged in — let the link navigate to login.html
                   normally, don't open the dropdown */

                return;

            }

            /* Logged in — open the dropdown instead of navigating */

            event.preventDefault();
            accountMenu.classList.toggle("open");

        });

        /* Close the dropdown when clicking anywhere outside it */

        document.addEventListener("click", function (event) {

            if (!userAccountLink.contains(event.target) &&
                !accountMenu.contains(event.target)) {

                accountMenu.classList.remove("open");

            }

        });

    }

});