(function(){
  /**
   * Public news list renderer
   * - Loads last 20 docs from 'news' ordered by publishAt desc
   * - Client-side filters: visible !== false and publishAt <= now
   * - Renders into #news-list and tracks analytics events
   */
  async function loadNews(){
    if (!window.firebase || !firebase.firestore) return;
    const db = firebase.firestore();
    const list = document.getElementById('news-list');
    if (!list) return;
    try {
      const now = new Date();
      const snap = await db.collection('news').orderBy('publishAt','desc').limit(20).get();
      const items = [];
      snap.forEach(doc=>{
        const d = doc.data() || {};
        // Client-side visibility filter to avoid showing drafts in case of permissive rules
        const vis = (d.visible !== false);
        const pub = d.publishAt && d.publishAt.toDate ? d.publishAt.toDate() : (d.publishAt ? new Date(d.publishAt) : null);
        if (!vis) return;
        if (pub && pub > now) return;
        items.push({ id: doc.id, ...d, publishAt: pub });
      });
      list.innerHTML = '';
      if (!items.length){
        const li = document.createElement('li');
        li.textContent = 'Aucune actualité pour le moment.';
        list.appendChild(li);
        return;
      }
      for (const n of items){
        const li = document.createElement('li');
        li.setAttribute('data-category','actualites');
        const dateTxt = n.publishAt ? n.publishAt.toLocaleDateString('fr-FR') : '';
        const title = n.title || 'Sans titre';
        const excerpt = n.excerpt || '';
        li.innerHTML = `<strong>${title}</strong>${dateTxt ? ' — '+dateTxt : ''}${excerpt ? ' — '+excerpt : ''}`;
        list.appendChild(li);
      }
      try { window.Analytics && window.Analytics.track('news_loaded', { count: items.length }); } catch {}
    } catch (e) {
      // Keep placeholder and avoid throwing
      try { window.Analytics && window.Analytics.track('news_error', { message: String(e && e.message || e) }); } catch {}
    }
  }
  document.addEventListener('DOMContentLoaded', loadNews);
})();
