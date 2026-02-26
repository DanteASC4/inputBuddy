import { fillInput, getLabelCandidates, isEligibleInput } from '@u/eles';
import { findMatchingAnswer } from '@u/matching';
import { getAnswers, getSettings } from '@u/storage';
import { browser } from 'wxt/browser';

const INPUT_SELECTOR =
  'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="search"], textarea';

const SCAN_DEBOUNCE_MS = 250;
const PARTIAL_MATCH_THRESHOLD = 0.78;

let scanTimeout: number | null = null;
const scheduleScan = () => {
  if (scanTimeout) window.clearTimeout(scanTimeout);
  scanTimeout = window.setTimeout(() => {
    scanTimeout = null;
    scanAndFill();
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
