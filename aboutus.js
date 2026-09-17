// ============ SECTION 6: looping images ============
const loopImages = ["Promotion1.jpg", "Promotion2.jpg", "Promotion3.jpg"];
let loopIndex = 0;

const loopImg = document.getElementById("loopImg");

setInterval(() => {
    loopIndex = (loopIndex + 1) % loopImages.length;
    loopImg.style.opacity = 0;
    setTimeout(() => {
        loopImg.src = loopImages[loopIndex];
        loopImg.style.opacity = 1;
    }, 300);
}, 3000);


// ============ SECTION 8: rotating carousel ============
const rotateItems = document.querySelectorAll("#rotating .rotateImg");
const rotateTotal = rotateItems.length;
let rotateCenter = 0;

function applyRotatePositions() {
    rotateItems.forEach((item, i) => {
        // diff ranges from -3 to 2 across the 6 items (wraps around)
        let diff = ((i - rotateCenter + 3) % rotateTotal) - 3;

        let x = 0, scale = 1, rotateY = 0, opacity = 1, z = 1;

        if (diff === 0) {
            x = 0; scale = 1.25; rotateY = 0; opacity = 1; z = 5;
        } else if (diff === -1) {
            x = -150; scale = 1; rotateY = 35; opacity = 1; z = 4;
        } else if (diff === 1) {
            x = 150; scale = 1; rotateY = -35; opacity = 1; z = 4;
        } else if (diff < -1) {
            x = -280; scale = 0.8; rotateY = 45; opacity = 0; z = 2;
        } else {
            x = 280; scale = 0.8; rotateY = -45; opacity = 0; z = 2;
        }

        item.style.transform =
            "translate(-50%, -50%) translateX(" + x + "px) scale(" + scale + ") rotateY(" + rotateY + "deg)";
        item.style.opacity = opacity;
        item.style.zIndex = z;
    });
}

applyRotatePositions();

setInterval(() => {
    rotateCenter = (rotateCenter + 1) % rotateTotal;
    applyRotatePositions();
}, 2500);


// ============ SECTION 10: store image popup ============
const s10Card = document.getElementById("s10Card");
const imgPopup = document.getElementById("imgPopup");

s10Card.addEventListener("click", () => {
    imgPopup.classList.add("active");
});

imgPopup.addEventListener("click", () => {
    imgPopup.classList.remove("active");
});