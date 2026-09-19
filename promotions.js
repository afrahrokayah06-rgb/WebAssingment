document.addEventListener('DOMContentLoaded', function () {
var WEEKS = [
    { label: 'Week 1', dates: [
      { d: null }, { d: null },
      { d: 1, current: true }, { d: 2, current: true }, { d: 3, current: true },
      { d: 4, current: true }, { d: 5, current: true }
    ]},
    { label: 'Week 2', dates: [
      { d: 6, current: true }, { d: 7, current: true }, { d: 8, current: true },
      { d: 9, current: true }, { d: 10, current: true }, { d: 11, current: true },
      { d: 12, current: true }
    ]},
    { label: 'Week 3', dates: [
      { d: 13, current: true }, { d: 14, current: true }, { d: 15, current: true },
      { d: 16, current: true }, { d: 17, current: true }, { d: 18, current: true },
      { d: 19, current: true }
    ]},
    { label: 'Week 4', dates: [
      { d: 20, current: true }, { d: 21, current: true }, { d: 22, current: true },
      { d: 23, current: true }, { d: 24, current: true }, { d: 25, current: true },
      { d: 26, current: true }
    ]},
    { label: 'Week 5', dates: [
      { d: 27, current: true }, { d: 28, current: true }, { d: 29, current: true },
      { d: 30, current: true }, { d: null }, { d: null }, { d: null }
    ]}
  ];

  var DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  var ENDED_DAYS = [1, 3, 5, 6, 9];

  // upcoming promotions — each date has its own picture and label
  var PROMO_DATA = {
    14: { img: 'Date14.png', label: 'Discounted Item: Golden Shimmer Bronzer' },
    18: { img: 'Date18.png', label: '50% off for New Launch: Lotus Lipstick - Flower Edition' },
    20: { img: 'Date20.png', label: 'Festive Sale 50% Off: Empress Lipstick - Palace Edition' },
    24: { img: 'Date24.png', label: 'Big Sale: Up to 40% off for Peony - Gentle Cleansing Balm' },
    30: { img: 'Date30.png', label: 'Set Sales: Up to 40% off for Cherry - Full Face Cleansing Balm' }
  };

  /* ============= SECTION 2 — CALENDAR TABLE ================ */
  var calendarBody = document.getElementById('promoCalendarBody');
  var popup = document.getElementById('eventPopup');
  var popupText = document.getElementById('eventPopupText');
  var popupClose = document.getElementById('eventPopupClose');

  function buildCalendar() {
    WEEKS.forEach(function (week) {
      var tr = document.createElement('tr');
      week.dates.forEach(function (cell) {
        var td = document.createElement('td');

        if (!cell.current || cell.d === null) {
          // day outside September so will leave the cell blank
          tr.appendChild(td);
          return;
        }

        var isEnded = ENDED_DAYS.indexOf(cell.d) !== -1;
        var promo = PROMO_DATA[cell.d];

        if (promo) td.classList.add('has-dot');

        if (isEnded || promo) {
          var badge = document.createElement('span');
          badge.className = 'date-badge ' + (isEnded ? 'badge-ended' : 'badge-promo');
          badge.textContent = cell.d;
          badge.addEventListener('click', function (e) {
            showEventPopup(e, isEnded ? 'ended' : 'promo',
              isEnded ? 'Event has already ended!' : promo.label);
          });

          if (promo) {
            var decoImg = document.createElement('img');
            decoImg.className = 'promo-deco-img';
            decoImg.src = promo.img;
            decoImg.alt = '';
            td.appendChild(decoImg);
          }

          td.appendChild(badge);
        } else {
          var span = document.createElement('span');
          span.className = 'date-number';
          span.textContent = cell.d;
          td.appendChild(span);
        }

        tr.appendChild(td);
      });
      calendarBody.appendChild(tr);
    });
  }

  function showEventPopup(e, type, message) {
    popupText.textContent = message;
    popup.className = 'event-popup ' + (type === 'ended' ? 'popup-ended' : 'popup-promo');
    popup.hidden = false;
    var rect = e.target.getBoundingClientRect();
    var top = rect.bottom + 8;
    var left = rect.left;
    if (left + 240 > window.innerWidth) left = window.innerWidth - 250;
    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
  }

  popupClose.addEventListener('click', function () { popup.hidden = true; });
  document.addEventListener('click', function (e) {
    if (!popup.hidden && !popup.contains(e.target) && !e.target.classList.contains('date-badge')) {
      popup.hidden = true;
    }
  });

  /* -- View All Dates / Only View Event Dates radio button toggle -- */
  var calendarTable = document.getElementById('promoCalendar');
  var viewAllRadio = document.getElementById('viewAllDates');
  var viewEventsRadio = document.getElementById('viewEventDates');

  function applyCalendarView() {
    calendarTable.classList.toggle('events-only', viewEventsRadio.checked);
  }

  viewAllRadio.addEventListener('change', applyCalendarView);
  viewEventsRadio.addEventListener('change', applyCalendarView);

  /* =============== SECTION 3 — WEEK SELECTOR, SECTION 4 — WEEK DISPLAY ================== */
  var weekButtonsWrap = document.getElementById('weekButtons');
  var weekDisplay = document.getElementById('weekDisplay');

  function buildWeekButtons() {
    WEEKS.forEach(function (week, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = week.label;
      btn.dataset.weekIndex = index;
      btn.addEventListener('click', function () { selectWeek(index); });
      weekButtonsWrap.appendChild(btn);
    });
  }

  function selectWeek(index) {
    var buttons = weekButtonsWrap.querySelectorAll('button');
    buttons.forEach(function (b, i) {
      b.classList.toggle('active', i === index);
    });
    renderWeekDisplay(WEEKS[index]);
  }

  function renderWeekDisplay(week) {
    weekDisplay.innerHTML = '';
    week.dates.forEach(function (cell, i) {
      var col = document.createElement('div');
      col.className = 'wd-col';

      var label = document.createElement('span');
      label.className = 'wd-label';
      label.textContent = DAY_LETTERS[i];

      var date = document.createElement('span');
      date.className = 'wd-date';
      date.textContent = cell.d !== null ? cell.d : '';

      col.appendChild(label);
      col.appendChild(date);
      weekDisplay.appendChild(col);
    });
  }

  /* ============ SECTION 5 — EVENT TIMELINE=========== */
  var timelineWrap = document.getElementById('timeline');
  var reminderPopup = document.getElementById('reminderPopup');
  var reminderPopupTimer;

  function initTimelineButtons() {
    var buttons = timelineWrap.querySelectorAll('.reminder-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleReminder(btn);
      });
    });
  }

  function toggleReminder(btn) {
    var isOn = btn.dataset.on === 'true';
    var nowOn = !isOn;
    btn.dataset.on = nowOn ? 'true' : 'false';
    btn.innerHTML = nowOn ? 'Enable<br>Reminder \u2713' : 'Enable<br>Reminder';

    showReminderPopup(btn, nowOn
      ? 'Reminders: ON<br>You will be notified 5 mins before the Promotion Event starts.'
      : 'Reminders: OFF<br>You will not be alerted.');
  }

  function showReminderPopup(anchorEl, html) {
    clearTimeout(reminderPopupTimer);
    reminderPopup.innerHTML = html;
    var rect = anchorEl.getBoundingClientRect();
    var top = rect.top - 10;
    var left = rect.right + 12;
    if (left + 260 > window.innerWidth) left = rect.left;
    reminderPopup.style.top = top + 'px';
    reminderPopup.style.left = left + 'px';
    reminderPopup.classList.add('show');

    reminderPopupTimer = setTimeout(function () {
      reminderPopup.classList.remove('show');
    }, 1500);
  }

  /* ============ SECTION 6 — ONGOING PROMOTIONS CARDS ============= */
  var cardsWrap = document.getElementById('promoCards');

  function initCards() {
    var textBoxes = cardsWrap.querySelectorAll('.promo-card-text');
    textBoxes.forEach(function (textBox) {
      var p = textBox.querySelector('p');
      var shortText = p.textContent;
      var fullText = textBox.dataset.full;

      textBox.addEventListener('click', function () {
        var expanded = textBox.classList.toggle('expanded');
        p.textContent = expanded ? fullText : shortText;
      });
    });
  }

  /* ==============SECTION 7 — CLICK TO REVEAL IMAGE ================= */
  var revealCover = document.getElementById('revealCover');
  var revealIcon = document.getElementById('revealIcon');

  function setupReveal() {
    revealIcon.addEventListener('mouseenter', function () {
      revealIcon.classList.add('icon-hover');
    });
    revealIcon.addEventListener('mouseleave', function () {
      revealIcon.classList.remove('icon-hover');
    });
    revealCover.addEventListener('click', function () {
      revealCover.classList.add('revealed');
    });
  }

  /* SECTION 8 — YOUR EVENT SAVINGS CALCULATOR */

  // Manually set discount rate% for each tier
  var MEMBERSHIP_DISCOUNT_PCT = { Bronze: 4, Silver: 6, Gold: 8 };

  // referred to membership.js and membership html for the conversions
  var POINT_REWARDS = [
    { cost: 2500, rm: 50 },
    { cost: 1200, rm: 25 },
    { cost: 800, rm: 15 },
    { cost: 500, rm: 5 }
  ];

  // Manually set promocodes PROMOPK(1-5)
  var PROMO_CODES = {
    PROMOPK1: 5,
    PROMOPK2: 5,
    PROMOPK3: 6,
    PROMOPK4: 6,
    PROMOPK5: 10
  };

  function getMembershipInfo() {
    var points = 0;

    try {
      var loggedInUserData = sessionStorage.getItem('loggedInUser');
      if (loggedInUserData) {
        var loggedInUser = JSON.parse(loggedInUserData);
        var users = JSON.parse(localStorage.getItem('makeupUsers')) || [];
        var match = users.find(function (u) { return u.email === loggedInUser.email; });
        if (match && typeof match.points === 'number') {
          points = match.points;
        }
      }
    } catch (e) {
      // no membership data available yet = default Bronze / 0 points
      points = 0;
    }

    var tier = 'Bronze';
    if (points >= 3000) tier = 'Gold';
    else if (points >= 1000) tier = 'Silver';

    return { points: points, tier: tier };
  }

  function bestPointsReward(points) {
    for (var i = 0; i < POINT_REWARDS.length; i++) {
      if (points >= POINT_REWARDS[i].cost) return POINT_REWARDS[i];
    }
    return null;
  }

  // Manually added the dates based on the Event Timeline and Circled Dates on the Events Calendar - Sandi
  function getDateEventData(day) {
    if ([9, 10, 11, 12, 13, 14].indexOf(day) !== -1) {
      return { item: 'Golden Shimmer Bronzer', price: 40, eventDiscountPct: 20, cashback: 0, bundle: 0 };
    }
    if ([18, 19, 20].indexOf(day) !== -1) {
      return { item: 'Lotus Lipstick (Flower/Palace) Edition', price: 60, eventDiscountPct: 0, cashback: 10, bundle: 0 };
    }
    if ([24, 25, 26, 27, 28, 29, 30].indexOf(day) !== -1) {
      return { item: 'Cleansing Balm Set: Peony and Cherry', price: 80, eventDiscountPct: 0, cashback: 0, bundle: 20 };
    }
    return null;
  }

  function calculateNormalTotal(price, shipping) {
    return price + shipping;
  }

  function calculateMembershipDiscount(price, tier) {
    var pct = MEMBERSHIP_DISCOUNT_PCT[tier] || 0;
    return Math.round(price * pct / 100);
  }

  function setupSavingsCalculator() {
    var calcBtn = document.getElementById('calcSavingsBtn');
    var calculator = document.getElementById('savingsCalculator');

    var dateInput = document.getElementById('eventDateInput');
    var dateError = document.getElementById('eventDateError');
    var saleItemCell = document.getElementById('saleItemCell');
    var originalPriceCell = document.getElementById('originalPriceCell');
    var normalTotalCell = document.getElementById('normalTotalCell');

    var membershipTierCell = document.getElementById('membershipTierCell');
    var membershipDiscountPctCell = document.getElementById('membershipDiscountPctCell');
    var membershipDiscountRMCell = document.getElementById('membershipDiscountRMCell');

    var membershipPointsValue = document.getElementById('membershipPointsValue');
    var redeemPointsBtn = document.getElementById('redeemPointsBtn');
    var pointsRedeemRMCell = document.getElementById('pointsRedeemRMCell');

    var eventDiscountPctCell = document.getElementById('eventDiscountPctCell');
    var eventDiscountRMCell = document.getElementById('eventDiscountRMCell');
    var cashbackRMCell = document.getElementById('cashbackRMCell');
    var bundleRMCell = document.getElementById('bundleRMCell');

    var promoCodeInput = document.getElementById('promoCodeInput');
    var promoCodeError = document.getElementById('promoCodeError');
    var promoRMCell = document.getElementById('promoRMCell');

    var finalPriceCell = document.getElementById('finalPriceCell');
    var goodNews = document.getElementById('savingsGoodNews');

    var generateBtn = document.getElementById('generatePromoBtn');
    var generatedDisplay = document.getElementById('generatedPromoDisplay');

    var SHIPPING = 10;

    var state = {
      originalPrice: 0,
      eventData: null,
      membership: getMembershipInfo(),
      pointsRedeemedRM: 0,
      promoRM: 0,
      generatedCode: null
    };

    calcBtn.addEventListener('click', function () {
      calcBtn.hidden = true;
      calculator.hidden = false;

      // membership info doesn't depend on the event date, so fill it in immediately
      membershipTierCell.textContent = state.membership.tier;
      var pct = MEMBERSHIP_DISCOUNT_PCT[state.membership.tier] || 0;
      membershipDiscountPctCell.textContent = pct + '%';
      membershipPointsValue.textContent = state.membership.points + ' pts';

      recalculate();
    });

    generateBtn.addEventListener('click', function () {
      var n = Math.floor(Math.random() * 5) + 1;
      state.generatedCode = 'PROMOPK' + n;
      generatedDisplay.textContent = 'Your code: ' + state.generatedCode;

      // a freshly generated code clears whatever was typed before
      promoCodeInput.value = '';
      promoCodeError.textContent = '';
      promoRMCell.textContent = '';
      state.promoRM = 0;
      recalculate();
    });

    dateInput.addEventListener('input', function () {
      var raw = dateInput.value.trim();
      dateError.textContent = '';

      if (raw === '') {
        saleItemCell.textContent = '';
        originalPriceCell.textContent = '';
        eventDiscountPctCell.textContent = '';
        eventDiscountRMCell.textContent = '';
        cashbackRMCell.textContent = '';
        bundleRMCell.textContent = '';
        state.originalPrice = 0;
        state.eventData = null;
        recalculate();
        return;
      }

      if (!/^[0-9]+$/.test(raw)) {
        dateError.textContent = 'Whole numbers only.';
        return;
      }

      var day = parseInt(raw, 10);
      if (day < 1 || day > 30) {
        dateError.textContent = 'Enter a day between 1 and 30.';
        return;
      }

      var data = getDateEventData(day);
      state.eventData = data;

      if (!data) {
        saleItemCell.textContent = 'No event on this date';
        originalPriceCell.textContent = '';
        eventDiscountPctCell.textContent = '';
        eventDiscountRMCell.textContent = '';
        cashbackRMCell.textContent = '';
        bundleRMCell.textContent = '';
        state.originalPrice = 0;
        recalculate();
        return;
      }

      saleItemCell.textContent = data.item;
      originalPriceCell.textContent = 'RM' + data.price;
      state.originalPrice = data.price;

      eventDiscountPctCell.textContent = data.eventDiscountPct ? (data.eventDiscountPct + '%') : '';
      eventDiscountRMCell.textContent = data.eventDiscountPct
        ? ('-RM' + Math.round(data.price * data.eventDiscountPct / 100))
        : '';
      cashbackRMCell.textContent = data.cashback ? ('-RM' + data.cashback) : '';
      bundleRMCell.textContent = data.bundle ? ('-RM' + data.bundle) : '';

      recalculate();
    });

    redeemPointsBtn.addEventListener('click', function () {
      var isOn = redeemPointsBtn.dataset.on === 'true';

      if (isOn) {
        state.pointsRedeemedRM = 0;
        pointsRedeemRMCell.textContent = '';
        redeemPointsBtn.dataset.on = 'false';
        redeemPointsBtn.textContent = 'Redeem';
      } else {
        var reward = bestPointsReward(state.membership.points);
        if (!reward) {
          pointsRedeemRMCell.textContent = 'Not enough points';
        } else {
          state.pointsRedeemedRM = reward.rm;
          pointsRedeemRMCell.textContent = '-RM' + reward.rm;
          redeemPointsBtn.dataset.on = 'true';
          redeemPointsBtn.textContent = 'Undo';
        }
      }

      recalculate();
    });

    promoCodeInput.addEventListener('input', function () {
      var entered = promoCodeInput.value.trim();
      promoCodeError.textContent = '';

      if (entered === '') {
        state.promoRM = 0;
        promoRMCell.textContent = '';
        recalculate();
        return;
      }

      if (!state.generatedCode) {
        promoCodeError.textContent = 'Generate a code first.';
        state.promoRM = 0;
        promoRMCell.textContent = '';
        recalculate();
        return;
      }

      if (entered === state.generatedCode && PROMO_CODES.hasOwnProperty(entered)) {
        state.promoRM = PROMO_CODES[entered];
        promoRMCell.textContent = '-RM' + state.promoRM;
      } else {
        promoCodeError.textContent = 'Invalid Code, Please check your spelling!';
        state.promoRM = 0;
        promoRMCell.textContent = '';
      }

      recalculate();
    });

    function recalculate() {
      var normalTotal = calculateNormalTotal(state.originalPrice, SHIPPING);
      normalTotalCell.textContent = state.originalPrice ? ('RM' + normalTotal) : '';

      var membershipDiscountRM = calculateMembershipDiscount(state.originalPrice, state.membership.tier);
      membershipDiscountRMCell.textContent = state.originalPrice ? ('-RM' + membershipDiscountRM) : '';

      var eventDiscountRM = 0;
      if (state.eventData && state.eventData.eventDiscountPct) {
        eventDiscountRM = Math.round(state.originalPrice * state.eventData.eventDiscountPct / 100);
      }

      var cashbackRM = state.eventData ? state.eventData.cashback : 0;
      var bundleRM = state.eventData ? state.eventData.bundle : 0;

      // Total everything
      var totalDeductions = membershipDiscountRM + state.pointsRedeemedRM +
        eventDiscountRM + cashbackRM + bundleRM + state.promoRM + SHIPPING;

      var finalPrice = normalTotal - totalDeductions;
      if (finalPrice < 0) finalPrice = 0;

      if (state.originalPrice) {
        finalPriceCell.textContent = 'RM' + finalPrice;
        var savings = normalTotal - finalPrice;
        goodNews.textContent = 'Good News! You will save RM' + savings + ' in this event!';
      } else {
        finalPriceCell.textContent = '';
        goodNews.textContent = '';
      }
    }
  }


  buildCalendar();
  buildWeekButtons();
  selectWeek(2); // default is Week 3, index = 2
  initTimelineButtons();
  initCards();
  setupReveal();
  setupSavingsCalculator();

});
