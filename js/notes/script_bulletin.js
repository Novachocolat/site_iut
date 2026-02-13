/**
 * File: script_bulletin.js
 * Description: Handles user interaction on the grades/absences page (notes.html).
 *
 * This script adds an event listener to the INE input field.
 * When the user types, it tracks an analytics event once the input
 * reaches a certain length, providing a basic hint of user engagement.
 * Note: This script does not handle the actual fetching or display of grades.
 */
(function() {
  /**
   * Wires up the event listener for the INE input field.
   */
  function wireIneInput() {
    const ineInput = document.getElementById('ine');
    if (!ineInput) return;

    ineInput.addEventListener('input', function() {
      const value = (ineInput.value || '').trim();
      
      // When the input length suggests a valid INE, fire an analytics event.
      // This is a simple heuristic and not a strict validation.
      if (value.length >= 9) {
        try {
          if (window.Analytics) {
            window.Analytics.track('notes_ine_input', { len: value.length });
          }
        } catch (e) {
          // Ignore analytics errors.
        }
      }
    });
  }

  // Run the script once the DOM is fully loaded.
  document.addEventListener('DOMContentLoaded', wireIneInput);
})();
