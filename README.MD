# IUT Student Portal

This website serves as a portal for students of the IUT du Littoral Côte d'Opale. It centralizes useful links, timetables, regulations, and other essential resources.

## Features

- **Smart search**: Instantly filters cards and links on the portal.
- **Light/Dark theme**: Toggle between modes using the button at the top right.
- **Quick access**:
  - Timetables by department (GEA, TC, INFO, GEII, BIO, GIM, GTE, GACO)
  - ULCO tools: Webmail, Moodle, LDAP Account, JrCan.dev, Grades, WIMS
  - Regulations and MCCC (PDF)
- **Mobile app page**: EDETA, with download for Android and info for iOS

## Project Structure

```
index.html
contact.html
notes.html
edeta.html
maintenance.html
404.html
500.html
css/
  style_index.css
  style_contact.css
  style_notes.css
  style_edeta.css
  style_maintenance.css
js/
  common/
    maintenance_guard.js       # redirect to maintenance.html when active
    analytics.js               # analytics helper
    nav.js                     # sticky header, breadcrumbs, responsive controls
  index/
    script_index.js            # homepage search filter
  notes/
    script_notes.js            # local theme toggle
    script_bulletin.js         # grade lookup logic
  script_edeta.js              # EDETA page logic
img/
apk/
pdf/
documentation/
```

## Usage

1. Open `index.html` in your browser.
2. Use the search bar or navigate via the cards.
3. Click links to access resources.
4. For mobile app info and download, visit `edeta.html`.

### Conventions

- Shared scripts live under `js/common`; page-specific logic lives under `js/<page>`.
- Most modules are self-contained (IIFE) and document purpose and dependencies.
- The global header (brand/nav/search/theme) + breadcrumbs are injected by `js/common/nav.js` on all pages.
- IDs should be unique per page.

## Customization

- Edit links or add sections in `index.html` and `edeta.html`.
- Change styles in `css/style_index.css` and `css/style_edeta.css`.
- Add features in `js/index/script_index.js` and `js/script_edeta.js`.

## Author

Lysandre PACE--BOULNOIS / Nova

---

> This project is officially affiliated with the IUT of Calais.
