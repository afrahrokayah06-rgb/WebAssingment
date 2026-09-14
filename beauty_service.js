document.addEventListener('DOMContentLoaded', function () {
 
  var form = document.getElementById('bookingForm');
  var msg = document.getElementById('bookingMsg');
  var modal = document.getElementById('bookingModal');
  var closeModalBtn = document.getElementById('closeModal');
 
  /* ---------- Service category tabs ---------- */
  var tabButtons = document.querySelectorAll('.tab-btn');
  var serviceItems = document.querySelectorAll('.service-item');
 
  tabButtons.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabButtons.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
 
      var filter = tab.getAttribute('data-filter');
      serviceItems.forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
 
  /* ---------- "Book Now" opens modal and auto-fills selected service ---------- */
  var bookNowButtons = document.querySelectorAll('.book-now-btn');
  var serviceDisplay = document.getElementById('serviceDisplay');
  var serviceInput = document.getElementById('service');
 
  bookNowButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var serviceValue = btn.getAttribute('data-service');
      var serviceName = btn.getAttribute('data-service-name');
      
      if (serviceDisplay && serviceInput) {
        serviceDisplay.value = serviceName;
        serviceInput.value = serviceValue;
      }

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  /* ---------- Close modal handlers ---------- */
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside modal box content
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
 
  if (!form || !msg) { return; }
 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
 
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
 
    var name = document.getElementById('fullName').value.trim();
    var serviceNameText = serviceDisplay.value;
    var date = document.getElementById('preferredDate').value;
    var time = document.getElementById('preferredTime').value;
 
    msg.textContent = 'Thanks, ' + name + '! Your ' + serviceNameText +
      ' on ' + date + ' at ' + time + ' has been requested — check your email for the video call link to confirm.';
 
    // Close modal after successful booking after a short pause
    setTimeout(function() {
      closeModal();
      form.reset();
      msg.textContent = '';
    }, 4000);
  });
 
});