
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
- **Dynamic info pop-up**: Managed via Firebase Firestore (see below)

## Project Structure

```
index.html
actualites.html
contact.html
admin.html
login.html
notes.html
css/
  style_index.css
  style_actualites.css
  style_contact.css
  style_notes.css
  style_edeta.css
  style_privacy.css
js/
  env.runtime.js               # generated from .env
  cookie_consent.js            # consent banner + window.__consentGranted
  privacy.js                   # privacy page helpers
  common/
    firebase_init.js           # initialize Firebase from env
    maintenance_guard.js       # redirect to maintenance.html when active
    analytics.js               # consent-gated analytics helper
    auth.js                    # Firebase Auth (Google/Microsoft) + roles
    nav.js                     # sticky header, breadcrumbs, responsive controls
    news_feed.js               # load public news list
    contact_directory.js       # load contact directory list
  index/
    script_index.js            # homepage search filter
    firebase_index.js          # homepage popup loader (Firestore)
    maintenance_page.js        # maintenance.html population
  admin/
    admin.js                   # mini CMS for news + contact messages
  notes/
    script_notes.js            # local theme toggle (distinct id)
    script_bulletin.js         # placeholder for INE input analytics
img/
apk/
pdf/
documentation/
  setup_firebase.md
```

## Usage

1. Open `index.html` in your browser.
2. Use the search bar or navigate via the cards.
3. Click links to access resources.
4. For mobile app info and download, visit `edeta.html`.
5. Privacy policy: `privacy.html`. You can reset consent on that page.

### Configure Firebase via .env

The Firebase config used by the portal is loaded at runtime from a generated file based on a local `.env`.

Steps (Windows / PowerShell):

1. Copy `.env.example` to `.env` and fill your Firebase values:
  - `FIREBASE_API_KEY`
  - `FIREBASE_AUTH_DOMAIN`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_STORAGE_BUCKET`
  - `FIREBASE_MESSAGING_SENDER_ID`
  - `FIREBASE_APP_ID`
2. Generate the runtime file:
  ```powershell
  ./scripts/generate-env.ps1
  ```
  This creates `js/env.runtime.js` (ignored by git).
3. Open `index.html`; the script tag for `js/env.runtime.js` is already included.

Notes:
- `.env` and `js/env.runtime.js` are ignored by git to avoid committing secrets.
- Firebase client config is not a secret, but managing it via `.env` makes switching environments easier.

### Conventions

- Shared scripts live under `js/common`; page-specific logic lives under `js/<page>`.
- Most modules are self-contained (IIFE) and document purpose, dependencies, and events.
- The global header (brand/nav/search/theme) + breadcrumbs are injected by `js/common/nav.js` on all pages.
- IDs should be unique per page. For example, the notes page uses `#notes-theme-toggle` (distinct from header’s `#theme-toggle`).

### GDPR / Cookies

- A cookie banner is loaded via `js/cookie_consent.js` and stores your decision in `localStorage` (key `cookieConsentV1`).
- No analytics are currently loaded; the banner prepares the site for future audience measurement respecting consent (`window.__consentGranted`).
- The privacy page is available at `privacy.html` and allows resetting consent.

## Pop-up Management via Firebase

- The info pop-up on the portal is managed dynamically via Firebase Firestore.
- To update the pop-up, edit the document `popups/main` in your Firestore database.
- Fields:
  - `title` (string): Pop-up title
  - `message` (string): Pop-up HTML content
  - `visible` (boolean): Show/hide the pop-up

**Security:**
- The Firebase config is public (required for client apps), but all sensitive data and permissions must be protected via Firestore rules.
- Example rule for public read-only pop-up:
  ```
  service cloud.firestore {
    match /databases/{database}/documents {
      match /popups/{docId} {
        allow read: if true;
      }
    }
  }
  ```
- Never put secrets or private keys in client-side JS.

## Admin & Data

- Authentication via Google/Microsoft is handled by `js/common/auth.js` using Firebase Auth (compat).
- Admins and editors are exposed via custom claims; the Admin link appears when authorized.
- A lightweight admin page is available at `admin.html` to manage news and list contact messages.
- Public pages fetch data defensively and log minimal analytics events only after consent.

## Customization

- Edit links or add sections in `index.html` and `edeta.html`.
- Change styles in `css/style_index.css` and `css/style_edeta.css`.
- Add features in `js/script_index.js` and `js/script_edeta.js`.
- Update pop-up content via Firestore.

## Author

Lysandre PACE--BOULNOIS / Nova

---

> This project is officially affiliated with the IUT of Calais, not (yet) with ULCO.

**============================================**