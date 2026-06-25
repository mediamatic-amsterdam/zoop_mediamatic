# Zoönomic Annual Plan — Mediamatic 2026

An open-source interactive annual report for Zoöp Mediamatic, built as a static site. No build tools or frameworks required — plain HTML, CSS, and JavaScript.

## Structure

```
zoop-annual-report/
├── index.html        # markup and layout
├── style.css         # all styles (bird + rat theme)
├── app.js            # interaction logic
├── data.js           # all goals and interventions (edit this to update content)
└── assets/
    └── icons/        # drop SVG goal icons here when ready
```

## Running locally

Just open `index.html` in a browser. No server needed.

For live weather (Amsterdam), the app calls the Open-Meteo API automatically — no API key required.

## Updating content

All content lives in `data.js`. Each goal has:
- `number`, `icon`, `name`, `shortName`, `desc`
- `interventions[]` — each with `name`, `progress` (0–100 placeholder), `period`, `body`, `indicators[]`

## Replacing emoji icons

When SVG illustrations are ready, replace the `icon` field in `data.js`:
```js
// from:
icon: "🌿",
// to:
icon: "assets/icons/goal-01.svg", // then update renderBrowse() in app.js to render <img> tags
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to Settings → Pages → Source: `main` branch, `/ (root)`
3. Your site will be live at `https://yourusername.github.io/zoop-annual-report/`

## Planned additions

- [ ] Firebase Firestore for live progress updates (editable by the team)
- [ ] Custom SVG cursor (rat / bird) toggled with the theme button
- [ ] Proper SVG icons per goal replacing emoji
- [ ] Mobile layout
