/**
 * File: theme.js
 * Description: Light/dark theme helpers shared by the site.
 *
 * The theme is stored in `localStorage` under the "theme" key and applied as a
 * `data-theme` attribute on the <html> element (see the CSS variables in base.css).
 */
const STORAGE_KEY = 'theme';
const DEFAULT_THEME = 'light';

/**
 * Reads the saved theme.
 * @returns {'light'|'dark'} The saved theme, or the default if none is available.
 */
export function getSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  } catch (e) {
    return DEFAULT_THEME;
  }
}

/**
 * Applies a theme to the document and persists it.
 * @param {'light'|'dark'} theme The theme to apply.
 * @param {{persist?: boolean}} [options] Set `persist: false` to skip saving.
 */
export function applyTheme(theme, { persist = true } = {}) {
  document.documentElement.setAttribute('data-theme', theme);
  if (!persist) return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    // Storage may be unavailable (private mode, blocked cookies): ignore.
  }
}

/**
 * Returns the toggle button icon for a theme (a moon to go dark, a sun to go light).
 * @param {'light'|'dark'} theme The current theme.
 * @returns {string} The icon markup.
 */
export function themeIcon(theme) {
  return theme === 'light'
    ? '<i class="fa-regular fa-moon"></i>'
    : '<i class="fa-regular fa-sun"></i>';
}
