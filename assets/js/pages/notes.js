/**
 * File: notes.js
 * Description: Handles user interaction on the grades/absences page (notes.html).
 *
 * - Clears the INE field when it is clicked.
 * - Tracks an analytics event once the typed INE reaches a plausible length,
 *   providing a basic hint of user engagement.
 * Note: this script does not fetch or display grades.
 */
import '../core/maintenance-guard.js';
import '../core/nav.js';

const MIN_INE_LENGTH = 9; // Simple heuristic, not a strict validation.

function wireIneInput() {
  const ineInput = document.getElementById('ine');
  if (!ineInput) return;

  ineInput.addEventListener('click', () => { ineInput.value = ''; });

  ineInput.addEventListener('input', () => {
    const value = (ineInput.value || '').trim();
    if (value.length >= MIN_INE_LENGTH && window.Analytics) {
      window.Analytics.track('notes_ine_input', { len: value.length });
    }
  });
}

document.addEventListener('DOMContentLoaded', wireIneInput);
