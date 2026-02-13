# Calendar App — Progress Tracker

## Tasks

### 1. Project Setup & HTML Structure
- [x] Create `index.html` with proper meta tags (charset, viewport)
- [x] Add calendar header with prev/next navigation buttons and month-year title
- [x] Add day-of-week labels row (Sun–Sat)
- [x] Add empty `#calendar-days` container for dynamic day cells
- [x] Add footer with "Today" button
- [x] Link `styles.css` and `app.js`

**Acceptance Criteria:**
- Page loads without errors in the browser
- All structural elements are present in the DOM
- CSS and JS files are correctly linked

---

### 2. Calendar Logic (`app.js`)
- [x] Define app state (`currentYear`, `currentMonth`)
- [x] Implement `renderCalendar(year, month)` — generates 6-row grid with week numbers
- [x] Calculate first day offset and days in month correctly
- [x] Show previous-month and next-month overflow days (with `.other-month` class)
- [x] Highlight today's date with `.today` class
- [x] Implement `goToPrevMonth()` with year rollover
- [x] Implement `goToNextMonth()` with year rollover
- [x] Implement `goToToday()` to jump to current month
- [x] Wire up event listeners on DOMContentLoaded

**Acceptance Criteria:**
- Calendar renders the correct number of days for each month
- First day of month aligns to the correct weekday column
- Today is correctly identified and marked
- Navigating prev/next updates the display and header text
- Dec → Jan and Jan → Dec transitions handle year change
- February in leap years shows 29 days (e.g., Feb 2028)
- "Today" button returns to the current month/year

---

### 3. Styling (`styles.css`)
- [x] CSS custom properties for theming (light/dark)
- [x] Style calendar container (max-width, centering, shadow, border-radius)
- [x] Style header with flexbox (nav buttons, month-year title, dark mode toggle)
- [x] Style the 8-column CSS Grid (week number + 7 days)
- [x] Style day cells (square aspect ratio, rounded-corner hover)
- [x] Per-day hover colors (7 unique colors)
- [x] Style `.today` class (accent background, white text)
- [x] Style `.other-month` class (muted text)
- [x] Smooth transitions (0.45s cubic-bezier easing)
- [x] Responsive media query for small screens
- [x] Style the "Today" button in footer

**Acceptance Criteria:**
- Calendar is centered on the page with a clean, modern look
- Day cells form a 7-column grid with week numbers on the left
- Each day-of-week column has a unique hover color
- Transitions feel smooth and elegant
- Layout adapts to small screens without horizontal scrolling

---

### 4. Click-to-Add Events
- [x] Click a day to select it and open the day panel
- [x] Day panel shows full formatted date (e.g., "Thursday, February 12, 2026")
- [x] Input field to add event text
- [x] Events stored in localStorage (persist across sessions)
- [x] Event list with delete buttons
- [x] Small dot indicator on days that have events
- [x] Clicking other-month days navigates to that month

**Acceptance Criteria:**
- Clicking a day highlights it and opens the panel below
- Typing text and submitting adds an event to that day
- Events persist after page refresh (localStorage)
- Dots appear on days with events
- Deleting an event removes it and updates the dot
- Clicking an other-month day navigates to that month and selects the day

---

### 5. Dark Mode
- [x] CSS custom properties for all theme colors
- [x] Toggle button in header (moon/sun icon)
- [x] Theme preference saved in localStorage
- [x] Smooth transition between themes

**Acceptance Criteria:**
- Clicking the toggle switches between light and dark themes
- All elements update colors (background, text, borders, panels, inputs)
- Theme persists across page reloads
- Transition between themes is smooth, not abrupt

---

### 6. Week Number Column
- [x] "Wk" label in header row
- [x] ISO 8601 week numbers displayed at the start of each row
- [x] Styled smaller and muted to not distract from days

**Acceptance Criteria:**
- Week numbers are correct per ISO 8601 standard
- Column is narrow and visually secondary to the day grid
- Week numbers update when navigating months

---

### 7. Selected Day Highlight
- [x] Clicked day gets an outline/border highlight
- [x] Full date displayed in the day panel header
- [x] Close button to dismiss the panel and deselect

**Acceptance Criteria:**
- Only one day is selected at a time
- Selected day has a visible outline distinct from hover and today styles
- Panel shows the correct full date string
- Closing the panel deselects the day

---

### 8. Testing & Verification
- [ ] Open in browser and verify current month renders correctly
- [ ] Navigate forward/backward through multiple months
- [ ] Verify today highlighting and event dots
- [ ] Test adding, viewing, and deleting events
- [ ] Test dark mode toggle and persistence
- [ ] Verify week numbers are correct
- [ ] Test clicking other-month days
- [ ] Test Dec/Jan year boundary transitions
- [ ] Test responsive layout at various widths

**Acceptance Criteria:**
- All above checks pass without errors in the browser console
