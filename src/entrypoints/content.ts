import { fillInput, getLabelCandidates, isEligibleInput } from '@u/eles';
import { findMatchingAnswer } from '@u/matching';
import { getAnswers, getLastProfile, getSettings } from '@u/storage';
import { infoLog } from '@u/styled-log';
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

  infoLog('Got settings:', settings);

  const profile = (await getLastProfile()) ?? 'default';
  const answers = await getAnswers(profile);
  if (!answers.length) return;

  infoLog('Got answers:', answers);

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
    let observer: MutationObserver | null = null;
    const startAuto = () => {
      if (observer) return;
      observer = new MutationObserver(() => scheduleScan());
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
      scheduleScan();
    };

    const stopAuto = () => {
      observer?.disconnect();
      observer = null;
    };

    browser.storage.onChanged.addListener(async (changes, areaName) => {
      if (areaName !== 'local') return;

      if (changes.settings) {
        const settings = await getSettings();
        if (settings.enabled) {
          startAuto();
        } else {
          stopAuto();
        }
      }

      if (observer) {
        if (changes.profiles || changes.lastProfile || changes.default) {
          scheduleScan();
          return;
        }

        const activeProfile = (await getLastProfile()) ?? 'default';
        if (changes[activeProfile]) {
          scheduleScan();
        }
      }
    });

    browser.runtime.onMessage.addListener((msg) => {
      console.log('Content script received message:', msg);
      if (msg && typeof msg === 'object' && 'type' in msg) {
        if (msg.type === 'START_AUTO') startAuto();
        if (msg.type === 'STOP_AUTO') stopAuto();
        if (msg.type === 'SCAN_NOW') scheduleScan();
      }
    });

    void (async () => {
      const settings = await getSettings();
      if (settings.enabled) {
        startAuto();
      }
    })();
  },
});
// export default defineContentScript({
//   matches: ['<all_urls>'],
//   main() {
//     const observer = new MutationObserver(() => scheduleScan());
//     observer.observe(document.documentElement, {
//       childList: true,
//       subtree: true,
//       attributes: true,
//     });

//     browser.storage.onChanged.addListener((changes, areaName) => {
//       if (areaName !== 'local') return;
//       if (Appstate.settings.enabled === false) return;
//       if (changes.answers || changes.settings) scheduleScan();
//     });

//     scheduleScan();
//   },
// });
