
# Préparer Firebase pour le portail IUT / Setting up Firebase for the IUT Portal

---

## P3 – Données et comptes (mise en place)

### Authentification (Google / Microsoft)

1. Activer les fournisseurs dans Firebase Console > Authentication > Sign-in method:
	 - Google: ON
	 - Microsoft: ON (configurer Azure AD si besoin)
2. Sur le site, `auth-compat` est chargé et `js/common/auth.js` gère:
	 - Bouton mobile « Se connecter » (dans le menu burger)
	 - Connexion via Google (fallback Microsoft)
	 - Déconnexion
	 - Exposition des rôles via `currentUser.getIdTokenResult()` dans `window.currentUserRoles`

### Rôles (admin / editor) via Custom Claims

Attribuez un rôle avec l’Admin SDK (Cloud Function, CLI ou script):

```js
// Exemple Node.js (script ou Cloud Function Admin SDK)
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
initializeApp({ credential: applicationDefault() });
await getAuth().setCustomUserClaims('<UID>', { admin: true, editor: true });
```

### Règles Firestore (Actualités)

```txt
rules_version = '2';
service cloud.firestore {
	match /databases/{db}/documents {
		function isEditor() { return request.auth != null && (
			request.auth.token.admin == true || request.auth.token.editor == true); }

		match /news/{id} {
			allow read: if resource.data.visible == true
									&& resource.data.publishAt <= request.time;
			allow create, update, delete: if isEditor();
		}

		match /maintenance/main { allow read: if true; allow write: if false; }
		match /{doc=**} { allow read, write: if false; }
	}
}
```

### Règles Storage (images actus)
### Règles Firestore (messages de contact)

Messages soumis via le formulaire public. Recommandé: activer App Check.

```txt
rules_version = '2';
service cloud.firestore {
	match /databases/{db}/documents {
		match /contact_messages/{id} {
			// Autoriser la création publique si App Check est valide
			allow create: if request.time < timestamp.date(2100,1,1);
			// Option plus sûre si App Check activé: request.auth.token.app_check == true
			allow read, update, delete: if request.auth != null && (request.auth.token.admin == true || request.auth.token.editor == true);
		}
	}
}
```

NB: Sans App Check, ces écritures publiques peuvent être spammées. Ajoutez reCAPTCHA/hCaptcha côté client, ou mieux, route via Cloud Functions avec vérification serveur.

```txt
rules_version = '2';
service firebase.storage {
	match /b/{bucket}/o {
		match /news/{id}/{fileName} {
			allow read: if true;
			allow write: if request.auth != null && (request.auth.token.admin == true || request.auth.token.editor == true);
		}
		match /{allPaths=**} { allow read, write: if false; }
	}
}
```

### Modèle de données `news`

```
news/{id}:
	title: string
	excerpt: string
	body: string (optionnel, si rendu riche côté front)
	visible: boolean
	publishAt: Timestamp
	authorUid: string
	createdAt: Timestamp
	updatedAt: Timestamp
```

Le front charge les actus (`js/common/news_feed.js`) et filtre côté client `visible`/`publishAt` par sécurité défensive (les règles Firestore doivent déjà protéger côté serveur).

### Analytics (Matomo ou GA4)

1. La bannière cookies publie un événement `consentchange` et maintient `window.__consentGranted`.
2. `js/common/analytics.js` n’initialise le tracking qu’après consentement.
3. Pour GA4, définissez `GA_ID` ou `GA_MEASUREMENT_ID` dans l’environnement.
4. Événements envoyés par défaut: `menu_toggle`, `theme_toggle`, `search`, `news_loaded/news_error`.


## 🇫🇷 Guide complet pour configurer Firebase

### 1. Créer un projet Firebase
1. Rendez-vous sur https://console.firebase.google.com/
2. Cliquez sur "Ajouter un projet" et suivez les étapes (nom, analytics, etc.).

### 2. Ajouter Firestore
1. Dans le menu de gauche, cliquez sur "Firestore Database".
2. Cliquez sur "Créer une base de données" et choisissez le mode de démarrage (test ou production).

### 3. Créer la collection pour le pop-up
1. Cliquez sur "Démarrer la collection".
2. Nom de la collection : `popups`
3. ID du document : `main`
4. Ajoutez les champs :
	- `title` (string) : Titre du pop-up
	- `message` (string) : Contenu HTML du message
	- `visible` (boolean) : true/false pour afficher ou non

