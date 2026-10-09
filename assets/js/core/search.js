/**
 * File: search.js
 * Description: Global search filter for the portal.
 *
 * Provides real-time filtering of cards and links based on the input of the search bar
 * (injected by nav.js, which must therefore be imported before this module). It searches through:
 * - Card elements (.card)
 * - List items with data-category attributes (li[data-category])
 */

/**
 * Normalizes text for search comparison by removing accents and converting to lowercase.
 * @param {string} str The text to normalize.
 * @returns {string} The normalized text.
 */
function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Hides sections that have no visible cards or list items. */
function updateSectionVisibility() {
  document.querySelectorAll('main section').forEach(section => {
    const searchables = section.querySelectorAll('.card, li[data-category]');
    // Keep sections visible if they have visible content or no searchable content.
    const hasContent = searchables.length === 0 ||
      Array.from(searchables).some(el => el.style.display !== 'none');
    section.style.display = hasContent ? '' : 'none';
  });
}

function initSearch() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  const searchables = Array.from(document.querySelectorAll('.card, li[data-category]'));

  // Store original display values to restore them when the search is cleared.
  const displayMap = new WeakMap();
  searchables.forEach(el => displayMap.set(el, window.getComputedStyle(el).display));

  /** Filters the elements according to the query. */
  function performSearch(query) {
    const normalizedQuery = normalize(query);
    const isEmpty = normalizedQuery.trim() === '';

    searchables.forEach(el => {
      const originalDisplay = displayMap.get(el) || '';
      if (isEmpty) {
        el.style.display = originalDisplay;
        return;
      }

      const matches = [
        el.textContent || el.innerText,
        el.getAttribute('data-category'),
        el.getAttribute('href')
      ].some(field => normalize(field).includes(normalizedQuery));

      el.style.display = matches ? originalDisplay : 'none';
    });

    updateSectionVisibility();
  }

  searchInput.addEventListener('input', e => performSearch(e.target.value));
  performSearch('');
}

// Registered after nav.js's own listener, so the search input already exists.
document.addEventListener('DOMContentLoaded', initSearch);
