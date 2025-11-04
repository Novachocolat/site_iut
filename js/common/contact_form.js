(function(){
  /**
   * Contact form handler (not currently used on contact.html)
   * - Validates inputs, uses a hidden honeypot field, submits to 'contact_messages'
   * - Tracks analytics events (form_submit) with validity
   */
  function $(id){ return document.getElementById(id); }
  function setStatus(msg, ok){ const el = $('cf-status'); if(!el) return; el.textContent = msg||''; el.style.color = ok? '#2e7d32' : '#c62828'; }
  function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v||''); }
  async function submitForm(e){
    e.preventDefault();
    const form = $('contact-form');
    if (!form) return;
    const website = $('cf-website').value; // honeypot
    if (website) { setStatus('Merci, votre message a été envoyé.', true); return; }
    const name = $('cf-name').value.trim();
    const email = $('cf-email').value.trim();
    const subject = $('cf-subject').value.trim();
    const message = $('cf-message').value.trim();
    if (!name || !validateEmail(email) || message.length < 10){
      setStatus('Veuillez vérifier les champs requis.', false);
      return;
    }
    const btn = $('cf-submit'); btn.disabled = true; setStatus('Envoi en cours…', true);
    try {
      if (!window.firebase || !firebase.firestore) throw new Error('Firestore indisponible');
      const db = firebase.firestore();
      await db.collection('contact_messages').add({
        name, email, subject, message,
        userAgent: navigator.userAgent,
        page: location.pathname,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      setStatus('Merci, votre message a bien été envoyé.', true);
      try { window.Analytics && window.Analytics.track('form_submit', { page: 'contact', valid: true }); } catch {}
      form.reset();
    } catch (err){
      setStatus("Une erreur s'est produite. Réessayez plus tard.", false);
      try { window.Analytics && window.Analytics.track('form_submit', { page: 'contact', valid: false, error: String(err && err.message || err) }); } catch {}
    } finally {
      btn.disabled = false;
    }
  }
  document.addEventListener('DOMContentLoaded', function(){
    const form = $('contact-form');
    if (!form) return;
    form.addEventListener('submit', submitForm);
  });
})();
