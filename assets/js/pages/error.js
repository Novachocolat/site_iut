/**
 * File: error.js
 * Description: Entry point of the 404 and 500 error pages.
 *
 * - Moves focus to the main content for keyboard and screen reader users.
 * - Makes any `[data-action="reload"]` button reload the page.
 */
import '../core/maintenance-guard.js';
import '../core/nav.js';

window.addEventListener('load', () => {
  const mainContent = document.getElementById('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus({ preventScroll: true });
  }
});

document.querySelectorAll('[data-action="reload"]').forEach(btn => {
  btn.addEventListener('click', () => location.reload());
});
