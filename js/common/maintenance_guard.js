/**
 * File: maintenance_guard.js
 * Description: A global script to enforce maintenance mode.
 *
 * This script checks a configuration variable to determine if the site is in maintenance mode.
 * If maintenance is active, it redirects the user to `maintenance.html`.
 * 
 * To enable maintenance mode, set MAINTENANCE_MODE to true in this file.
 */
(function() {
  // Configuration: Set to true to enable maintenance mode
  const MAINTENANCE_MODE = false;

  /**
   * A helper function to run a callback once the DOM is fully loaded.
   * @param {function} fn The function to execute.
   */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /**
   * Checks if the current page is the maintenance page.
   * @returns {boolean} True if the current page is maintenance.html.
   */
  function isMaintenancePage() {
    return /maintenance\.html$/i.test(location.pathname);
  }

  /**
   * Gets the current URL, including path, search, and hash.
   * @returns {string} The current URL.
   */
  function currentUrl() {
    try {
      return location.pathname + location.search + location.hash;
    } catch {
      return '/';
    }
  }

  /**
   * Checks the maintenance status and performs a redirect if needed.
   */
  function checkMaintenanceStatus() {
    try {
      // If maintenance is active and the user is not already on the maintenance page, redirect.
      if (MAINTENANCE_MODE && !isMaintenancePage()) {
        const returnUrl = encodeURIComponent(currentUrl());
        location.replace('maintenance.html?from=' + returnUrl);
      }
    } catch (e) {
      console.warn('[MaintenanceGuard] Error:', e);
    }
  }

  // Run the check once the DOM is ready.
  onReady(checkMaintenanceStatus);
})();
