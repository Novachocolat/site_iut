/**
 * File: theme-init.js
 * Description: Classic (non-module) script loaded in the <head> of the error pages.
 *
 * It applies the saved theme before the first paint to avoid a "flash of incorrect theme".
 * Must stay a blocking script: do not add `type="module"`, `defer` or `async`.
 */
(function() {
  var theme = 'light';
  try {
    theme = localStorage.getItem('theme') || 'light';
  } catch (e) {
    // localStorage unavailable: keep the default theme.
  }
  document.documentElement.setAttribute('data-theme', theme);
})();
