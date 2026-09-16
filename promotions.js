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
      // the default/reverted state is whatever text is actually written
      // in the <p> in the HTML — not a separate data-short attribute,
      // so it can never drift out of sync with what's on the page
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


  buildCalendar();
  buildWeekButtons();
  selectWeek(2); // default is Week 3
  initTimelineButtons();
  initCards();
  setupReveal();

});
