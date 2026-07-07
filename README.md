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
    └── icons/        # where icons an assets live, need to replace emojis when SVG's are ready
```


## Updating content

All content lives in `data.js`. Each goal has:
- `number`, `icon`, `name`, `shortName`, `desc`
- `interventions[]` — each with `name`, `progress` (0–100 placeholder), `period`, `body`, `indicators[]`
