/* ================================= */
/* SLIDESHOW */
/* ================================= */

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;
let slideTimer;


/* Show selected slide */

function showSlide(index) {

    if (index >= slides.length) {
        currentSlide = 0;
    } 
    else if (index < 0) {
        currentSlide = slides.length - 1;
    } 
    else {
        currentSlide = index;
    }


    slides.forEach(slide => {
        slide.classList.remove("active");
    });


    dots.forEach(dot => {
        dot.classList.remove("active");
    });


    slides[currentSlide].classList.add("active");

    dots[currentSlide].classList.add("active");
}


/* Previous / Next */

function changeSlide(direction) {

    showSlide(currentSlide + direction);

    resetTimer();
}


/* Automatic slideshow */

function startTimer() {

    slideTimer = setInterval(() => {

        showSlide(currentSlide + 1);

    }, 5000);

}


/* Reset timer after user clicks */

function resetTimer() {

    clearInterval(slideTimer);

    startTimer();

}


/* Start slideshow */

startTimer();



/* ================================= */
/* SHOP NOW BUTTON */
/* ================================= */

function scrollToProducts() {

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });

}



/* ================================= */
/* PRODUCT FILTER */
/* ================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".lip-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        productCards.forEach(card => {
            const productCategory = card.dataset.category;

            if (selectedFilter === "all" || productCategory === selectedFilter) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});







/* ================================= */
/* ADD TO CART */
/* ================================= */

const cartButtons =
    document.querySelectorAll(".add-cart");


cartButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.textContent = "Added ✓";


        setTimeout(() => {

            button.textContent = "Add to Cart";

        }, 1500);

    });

});