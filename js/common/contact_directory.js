(function(){
  /**
   * Contact directory renderer
   * - Reads 'contacts' collection ordered by department then name
   * - Renders lightweight list into #contact-list
   */
  async function loadContacts(){
    const list = document.getElementById('contact-list');
    if (!list) return;
    if (!window.firebase || !firebase.firestore){ return; }
    const db = firebase.firestore();
    try {
      const snap = await db.collection('contacts').orderBy('department').orderBy('name').get();
      list.innerHTML = '';
      if (snap.empty){
        const li = document.createElement('li');
        li.textContent = 'Coordonnées à venir.';
        list.appendChild(li);
        return;
      }
      snap.forEach(doc=>{
        const d = doc.data()||{};
        const name = d.name || 'Sans nom';
        const dept = d.department ? ` (${d.department})` : '';
        const role = d.role ? ` — ${d.role}` : '';
        const email = d.email ? `<a href="mailto:${d.email}">${d.email}</a>` : '';
        const phone = d.phone ? ` — <a href="tel:${d.phone}">${d.phone}</a>` : '';
        const li = document.createElement('li');
        li.setAttribute('data-category','contact');
        li.innerHTML = `<strong>${name}</strong>${dept}${role}${email? ' — '+email : ''}${phone}`;
        list.appendChild(li);
      });
      try { window.Analytics && window.Analytics.track('contact_directory_loaded'); } catch {}
    } catch (e) {
      // Keep placeholder
      try { window.Analytics && window.Analytics.track('contact_directory_error', { message: String(e && e.message || e) }); } catch {}
    }
  }
  document.addEventListener('DOMContentLoaded', loadContacts);
})();
