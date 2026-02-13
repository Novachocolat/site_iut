(function(){
  // Simple loader to get runtime environment. Tries PHP first (for production),
  // then falls back to static JS (for local dev without PHP).
  function load(src, ok, ko){
    var s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = ok || null;
    s.onerror = ko || null;
    document.head.appendChild(s);
  }
  // If env already present (rare), notify and exit
  if (window.__ENV__) {
    try { window.dispatchEvent(new Event('envready')); } catch {}
    return;
  }
  load('js/env.runtime.php', null, function(){
    load('js/env.runtime.js');
  });
})();