### 4. Configurer les règles de sécurité Firestore
1. Dans "Firestore Database", onglet "Règles".
2. Pour autoriser la lecture publique du pop-up :
	```
	service cloud.firestore {
	  match /databases/{database}/documents {
		 match /popups/{docId} {
			allow read: if true;
		 }
		 match /config/maintenance {
			allow read: if true; // lu par le portail et la page maintenance
		 }
	  }
	}
	```
3. Pour la production, restreignez l'écriture et les autres accès selon vos besoins.

### 5. Ajouter l'application Web
1. Dans "Paramètres du projet" (engrenage en haut à gauche), section "Vos applications".
2. Cliquez sur l'icône Web (</>) et suivez les instructions.
3. Copiez la configuration Firebase générée.

### 6. Intégrer Firebase dans le site (via variables d'environnement)
1. Copiez `.env.example` en `.env` et remplissez vos valeurs Firebase.
2. Générez le fichier d'environnement runtime:
	```powershell
	./scripts/generate-env.ps1
	```
3. Dans `index.html`, assurez-vous d'inclure dans cet ordre:
	```html
	<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
	<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
	<script src="js/env.runtime.js"></script>
	<script src="js/index/firebase_index.js"></script>
	```
4. `firebase_index.js` lit désormais la configuration depuis `window.__ENV__` (généré à l'étape 2).

> Note du Développeur : "La Partie 6 est déjà implémentée dans le code."

---

## 🇬🇧 Complete guide to set up Firebase

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com/
2. Click "Add project" and follow the steps (name, analytics, etc.).

### 2. Add Firestore
1. In the left menu, click "Firestore Database".
2. Click "Create database" and choose the start mode (test or production).

### 3. Create the pop-up collection
1. Click "Start collection".
2. Collection name: `popups`
3. Document ID: `main`
4. Add fields:
	- `title` (string): Pop-up title
	- `message` (string): HTML content of the message
	- `visible` (boolean): true/false to show or hide

### 4. Set Firestore security rules
1. In "Firestore Database", go to the "Rules" tab.
2. To allow public read of the pop-up:
	```
	service cloud.firestore {
	  match /databases/{database}/documents {
		 match /popups/{docId} {
			allow read: if true;
		 }
	  }
	}
	```
3. For production, restrict write and other access as needed.

### 5. Add the Web app
1. In "Project settings" (gear icon top left), section "Your apps".
2. Click the Web icon (</>) and follow the instructions.
3. Copy the generated Firebase config.

### 6. Integrate Firebase into the site (with environment variables)
1. Copy `.env.example` to `.env` and fill your Firebase values.
2. Generate the runtime environment file:
	```powershell
	./scripts/generate-env.ps1
	```
3. In `index.html`, include in this order:
	```html
	<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
	<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
	<script src="js/env.runtime.js"></script>
	<script src="js/index/firebase_index.js"></script>
	```
4. `firebase_index.js` now reads config from `window.__ENV__` (generated at step 2).

> Developer's Note: "Section 6 is already implemented in the code."

---

## Project structure & conventions

- Scripts are grouped by responsibility:
	- `js/common/*`: shared, page-agnostic modules (firebase_init, analytics, auth, nav, maintenance_guard, data loaders)
	- `js/index/*`: homepage-specific scripts (popup loader)
	- `js/admin/*`: admin page scripts (mini CMS)
	- `js/notes/*`: notes page scripts
- Each JS file encapsulates logic in an IIFE and uses small, documented functions. Public globals are minimized; shared state (e.g., `window.currentUser`, `window.currentUserRoles`, `window.Analytics`) is explicit.
- Cookie consent controls analytics initialization; events are queued until consent (`window.__consentGranted = true`).
- The global header and breadcrumbs are injected by `js/common/nav.js` for all pages.
- IDs must be unique per page: the notes page uses a distinct `#notes-theme-toggle` button to avoid collision with the header's `#theme-toggle`.

Small polish applied:
- Wrapped homepage and maintenance scripts in IIFEs to avoid leaking globals.
- Added consistent header comments and JSDoc notes to core modules for easier maintenance.
- Created `js/notes/script_bulletin.js` placeholder to avoid 404 and to wire basic INE input analytics.

