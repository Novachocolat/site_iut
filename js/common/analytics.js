/**
 * File: analytics.js
 * Description: A lightweight analytics loader with consent gating and a simple event API.
 *
 * This script handles the initialization of Google Analytics (GA4) through Google Tag Manager (GTM).
 * It respects user consent by waiting for a `consentchange` event or checking `window.__consentGranted`.
 * Events tracked before initialization are queued and sent once consent is granted and the library is ready.
 *
 * It exposes a global `window.Analytics` object with two main methods:
 * - `init()`: Initializes the connection to GTM if consent is granted.
 * - `track(name, params)`: Tracks a custom event.
 */
(function() {
  const Analytics = {
    ready: false, // Flag to indicate if the analytics library (GTM) is loaded.
    queue: [],    // Holds events that are tracked before the library is ready.

    /**
     * Initializes analytics.
     * It checks for consent and the GA_ID, then loads the GTM script.
     * Once ready, it processes any queued events.
     */
    init() {
      if (this.ready) return;
      if (!window.__consentGranted) return; // Abort if consent has not been granted.

      // Get the Google Analytics ID from the environment variables.
      const GA_ID = (window.__ENV__ && (window.__ENV__.GA_ID || window.__ENV__.GA_MEASUREMENT_ID)) || '';

      if (GA_ID) {
        // Standard GTM loader script.
        (function(w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
          var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', GA_ID);

        // Initialize dataLayer and gtag function for GA4.
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
        this.ready = true;
      } else {
        // If no GA_ID is configured, mark as ready to drain the queue (events will be no-ops).
        this.ready = true;
      }

      // Process any events that were queued before initialization.
      while (this.queue.length) {
        const { name, params } = this.queue.shift();
        this.track(name, params);
      }
    },

    /**
     * Tracks an event with a name and optional parameters.
     * If the library is not ready, the event is added to the queue.
     * @param {string} name The name of the event.
     * @param {object} [params={}] Optional parameters to send with the event.
     */
    track(name, params = {}) {
      if (!this.ready) {
        this.queue.push({ name, params });
        return;
      }

      // If gtag is available, send the event to Google Analytics.
      if (typeof window.gtag === 'function') {
        try {
          window.gtag('event', name, params);
        } catch (e) {
          // Ignore errors in case of ad-blockers or other issues.
        }
      } else {
        // Fallback for debugging if analytics is not fully initialized.
        if (window.__ENV__ && window.__ENV__.DEBUG_ANALYTICS === '1') {
          try {
            console.debug('[analytics]', name, params);
          } catch (e) {}
        }
      }
    }
  };

  // Expose the Analytics object to the window.
  window.Analytics = Analytics;

  // Attempt to initialize on DOMContentLoaded and when consent status changes.
  document.addEventListener('DOMContentLoaded', function() {
    if (window.__consentGranted) Analytics.init();
  });

  // Listen for a custom event that signals a change in user consent.
  window.addEventListener('consentchange', function(e) {
    if (e && e.detail && e.detail.granted) {
      Analytics.init();
    }
  });
})();
