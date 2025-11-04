/**
 * Homepage pop-up loader
 * - Reads pop-up content from Firestore (collection 'popups', doc 'main')
 * - Shows/hides the #info-popup element and auto-hides after 10s
 * Dependencies: firebase.firestore (initialized globally), DOM '#info-popup'
 */
(function(){
  function loadPopup(db) {
    db.collection('popups').doc('main').get().then((doc) => {
      const el = document.getElementById('info-popup');
      if (!el) return;
      if (doc.exists && (doc.data()||{}).visible) {
        const data = doc.data();
        const h = el.querySelector('h3');
        const p = el.querySelector('p');
        if (h) h.textContent = data.title || '';
        if (p) p.innerHTML = data.message || '';
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }).catch((error) => {
      console.error('Erreur Firestore:', error);
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (!window.firebase || !firebase.firestore) return;
    const db = firebase.firestore();
    // Load and manage the popup
    loadPopup(db);
    const popup = document.getElementById('info-popup');
    const closeBtn = document.getElementById('popup-close');
    let hideTimeout;

    function handlePopupDisplay() {
      if (popup && popup.style.display !== 'none') {
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

    // Observe style changes to toggle .show animation class
    const observer = new MutationObserver(handlePopupDisplay);
    if (popup) {
      observer.observe(popup, { attributes: true, attributeFilter: ['style'] });
    }
  });
})();