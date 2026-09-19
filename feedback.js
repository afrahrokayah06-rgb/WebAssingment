
// Sign-in dropdown in the top bar
var accountLink = document.getElementById('userAccountLink');
if (accountLink) {
  accountLink.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('accountMenu').classList.toggle('open');
  });
}

// Name: letters only
document.getElementById('name').addEventListener('input', function () {
  this.value = this.value.replace(/[^A-Za-z\s]/g, '');
});

// Phone: numbers only
document.getElementById('phone').addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});

// Age: numbers only, 18-100 (Users can type in until 1000 but doesn't accept)
var ageInput = document.getElementById('age');
ageInput.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});
ageInput.addEventListener('blur', function () {
  if (this.value === '') return;
  var v = Math.min(1000, Math.max(1, parseInt(this.value, 10)));
  this.value = v;
});

// Email: show "Missing an @" until one is typed
var emailInput = document.getElementById('email');
var emailWarning = document.getElementById('emailWarning');
emailInput.addEventListener('input', function () {
  emailWarning.style.display = this.value.includes('@') ? 'none' : 'block';
});

// Reusable "Other" reveal: pass the elements and the input to show
function bindOtherReveal(triggers, otherInput) {
  triggers.forEach(function (el) {
    el.addEventListener('change', function () {
      var isOther = (el.tagName === 'SELECT') ? el.value === 'Other' : (el.value === 'Other' && el.checked);
      otherInput.style.display = isOther ? 'block' : 'none';
      if (!isOther) otherInput.value = '';
    });
  });
}
bindOtherReveal(Array.from(document.querySelectorAll('input[name="feedbackType"]')), document.getElementById('feedbackTypeOtherInput'));
bindOtherReveal([document.getElementById('productCategory')], document.getElementById('productCategoryOtherInput'));
bindOtherReveal([document.getElementById('hearAbout')], document.getElementById('hearAboutOtherInput'));

// Star rating: click toggles that star between empty/clicked
document.querySelectorAll('#starRating .star').forEach(function (star) {
  star.addEventListener('click', function () {
    this.src = this.src.includes('starempty.png') ? 'starclicked.png' : 'starempty.png';
  });
});

// Reveal the buttons only once the terms are agreed to
var agreeTerms = document.getElementById('agreeTerms');
var formButtons = document.getElementById('formButtons');
agreeTerms.addEventListener('change', function () {
  formButtons.style.display = this.checked ? 'flex' : 'none';
});

// Submit: show popup, then redirect to the main menu
var feedbackForm = document.getElementById('feedbackForm');
var popupOverlay = document.getElementById('popupOverlay');
feedbackForm.addEventListener('submit', function (e) {
  e.preventDefault();
  popupOverlay.style.display = 'flex';
  setTimeout(function () { window.location.href = 'main_page.html'; }, 2500);
});

// Clear form: full reset, including other fields
document.getElementById('clearBtn').addEventListener('click', function () {
  feedbackForm.reset();
  document.querySelectorAll('.other-input').forEach(function (el) { el.style.display = 'none'; });
  document.querySelectorAll('#starRating .star').forEach(function (star) { star.src = 'starempty.png'; });
  emailWarning.style.display = 'block';
  formButtons.style.display = 'none';
});