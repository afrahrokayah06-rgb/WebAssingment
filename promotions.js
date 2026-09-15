document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     SHARED DATA — September 2026
     Sept 1, 2026 is a Tuesday, so the Sun-start grid spans
     Aug 30 - Oct 3. Cells outside September are left blank.
     ========================================================= */
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

  var ENDED_DAYS = [1, 3, 5, 6, 9];             // dull grey badge — past
  var PROMO_DAYS = [14, 18, 20, 24, 30];        // gold badge + red dot — upcoming
  var PROMO_LABEL_TEXT = 'Label';               // placeholder, user fills in later

  /* =========================================================
     SECTION 2 — CALENDAR TABLE
     ========================================================= */
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
          // day outside September — leave the cell blank
          tr.appendChild(td);
          return;
        }

        var isEnded = ENDED_DAYS.indexOf(cell.d) !== -1;
        var isPromo = PROMO_DAYS.indexOf(cell.d) !== -1;

        if (isPromo) td.classList.add('has-dot');

        if (isEnded || isPromo) {
          var badge = document.createElement('span');
          badge.className = 'date-badge ' + (isEnded ? 'badge-ended' : 'badge-promo');
          badge.textContent = cell.d;
          badge.addEventListener('click', function (e) {
            showEventPopup(e, isEnded ? 'ended' : 'promo',
              isEnded ? 'Event has already ended!' : PROMO_LABEL_TEXT);
          });
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

  /* =========================================================
     SECTION 3 — WEEK SELECTOR   &   SECTION 4 — WEEK DISPLAY
     ========================================================= */
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

  /* =========================================================
     SECTION 5 — EVENT TIMELINE
     Bar height is proportional to the gap between each pair of
     dates, so a longer stretch between promotions reads as a
     taller block.
     ========================================================= */
  var TIMELINE_RANGES = [
    { from: 1, to: 3 },
    { from: 5, to: 6 },
    { from: 9, to: 14 },
    { from: 18, to: 20 },
    { from: 24, to: 30 }
  ];

  var BAR_MIN_HEIGHT = 34;
  var BAR_HEIGHT_PER_DAY = 9;

  var timelineWrap = document.getElementById('timeline');

  function buildTimeline() {
    TIMELINE_RANGES.forEach(function (range) {
      var span = range.to - range.from;
      var height = BAR_MIN_HEIGHT + span * BAR_HEIGHT_PER_DAY;

      var row = document.createElement('div');
      row.className = 'timeline-row';

      var hourLabel = document.createElement('span');
      hourLabel.className = 'timeline-hour';
      hourLabel.textContent = range.from + ' \u2013 ' + range.to;

      var bar = document.createElement('div');
      bar.className = 'timeline-bar';
      bar.style.height = height + 'px';

      var label = document.createElement('span');
      label.className = 'timeline-label';
      label.textContent = 'Label';

      var img = document.createElement('img');
      img.src = 'MakeupKit1.png';
      img.alt = 'Promotion item';

      bar.appendChild(label);
      bar.appendChild(img);

      row.appendChild(hourLabel);
      row.appendChild(bar);
      timelineWrap.appendChild(row);
    });
  }

  /* =========================================================
     SECTION 6 — ONGOING PROMOTIONS CARDS
     ========================================================= */
  var CARDS = [
    { title: 'Label H4', short: 'paragraph', full: 'paragraph — full promotion details go here. Terms and conditions apply, see in-store or online for more information on this offer.' },
    { title: 'Label H4', short: 'paragraph', full: 'paragraph — full promotion details go here. Terms and conditions apply, see in-store or online for more information on this offer.' },
    { title: 'Label H4', short: 'paragraph', full: 'paragraph — full promotion details go here. Terms and conditions apply, see in-store or online for more information on this offer.' }
  ];

  var cardsWrap = document.getElementById('promoCards');

  function buildCards() {
    CARDS.forEach(function (card) {
      var wrap = document.createElement('div');
      wrap.className = 'promo-card';

      var imgBox = document.createElement('div');
      imgBox.className = 'promo-card-img';
      var img = document.createElement('img');
      img.src = 'PromoCardImage.png';
      img.alt = card.title;
      imgBox.appendChild(img);

      var textBox = document.createElement('div');
      textBox.className = 'promo-card-text';

      var h4 = document.createElement('h4');
      h4.textContent = card.title;
      var p = document.createElement('p');
      p.textContent = card.short;

      textBox.appendChild(h4);
      textBox.appendChild(p);

      textBox.addEventListener('click', function () {
        var expanded = textBox.classList.toggle('expanded');
        p.textContent = expanded ? card.full : card.short;
      });

      wrap.appendChild(imgBox);
      wrap.appendChild(textBox);
      cardsWrap.appendChild(wrap);
    });
  }

  /* =========================================================
     SECTION 7 — CLICK TO REVEAL IMAGE
     ========================================================= */
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

  /* =========================================================
     INIT
     ========================================================= */
  buildCalendar();
  buildWeekButtons();
  selectWeek(2); // default to Week 3, matching the reference sketch
  buildTimeline();
  buildCards();
  setupReveal();

});
