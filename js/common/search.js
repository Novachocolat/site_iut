/**
 * File: search.js
 * Description: Global search filter for the portal.
 *
 * This script provides real-time filtering of cards and links based on user input
 * in the search bar. It searches through:
 * - Card elements (.card)
 * - List items with data-category attributes
 * - Links in regulation/report sections
 */
(function() {
  /**
   * Normalizes text for search comparison by removing accents and converting to lowercase.
   * @param {string} str The text to normalize.
   * @returns {string} The normalized text.
   */
  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Initializes the search functionality.
   */
  function initSearch() {
    // Wait for the search input to be available (injected by nav.js)
    const searchInput = document.getElementById('search');
    if (!searchInput) {
      // Retry after a short delay if not yet available
      setTimeout(initSearch, 100);
      return;
    }

    // Get all searchable elements
    const cards = Array.from(document.querySelectorAll('.card'));
    const listItems = Array.from(document.querySelectorAll('li[data-category]'));
    const allSearchables = [...cards, ...listItems];

    // Store original display values
    const displayMap = new WeakMap();
    allSearchables.forEach(el => {
      displayMap.set(el, window.getComputedStyle(el).display);
    });

    /**
     * Performs the search and filters elements.
     * @param {string} query The search query.
     */
    function performSearch(query) {
      const normalizedQuery = normalize(query);
      const isEmpty = normalizedQuery.trim() === '';

      allSearchables.forEach(el => {
        if (isEmpty) {
          // Show all elements when search is empty
          el.style.display = displayMap.get(el) || '';
          return;
        }

        // Get searchable text from the element
        const text = normalize(el.textContent || el.innerText || '');
        const category = normalize(el.getAttribute('data-category') || '');
        const href = normalize(el.getAttribute('href') || '');

        // Check if any of the searchable fields match the query
        const matches = text.includes(normalizedQuery) || 
                        category.includes(normalizedQuery) || 
                        href.includes(normalizedQuery);

        el.style.display = matches ? (displayMap.get(el) || '') : 'none';
      });

      // Show/hide empty sections
      updateSectionVisibility();
    }

    /**
     * Hides sections that have no visible cards or list items.
     */
    function updateSectionVisibility() {
      const sections = document.querySelectorAll('main section');
      sections.forEach(section => {
        const visibleCards = Array.from(section.querySelectorAll('.card')).some(card => 
          card.style.display !== 'none'
        );
        const visibleListItems = Array.from(section.querySelectorAll('li[data-category]')).some(li => 
          li.style.display !== 'none'
        );
        const hasContent = section.querySelectorAll('.card, li[data-category]').length === 0 || 
                           visibleCards || visibleListItems;

        // Keep sections visible if they have visible content or no searchable content
        section.style.display = hasContent ? '' : 'none';
      });
    }

    // Attach event listener to the search input
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    // Initial state: show everything
    performSearch('');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
