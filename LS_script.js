document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SHOW / HIDE PASSWORD
    ========================= */

    const eyeOpenIcon =
        `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>`;

    const eyeClosedIcon =
        `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.6 20.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.6 20.6 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>`;

    const toggleButtons = document.querySelectorAll(".toggle-password");

    toggleButtons.forEach(function (button) {

        /* Start with closed eye (password hidden) */
        button.innerHTML = eyeClosedIcon;

        button.addEventListener("click", function () {

            const targetId = button.getAttribute("data-target");
            const passwordInput = document.getElementById(targetId);

           if (passwordInput.type === "password") {

                passwordInput.type = "text";
                button.innerHTML = eyeOpenIcon;

            } else {

                passwordInput.type = "password";
                button.innerHTML = eyeClosedIcon;

            }
        });

    });




    /* =========================
       REGISTER
    ========================= */

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const fullName =
                document.getElementById("fullName").value.trim();

            const email =
                document.getElementById("registerEmail").value
                .trim()
                .toLowerCase();

            const phone =
                document.getElementById("phone").value.trim();

            const password =
                document.getElementById("registerPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const terms =
                document.getElementById("terms").checked;

            const message =
                document.getElementById("registerMessage");


            /* Clear previous message */

            message.textContent = "";


            /* Full Name Validation */

            if (fullName.length < 2) {

                message.textContent =
                    "Please enter your full name.";

                message.style.color = "red";

                return;
            }


            /* Email Validation */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                message.textContent =
                    "Please enter a valid email address.";

                message.style.color = "red";

                return;
            }


            /* Phone Validation */

            const phoneNumber =
                phone.replace(/[\s-]/g, "");

            const phonePattern =
                /^[0-9]{9,10}$/;

            if (!phonePattern.test(phoneNumber)) {

                message.textContent =
                    "Please enter a valid phone number.";

                message.style.color = "red";

                return;
            }


            /* Password Validation */

            if (password.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                message.style.color = "red";

                return;
            }


            /* Confirm Password */

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color = "red";

                return;
            }


            /* Terms */

            if (!terms) {

                message.textContent =
                    "Please agree to the Terms & Conditions.";

                message.style.color = "red";

                return;
            }
            


            /* Get existing users */

            let users =
                JSON.parse(localStorage.getItem("makeupUsers")) || [];


            /* Check duplicate email */

            const existingUser =
                users.find(function (user) {

                    return user.email === email;

                });


            if (existingUser) {

                message.textContent =
                    "An account with this email already exists.";

                message.style.color = "red";

                return;
            }


            /* Create new user */

            const newUser = {

                fullName: fullName,

                email: email,

                phone: phoneNumber,

                password: password

            };


            /* Add user */

            users.push(newUser);


            /* Save users */

            localStorage.setItem(
                "makeupUsers",
                JSON.stringify(users)
            );


            


            /* Clear form */

            registerForm.reset();


            /* Go to login page */

            setTimeout(function () {

                window.location.href = "login.html";

            }, 1500);

        });

    }


    /* =========================
       LOGIN
    ========================= */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        const loginEmail =
            document.getElementById("loginEmail");

        const rememberMe =
            document.getElementById("rememberMe");


        /* Load remembered email */

        const savedEmail =
            localStorage.getItem("rememberedEmail");

        if (savedEmail) {

            loginEmail.value = savedEmail;

            rememberMe.checked = true;

        }


        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const email =
                loginEmail.value
                .trim()
                .toLowerCase();

            const password =
                document.getElementById("loginPassword").value;

            const message =
                document.getElementById("loginMessage");


            message.textContent = "";


            /* Get users */

            const users =
                JSON.parse(localStorage.getItem("makeupUsers")) || [];


            /* Find matching user */

            const user =
                users.find(function (user) {

                    return (
                        user.email === email &&
                        user.password === password
                    );

                });


            /* Login failed */

            if (!user) {

                message.textContent =
                    "Invalid email or password.";

                message.style.color = "red";

                return;
            }


            /* Remember email */

            if (rememberMe.checked) {

                localStorage.setItem(
                    "rememberedEmail",
                    email
                );

            } else {

                localStorage.removeItem(
                    "rememberedEmail"
                );

            }


            /* Save logged in user */

            sessionStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    fullName: user.fullName,
                    email: user.email
                })
            );


           


            /* Redirect */

            setTimeout(function () {

                window.location.href = "main_page.html";

            }, 1000);

        });

    }


    /* =========================
       FORGOT PASSWORD
    ========================= */

    const forgotPassword =
        document.getElementById("forgotPassword");


    if (forgotPassword) {

        forgotPassword.addEventListener("click", function (event) {

            event.preventDefault();

            alert(
                "Password reset link has been sent to your email."
            );

        });

    }

});

/* =========================
       TERMS & CONDITIONS MODAL
    ========================= */

    const openTermsBtn = document.getElementById("openTermsBtn");
    const termsModal = document.getElementById("termsModal");
    const closeTermsBtn = document.getElementById("closeTermsBtn");

    if (openTermsBtn && termsModal && closeTermsBtn) {

        openTermsBtn.addEventListener("click", function (event) {

            event.preventDefault();
            termsModal.classList.add("active");

        });

        closeTermsBtn.addEventListener("click", function () {

            termsModal.classList.remove("active");

        });

        /* Close when clicking the dark overlay outside the box */

        termsModal.addEventListener("click", function (event) {

            if (event.target === termsModal) {

                termsModal.classList.remove("active");

            }

        });

        /* Close on Escape key */

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                termsModal.classList.remove("active");

            }

        });

    }
