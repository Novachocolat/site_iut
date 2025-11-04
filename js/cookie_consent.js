(function(){
  /**
   * Cookie consent banner
   * - Persists decision in localStorage (cookieConsentV1)
   * - Exposes window.__consentGranted
   * - Dispatches 'consentchange' on window
   * - Injects minimal inline styles to avoid extra CSS
   */
  const KEY = 'cookieConsentV1';
  function hasConsent(){
    try { return localStorage.getItem(KEY) === 'accepted'; } catch { return false; }
  }
  function hasDecision(){
    try { return !!localStorage.getItem(KEY); } catch { return true; }
  }
  /** Persist the consent value and notify listeners */
  function setConsent(val){
    try { localStorage.setItem(KEY, val ? 'accepted' : 'rejected'); } catch {}
    window.__consentGranted = !!val;
    const bar = document.getElementById('cookie-consent');
    if (bar) bar.remove();
    try { window.dispatchEvent(new CustomEvent('consentchange', { detail: { granted: !!val } })); } catch {}
  }
  /** Inject the banner into the DOM if no prior decision */
  function inject(){
    if (hasDecision()) { 
      window.__consentGranted = hasConsent();
      try { window.dispatchEvent(new CustomEvent('consentchange', { detail: { granted: window.__consentGranted } })); } catch {}
      return; 
    }
    const bar = document.createElement('div');
    bar.id = 'cookie-consent';
    bar.innerHTML = `
      <div class="cc-inner">
        <div class="cc-text">
          Nous utilisons des cookies uniquement à des fins de fonctionnement et de mesure d'audience. 
          <a href="privacy.html" target="_blank" rel="noopener">En savoir plus</a>.
        </div>
        <div class="cc-actions">
          <button id="cc-accept" class="cc-btn cc-accept" type="button">Tout accepter</button>
          <button id="cc-reject" class="cc-btn cc-reject" type="button">Refuser</button>
        </div>
      </div>`;
    document.body.appendChild(bar);
    document.body.classList.add('has-cookie-banner');
    document.getElementById('cc-accept').addEventListener('click',()=>setConsent(true));
    document.getElementById('cc-reject').addEventListener('click',()=>setConsent(false));
  }
  /** Inject minimal CSS to style the banner */
  function injectStyles(){
    const css = `
#cookie-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#111;color:#fff;padding:12px 16px;box-shadow:0 -4px 16px rgba(0,0,0,.2);}
body.has-cookie-banner{padding-bottom:72px;}
#cookie-consent .cc-inner{max-width:1100px;margin:0 auto;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
#cookie-consent .cc-text{font-size:14px;line-height:1.4}
#cookie-consent .cc-text a{color:#9ad;}
#cookie-consent .cc-actions{display:flex;gap:8px}
#cookie-consent .cc-btn{border:0;border-radius:6px;padding:8px 12px;font-weight:600;cursor:pointer}
#cookie-consent .cc-accept{background:#34c759;color:#000}
#cookie-consent .cc-reject{background:#333;color:#fff}
@media (prefers-color-scheme: light){#cookie-consent{background:#f6f6f6;color:#111}#cookie-consent .cc-text a{color:#06c}#cookie-consent .cc-reject{background:#ddd;color:#111}}
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
  window.addEventListener('DOMContentLoaded', function(){
    injectStyles();
    inject();
    // Remove bottom padding when banner is gone (accepted/refused)
    const mo = new MutationObserver(()=>{
      if(!document.getElementById('cookie-consent')){
        document.body.classList.remove('has-cookie-banner');
      }
    });
    mo.observe(document.body, { childList: true });
  });
})();
