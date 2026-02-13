const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_CLASSES = ['day-sun', 'day-mon', 'day-tue', 'day-wed', 'day-thu', 'day-fri', 'day-sat'];

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let selectedDate = null;

// --- Events (localStorage) ---

function getEventsStore() {
  try {
    return JSON.parse(localStorage.getItem('calendar-events') || '{}');
  } catch { return {}; }
}

function saveEventsStore(store) {
  localStorage.setItem('calendar-events', JSON.stringify(store));
}

function getEvents(dateStr) {
  return getEventsStore()[dateStr] || [];
}

function addEvent(dateStr, text) {
  const store = getEventsStore();
  if (!store[dateStr]) store[dateStr] = [];
  store[dateStr].push(text);
  saveEventsStore(store);
}

function removeEvent(dateStr, index) {
  const store = getEventsStore();
  if (store[dateStr]) {
    store[dateStr].splice(index, 1);
    if (store[dateStr].length === 0) delete store[dateStr];
    saveEventsStore(store);
  }
}

function hasEvents(dateStr) {
  const store = getEventsStore();
  return store[dateStr] && store[dateStr].length > 0;
}

// --- Week number (ISO 8601) ---

function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

// --- Date helpers ---

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatFullDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// --- Render ---

function renderCalendar(year, month) {
  const display = document.getElementById('month-year-display');
  const container = document.getElementById('calendar-days');

  display.textContent = `${MONTH_NAMES[month]} ${year}`;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDate = new Date(year, month, 1 - firstDayOfMonth);

  const fragment = document.createDocumentFragment();

  for (let row = 0; row < 6; row++) {
    // Week number cell
    const thursdayOfRow = new Date(startDate);
    thursdayOfRow.setDate(startDate.getDate() + row * 7 + 4);
    const weekNum = getISOWeekNumber(thursdayOfRow);
    const weekCell = document.createElement('div');
    weekCell.classList.add('week-number');
    weekCell.textContent = weekNum;
    fragment.appendChild(weekCell);

    // 7 day cells
    for (let col = 0; col < 7; col++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + row * 7 + col);

      const day = cellDate.getDate();
      const isCurrentMonth = cellDate.getMonth() === month;
      const isToday = cellDate.toDateString() === today.toDateString();
      const dateStr = formatDateKey(cellDate);

      const cell = document.createElement('div');
      cell.classList.add('calendar-day', DAY_CLASSES[col]);
      cell.dataset.date = dateStr;

      if (!isCurrentMonth) cell.classList.add('other-month');
      if (isToday) cell.classList.add('today');
      if (hasEvents(dateStr)) cell.classList.add('has-events');
      if (dateStr === selectedDate) cell.classList.add('selected');

      cell.textContent = day;
      cell.addEventListener('click', () => onDayClick(dateStr, cellDate));
      fragment.appendChild(cell);
    }
  }

  container.innerHTML = '';
  container.appendChild(fragment);
}

// --- Day selection & events panel ---

function onDayClick(dateStr, cellDate) {
  // If clicking an other-month day, navigate to that month
  if (cellDate.getMonth() !== currentMonth || cellDate.getFullYear() !== currentYear) {
    currentYear = cellDate.getFullYear();
    currentMonth = cellDate.getMonth();
  }
  selectedDate = dateStr;
  renderCalendar(currentYear, currentMonth);
  showDayPanel(dateStr);
}

function showDayPanel(dateStr) {
  const panel = document.getElementById('day-panel');
  const display = document.getElementById('selected-date-display');
  display.textContent = formatFullDate(dateStr);
  renderEventsList(dateStr);
  panel.classList.add('visible');
  document.getElementById('event-input').focus();
}

function hideDayPanel() {
  const panel = document.getElementById('day-panel');
  panel.classList.remove('visible');
  selectedDate = null;
  renderCalendar(currentYear, currentMonth);
}

function renderEventsList(dateStr) {
  const list = document.getElementById('events-list');
  const events = getEvents(dateStr);

  if (events.length === 0) {
    list.innerHTML = '<div class="no-events">No events</div>';
    return;
  }

  list.innerHTML = '';
  events.forEach((text, i) => {
    const item = document.createElement('div');
    item.classList.add('event-item');

    const span = document.createElement('span');
    span.textContent = text;

    const btn = document.createElement('button');
    btn.classList.add('event-delete');
    btn.textContent = '\u00d7';
    btn.setAttribute('aria-label', 'Delete event');
    btn.addEventListener('click', () => {
      removeEvent(dateStr, i);
      renderEventsList(dateStr);
      renderCalendar(currentYear, currentMonth);
    });

    item.appendChild(span);
    item.appendChild(btn);
    list.appendChild(item);
  });
}

// --- Navigation ---

function goToPrevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth);
}

function goToNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);
}

function goToToday() {
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  renderCalendar(currentYear, currentMonth);
  showTodayInfo();
}

// --- Today info panel ---

const WMO_DESCRIPTIONS = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Drizzle',
  55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
  85: 'Light snow showers', 86: 'Snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Severe thunderstorm'
};

function showTodayInfo() {
  const panel = document.getElementById('today-info');
  const now = new Date();
  const localTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const localOffsetMin = now.getTimezoneOffset();
  const istOffsetMin = -330;
  const diffMin = localOffsetMin - istOffsetMin;
  const diffHours = diffMin / 60;
  const sign = diffHours >= 0 ? '+' : '';
  const indiaLabel = Number.isInteger(diffHours)
    ? `${sign}${diffHours}h`
    : `${sign}${diffHours.toFixed(1)}h`;

  panel.innerHTML = `
    <div class="info-row"><span class="info-label">Local time</span><span>${localTime}</span></div>
    <div class="info-row"><span class="info-label">From India</span><span>${indiaLabel}</span></div>
    <div class="info-row"><span class="info-label">Weather</span><span class="weather-value">Loading...</span></div>
  `;
  panel.classList.add('visible');

  clearTimeout(panel._hideTimer);
  panel._hideTimer = setTimeout(() => panel.classList.remove('visible'), 6000);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => setWeatherText('Location unavailable')
    );
  } else {
    setWeatherText('Geolocation not supported');
  }
}

function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const w = data.current_weather;
      const desc = WMO_DESCRIPTIONS[w.weathercode] || 'Unknown';
      setWeatherText(`${Math.round(w.temperature)}\u00b0F, ${desc}`);
    })
    .catch(() => setWeatherText('Unavailable'));
}

function setWeatherText(text) {
  const el = document.querySelector('.weather-value');
  if (el) el.textContent = text;
}

// --- Dark mode ---

function initTheme() {
  const saved = localStorage.getItem('calendar-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  }
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('calendar-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('calendar-theme', 'dark');
  }
  updateThemeIcon(!isDark);
}

function updateThemeIcon(isDark) {
  const btn = document.getElementById('dark-mode-toggle');
  btn.innerHTML = isDark ? '&#9788;' : '&#9790;';
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('prev-month').addEventListener('click', goToPrevMonth);
  document.getElementById('next-month').addEventListener('click', goToNextMonth);
  document.getElementById('today-button').addEventListener('click', goToToday);
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  document.getElementById('close-panel').addEventListener('click', hideDayPanel);

  document.getElementById('add-event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('event-input');
    const text = input.value.trim();
    if (text && selectedDate) {
      addEvent(selectedDate, text);
      input.value = '';
      renderEventsList(selectedDate);
      renderCalendar(currentYear, currentMonth);
    }
  });

  renderCalendar(currentYear, currentMonth);
});
