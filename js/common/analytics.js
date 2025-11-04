(function(){
  /**
   * Lightweight analytics loader with consent gating and simple event API
   * - Initializes GA4 via GTM if GA_ID/GA_MEASUREMENT_ID provided in window.__ENV__
   * - Respects cookie consent (window.__consentGranted), queues events until ready
   * - Exposes window.Analytics with init() and track(name, params) APIs
   */
  const Analytics = {
    ready: false,
    queue: [],
    /** Initialize analytics, reading env and draining queued events */
    init(){
      if (this.ready) return;
      if (!window.__consentGranted) return; // only init after consent
      // Prefer GA4 if configured via env
      const GA_ID = (window.__ENV__ && (window.__ENV__.GA_ID || window.__ENV__.GA_MEASUREMENT_ID)) || '';
      if (GA_ID) {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',GA_ID);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){ window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
        this.ready = true;
      } else {
        // No GA configured, just mark as ready to drain queue (no-op tracking)
        this.ready = true;
      }
      // Drain any queued events
      while (this.queue.length) {
        const {name, params} = this.queue.shift();
        this.track(name, params);
      }
    },
    /** Track an event by name with optional params */
    track(name, params={}){
      if (!this.ready) { this.queue.push({name, params}); return; }
      // GA4 mapping if available
      if (typeof window.gtag === 'function') {
        try { window.gtag('event', name, params); } catch {}
      } else {
        // Fallback: noop or console debug
        if (window.__ENV__ && window.__ENV__.DEBUG_ANALYTICS === '1') {
          try { console.debug('[analytics]', name, params); } catch {}
        }
      }
    }
  };

  window.Analytics = Analytics;

  // Attempt init on load and on consent change
  document.addEventListener('DOMContentLoaded', function(){
    if (window.__consentGranted) Analytics.init();
  });
  window.addEventListener('consentchange', function(e){
    if (e && e.detail && e.detail.granted) Analytics.init();
  });
})();
