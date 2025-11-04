/**
 * Global maintenance guard
 * - Reads maintenance/main doc and redirects to maintenance.html when active=true
 * - Preserves current URL in ?from= for an easy return
 */
(function(){
  function onReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }
  function isMaintenancePage(){
    return /maintenance\.html$/i.test(location.pathname);
  }
  function currentUrl(){
    try { return location.pathname + location.search + location.hash; } catch { return '/'; }
  }
  function check(){
    try {
      if (typeof firebase === 'undefined') return;
      var db = firebase.firestore();
      // Structure: collection "maintenance", document "main"
      db.collection('maintenance').doc('main').get().then(function(doc){
        if (!doc.exists) return;
        var data = doc.data() || {};
        if (data.active === true && !isMaintenancePage()) {
          var back = encodeURIComponent(currentUrl());
          location.replace('maintenance.html?from=' + back);
        }
      }).catch(function(err){ console.warn('[MaintenanceGuard] check failed', err); });
    } catch (e) { console.warn('[MaintenanceGuard] error', e); }
  }
  onReady(check);
})();
