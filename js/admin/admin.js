(function(){
  /**
   * Admin mini CMS
   * - Guards access based on roles (admin/editor) and auth state
   * - CRUD for 'news' collection (title, excerpt, body, visible, publishAt)
   * - Read-only list of 'contact_messages'
   */
  function el(id){ return document.getElementById(id); }
  function status(elm, msg, ok){ if (!elm) return; elm.textContent = msg||''; elm.style.color = ok? '#2e7d32' : '#c62828'; }

  async function guard(){
    const guardEl = el('admin-guard');
    const roles = window.currentUserRoles || { admin:false, editor:false };
    if (!firebase || !firebase.auth) { guardEl.textContent = 'Firebase non initialisé.'; return; }
    firebase.auth().onAuthStateChanged(async (user)=>{
      const r = window.currentUserRoles || { admin:false, editor:false };
      if (!user || !(r.admin || r.editor)){
        guardEl.innerHTML = 'Accès restreint. <strong>Connectez-vous</strong> (menu burger) avec un compte autorisé.';
        el('news-sec').style.display = 'none';
        el('contact-sec').style.display = 'none';
        return;
      }
      guardEl.textContent = 'Connecté.';
      el('news-sec').style.display = '';
      el('contact-sec').style.display = '';
      initNews();
      loadMessages();
    });
  }

  function toTimestampLocal(ts){
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : ts; // Firestore TS or Date
    const pad = n=> String(n).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // News CRUD
  function initNews(){
    const db = firebase.firestore();
    const list = el('news-list');
    const form = el('news-form');
    const statusEl = el('news-status');
    const resetBtn = el('news-reset');

    async function load(){
      list.innerHTML = 'Chargement…';
      const snap = await db.collection('news').orderBy('publishAt','desc').limit(50).get();
      list.innerHTML = '';
      snap.forEach(doc=>{
        const d = doc.data()||{};
        const li = document.createElement('li');
        const dateTxt = d.publishAt ? (d.publishAt.toDate ? d.publishAt.toDate() : new Date(d.publishAt)).toLocaleString('fr-FR') : '';
        li.innerHTML = `<span><strong>${d.title||'Sans titre'}</strong> <span class="meta">${dateTxt} ${d.visible===false?'(masqué)':''}</span></span>`;
        const edit = document.createElement('button'); edit.textContent = 'Éditer'; edit.style.marginRight='.25rem';
        const del = document.createElement('button'); del.textContent = 'Supprimer'; del.style.background='#c62828';
        edit.addEventListener('click', ()=>{
          el('news-id').value = doc.id;
          el('news-title').value = d.title||'';
          el('news-excerpt').value = d.excerpt||'';
          el('news-body').value = d.body||'';
          el('news-visible').value = (d.visible===false?'false':'true');
          el('news-publish').value = toTimestampLocal(d.publishAt);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        del.addEventListener('click', async()=>{
          if (!confirm('Supprimer cette actualité ?')) return;
          await db.collection('news').doc(doc.id).delete();
          load();
        });
        const right = document.createElement('span'); right.appendChild(edit); right.appendChild(del);
        li.appendChild(right);
        list.appendChild(li);
      });
    }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const id = el('news-id').value.trim();
      const title = el('news-title').value.trim();
      const excerpt = el('news-excerpt').value.trim();
      const body = el('news-body').value.trim();
      const visible = el('news-visible').value === 'true';
      const pubVal = el('news-publish').value;
      const publishAt = pubVal ? new Date(pubVal) : new Date();
      const payload = {
        title, excerpt, body, visible,
        publishAt, updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        authorUid: (firebase.auth().currentUser||{}).uid || null
      };
      try {
        if (!title){ status(statusEl,'Titre requis', false); return; }
        if (id) {
          await db.collection('news').doc(id).set(payload, { merge: true });
        } else {
          payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          await db.collection('news').add(payload);
        }
        status(statusEl, 'Enregistré.', true);
        el('news-form').reset(); el('news-id').value='';
        load();
      } catch (e){ status(statusEl, 'Erreur: '+(e && e.message || e), false); }
    });

    resetBtn.addEventListener('click', ()=>{ el('news-form').reset(); el('news-id').value=''; status(statusEl,'',true); });

    load();
  }

  // Contact messages
  async function loadMessages(){
    const db = firebase.firestore();
    const list = el('contact-list');
    list.innerHTML = 'Chargement…';
    const snap = await db.collection('contact_messages').orderBy('createdAt','desc').limit(50).get();
    list.innerHTML = '';
    if (snap.empty) { list.innerHTML = '<li>Aucun message.</li>'; return; }
    snap.forEach(doc=>{
      const d = doc.data()||{};
      const created = d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString('fr-FR') : '';
      const li = document.createElement('li');
      li.innerHTML = `<span><strong>${d.name||'Anonyme'}</strong> <span class="meta">${created}</span><br>${(d.subject||'')}
      <br><a href="mailto:${d.email}">${d.email}</a></span>`;
      const view = document.createElement('button'); view.textContent='Voir';
      view.addEventListener('click', ()=>{ alert((d.message||'').slice(0,2000)); });
      const right = document.createElement('span'); right.appendChild(view);
      li.appendChild(right);
      list.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', guard);
})();
