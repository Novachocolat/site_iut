/**
 * Maintenance page hydrator
 * - Fetches maintenance doc and fills title/message (and optional until info)
 * - Wires back button to return to previous page when provided
 * Dependencies: firebase.firestore (global), DOM ids: maint-title, maint-message, maint-until
 */
(function(){
function formatUntil(until) {
  try {
    if (!until) return '';
    // Support Firestore Timestamp or ISO string
    const d = until.toDate ? until.toDate() : new Date(until);
    if (isNaN(d.getTime())) return '';
    return `Fin estimée: ${d.toLocaleString()}`;
  } catch { return ''; }
}

function hydrateMaintenance(db) {
  // Structure: collection "maintenance", document "main" with fields: active(bool), title(string), description(string)
  return db.collection('maintenance').doc('main').get().then(doc => {
    const titleEl = document.getElementById('maint-title');
    const msgEl = document.getElementById('maint-message');
    const untilEl = document.getElementById('maint-until');
    if (doc.exists) {
      const data = doc.data() || {};
      const title = (typeof data.title === 'string' && data.title.trim().length) ? data.title : 'Maintenance en cours';
      const desc = (typeof data.description === 'string' && data.description.trim().length) ? data.description : 'Nous procédons à des opérations de maintenance. Merci de revenir plus tard.';
      if (titleEl) titleEl.textContent = title;
      if (msgEl) msgEl.innerHTML = desc;
      if (untilEl) untilEl.textContent = '';
    } else {
      if (titleEl) titleEl.textContent = 'Maintenance en cours';
      if (msgEl) msgEl.textContent = 'Nous procédons à des opérations de maintenance. Merci de revenir plus tard.';
      if (untilEl) untilEl.textContent = '';
    }
  }).catch(err => console.error('Maintenance page fetch failed', err));
}

function setupBack() {
  const btn = document.getElementById('try-back');
  if (!btn) return;
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from');
  btn.addEventListener('click', () => {
    if (from) {
      try { window.location.href = decodeURIComponent(from); return; } catch {}
    }
    window.location.href = '/';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (!window.firebase || !firebase.firestore) { setupBack(); return; }
  const db = firebase.firestore();
  hydrateMaintenance(db);
  setupBack();
});
})();
