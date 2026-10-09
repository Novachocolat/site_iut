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
index.html                 # home page
404.html, 500.html         # error pages
robots.txt, sitemap.xml
pages/                     # other pages: contact, edeta, notes, maintenance
assets/
  css/
    base.css               # design tokens (light/dark), typography, footer
    layout.css             # header, breadcrumbs, main grid, sections
    components.css         # controls, cards, popup
    pages/                 # page-specific styles (contact, edeta, notes, maintenance, error)
  js/
    core/                  # shared ES modules
      maintenance-guard.js # redirect to maintenance page when active
      analytics.js         # analytics helper (exposes window.Analytics)
      nav.js               # sticky header, breadcrumbs, responsive controls
      theme.js             # light/dark theme helpers
      theme-init.js        # classic script: early theme (error pages)
      search.js            # home page search filter
    pages/                 # one entry point per page (imports the core modules it needs)
  img/
  pdf/                     # regulations (MCCC) and Parcoursup reports
```

## Usage

All asset and page URLs are root-absolute (`/assets/...`, `/pages/...`), so the site must be served
from the root of a web server. For local development:

```bash
docker compose up --build
```

then open <http://localhost:8080/> (files are mounted, so edits show up on refresh).
Without Docker, `python3 -m http.server 8000` also works.

### Conventions

- Each page loads a single entry point: `<script type="module" src="/assets/js/pages/<page>.js">`.
  It imports the shared modules from `assets/js/core` that the page needs.
- Stylesheets are loaded in this order: `base.css`, `layout.css`, `components.css`, then the page stylesheet.
- The global header (brand/search/theme) + breadcrumbs are injected by `assets/js/core/nav.js`.
- Avoid inline `style`/`on*` attributes: use classes and the page entry point instead.
- IDs should be unique per page.

## Customization

- Edit links or add sections in `index.html` and `pages/edeta.html`.
- Change shared styles in `assets/css/*.css`, page styles in `assets/css/pages/`.
- Enable maintenance mode with `MAINTENANCE_MODE` in `assets/js/core/maintenance-guard.js`.

## Author

Lysandre PACE--BOULNOIS / Nova

---

> This project is officially affiliated with the IUT of Calais.
