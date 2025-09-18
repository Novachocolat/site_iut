
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
edeta.html
notes.html
css/
  style_index.css
  style_edeta.css
  style_notes.css
js/
  script_index.js
  script_edeta.js
  index/
    firebase_index.js
img/
  logo_iut.png
apk/
  composeApp-debug.apk
pdf/
  reglements/
    ... (Regulations and MCCC PDFs)
  rapports/
    ... (Parcoursup Reports)
documentation/
  README.MD
```

## Usage

1. Open `index.html` in your browser.
2. Use the search bar or navigate via the cards.
3. Click links to access resources.
4. For mobile app info and download, visit `edeta.html`.

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