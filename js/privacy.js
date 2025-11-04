// Privacy page scripts: theme sync and consent reset
// - Keeps theme consistent with saved preference
// - Allows easy local reset of cookie consent for testing
(function(){
  function syncTheme(){
    try {
      var saved = localStorage.getItem('theme');
      if(saved){ document.body.setAttribute('data-theme', saved); }
    } catch {}
  }
  function wireReset(){
    var btn = document.getElementById('reset-consent');
    if(!btn) return;
    btn.addEventListener('click', function(){
      try {
        localStorage.removeItem('cookieConsentV1');
        alert("Consentement réinitialisé. Revenez sur la page d’accueil pour revoir le bandeau.");
      } catch {}
    });
  }
  document.addEventListener('DOMContentLoaded', function(){
    syncTheme();
    wireReset();
  });
})();
