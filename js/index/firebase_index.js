// Configuration Firebase (Developper API Key)
const developperfirebaseConfig = {
  apiKey: "AIzaSyBOPF6IE9bTT6rHn5a2GklEO8XXJUrv-VY",
  authDomain: "extraiut.firebaseapp.com",
  projectId: "extraiut",
  storageBucket: "extraiut.firebasestorage.app",
  messagingSenderId: "993609489576",
  appId: "1:993609489576:web:58b90f5df065a98eb4769d"
};

// Initialisation Firebase (Client API Key)
const clientfirebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(clientfirebaseConfig);
const db = firebase.firestore();

// Fonction pour charger le pop-up depuis Firestore
function loadPopup() {
  db.collection("popups").doc("main").get().then((doc) => {
    if (doc.exists && doc.data().visible) {
      const data = doc.data();
      document.querySelector("#info-popup h3").textContent = data.title;
      document.querySelector("#info-popup p").innerHTML = data.message;
      document.getElementById("info-popup").style.display = "block";
    } else {
      document.getElementById("info-popup").style.display = "none";
    }
  }).catch((error) => {
    console.error("Erreur Firestore:", error);
  });
}

// Appel au chargement de la page et gestion du pop-up
window.addEventListener("DOMContentLoaded", () => {
  loadPopup();
  const popup = document.getElementById('info-popup');
  const closeBtn = document.getElementById('popup-close');
  let hideTimeout;

  // Ajoute le listener de fermeture seulement si le pop-up est affiché
  function handlePopupDisplay() {
    if (popup && popup.style.display !== "none") {
      popup.classList.add('show');
      hideTimeout = setTimeout(() => {
        popup.classList.remove('show');
      }, 10000); // Hide after 10 seconds
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          popup.classList.remove('show');
          clearTimeout(hideTimeout);
        });
      }
    } else if (popup) {
      popup.classList.remove('show');
    }
  }

  // Observe les changements d'affichage du pop-up
  const observer = new MutationObserver(handlePopupDisplay);
  if (popup) {
    observer.observe(popup, { attributes: true, attributeFilter: ['style'] });
  }
});