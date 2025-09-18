
# Préparer Firebase pour le portail IUT / Setting up Firebase for the IUT Portal

---

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
	  }
	}
	```
3. Pour la production, restreignez l'écriture et les autres accès selon vos besoins.

### 5. Ajouter l'application Web
1. Dans "Paramètres du projet" (engrenage en haut à gauche), section "Vos applications".
2. Cliquez sur l'icône Web (</>) et suivez les instructions.
3. Copiez la configuration Firebase générée.

### 6. Intégrer Firebase dans le site
1. Dans le fichier `index.html`, ajoutez avant votre JS :
	```html
	<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
	<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
	<script src="js/index/firebase_index.js"></script>
	```
2. Dans `firebase_index.js`, utilisez la config copiée :
	```js
	const firebaseConfig = { ... };
	firebase.initializeApp(firebaseConfig);
	const db = firebase.firestore();
	```

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

### 6. Integrate Firebase into the site
1. In your `index.html`, before your JS:
	```html
	<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
	<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
	<script src="js/index/firebase_index.js"></script>
	```
2. In `firebase_index.js`, use the copied config:
	```js
	const firebaseConfig = { ... };
	firebase.initializeApp(firebaseConfig);
	const db = firebase.firestore();
	```

> Developer's Note: "Section 6 is already implemented in the code."

---
