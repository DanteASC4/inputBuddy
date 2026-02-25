import { browser } from 'wxt/browser';
import { findMatchingAnswer } from '../lib/matching';
import { getAnswers, getSettings } from '../lib/storage';

const INPUT_SELECTOR =
  'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="search"], textarea';

const MAX_LABEL_LENGTH = 200;
const SCAN_DEBOUNCE_MS = 250;
const PARTIAL_MATCH_THRESHOLD = 0.78;

const cleanedLabel = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const cleaned = value.replace(/\s+/g, ' ').replace(/\*/g, '').trim();
  if (!cleaned) return null;
  return cleaned.slice(0, MAX_LABEL_LENGTH);
};

const isEligibleInput = (
  element: HTMLInputElement | HTMLTextAreaElement,
): boolean => {
  if (element instanceof HTMLInputElement) {
    const type = element.type.toLowerCase();
    if (['password', 'hidden', 'file', 'submit', 'button'].includes(type)) {
      return false;
    }
  }

  if (element.disabled || element.readOnly) return false;
  const style = window.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none') return false;

  return true;
};

const getLabelCandidates = (
  element: HTMLInputElement | HTMLTextAreaElement,
): string[] => {
  const candidates: string[] = [];

  if ('labels' in element && element.labels?.length) {
    for (const label of Array.from(element.labels)) {
      const cleaned = cleanedLabel(label.textContent);
      if (cleaned) candidates.push(cleaned);
    }
  }

  const closestLabel = element.closest('label');
  const closestLabelText = cleanedLabel(closestLabel?.textContent ?? null);
  if (closestLabelText) candidates.push(closestLabelText);

  const ariaLabel = cleanedLabel(element.getAttribute('aria-label'));
  if (ariaLabel) candidates.push(ariaLabel);

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const ids = ariaLabelledBy.split(/\s+/).filter(Boolean);
    for (const id of ids) {
      const labelled = document.getElementById(id);
      const labelledText = cleanedLabel(labelled?.textContent ?? null);
      if (labelledText) candidates.push(labelledText);
    }
  }

  const placeholder = cleanedLabel(element.getAttribute('placeholder'));
  if (placeholder) candidates.push(placeholder);

  const name = cleanedLabel(element.getAttribute('name'));
  if (name) candidates.push(name);

  return Array.from(new Set(candidates));
};

const fillInput = (
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) => {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dataset.inputbuddyFilled = 'true';
};

let scanTimeout: number | null = null;
const scheduleScan = () => {
  if (scanTimeout) window.clearTimeout(scanTimeout);
  scanTimeout = window.setTimeout(() => {
    scanTimeout = null;
    void scanAndFill();
  }, SCAN_DEBOUNCE_MS);
};

const scanAndFill = async () => {
  const settings = await getSettings();
  if (!settings.enabled) return;

  const answers = await getAnswers();
  if (!answers.length) return;

  const inputs = Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      INPUT_SELECTOR,
    ),
  );

  for (const element of inputs) {
    if (!isEligibleInput(element)) continue;
    if (element.value?.trim()) continue;

    const candidates = getLabelCandidates(element);
    if (!candidates.length) continue;

    const best = findMatchingAnswer(candidates, answers, settings.matchMode);
    if (!best) continue;

    const threshold =
      settings.matchMode === 'exact'
        ? 1
        : settings.matchMode === 'partial'
          ? PARTIAL_MATCH_THRESHOLD
          : 0;

    if (best.score < threshold) continue;

    fillInput(element, best.answer.value);
  }
};

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    const observer = new MutationObserver(() => scheduleScan());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return;
      if (changes.answers || changes.settings) scheduleScan();
    });

    scheduleScan();
  },
});
