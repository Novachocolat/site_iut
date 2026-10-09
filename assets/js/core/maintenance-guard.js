/**
 * File: maintenance-guard.js
 * Description: A global script to enforce maintenance mode.
 *
 * If maintenance is active, visitors are redirected to `/pages/maintenance.html`
 * (with the original URL in the `from` query parameter).
 *
 * To enable maintenance mode, set MAINTENANCE_MODE to true in this file.
 */
const MAINTENANCE_MODE = false;
const MAINTENANCE_URL = '/pages/maintenance.html';

/** @returns {boolean} True if the current page is the maintenance page. */
function isMaintenancePage() {
  return /maintenance\.html$/i.test(location.pathname);
}

/** @returns {string} The current URL, including path, search, and hash. */
function currentUrl() {
  try {
    return location.pathname + location.search + location.hash;
  } catch (e) {
    return '/';
  }
}

/** Redirects to the maintenance page when maintenance mode is active. */
function checkMaintenanceStatus() {
  try {
    if (MAINTENANCE_MODE && !isMaintenancePage()) {
      location.replace(`${MAINTENANCE_URL}?from=${encodeURIComponent(currentUrl())}`);
    }
  } catch (e) {
    console.warn('[MaintenanceGuard] Error:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkMaintenanceStatus);
} else {
  checkMaintenanceStatus();
}
