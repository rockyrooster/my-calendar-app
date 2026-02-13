# My Calendar App

A lightweight calendar app with a month view, built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies — just open `index.html` in a browser.

## Features

- **Month view** with prev/next navigation and a "Today" button
- **Click-to-add events** stored in localStorage (persist across sessions)
- **Dark mode** toggle with saved preference
- **ISO week numbers** column
- **Per-day hover colors** — each day of the week has a unique color
- **Selected day panel** showing full date, event list, and add/delete
- **Today info** — local time, India time offset, and live weather (via Open-Meteo)
- **Responsive** layout for mobile and desktop

## Getting Started

Open `index.html` directly in your browser, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and calendar skeleton |
| `app.js` | Calendar logic, events, dark mode, weather |
| `styles.css` | Layout, theming, transitions |
| `todo.md` | Development progress checklist |
