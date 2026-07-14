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

The intro text, goals, and interventions (including progress bars) are edited through **admin.html** — no code editing required. `data.js` is now just the offline fallback the site uses if it can't reach Supabase, and the starting content for admin's "Import starting content" button.

Folders, the logbook, images/icons, and anything in `style.css` / `app.js` are **not** editable through admin — those stay git/code changes on purpose.

### One-time setup

1. In the Supabase project already referenced in `supabase-config.js`, open **SQL Editor** and run `admin-setup.sql`. This creates the `site_content`, `goals`, and `interventions` tables (alongside the existing `logbook_entries` table) with public read / logged-in-only write access.
2. In **Authentication → Users**, add one user (email + password) — this is the shared admin login for `admin.html`.
3. Open `admin.html` in a browser, log in, and click **Import starting content** to copy the current `data.js` content into Supabase, then **Save all changes**. (Only needed once — running it again on top of already-saved content can duplicate interventions.)

### Day to day

Open `admin.html`, log in, edit the intro text or any goal/intervention field (add/remove interventions, reorder them, edit progress), click **Save all changes**. The public site (`index.html`) reads this content live from Supabase on every page load — no rebuild or deploy needed.

`data.js` structure (fallback / import source), unchanged:
- `number`, `icon`, `name`, `shortName`, `desc`
- `interventions[]` — each with `name`, `progress` (0–100), `period`, `body`, `indicators[]`
