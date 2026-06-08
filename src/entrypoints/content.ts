import "./app.css";

import InjectedMenu from "@c/InjectedMenu.svelte";
import { fillInput, getLabelCandidates, isEligibleInput } from "@u/eles";
import { findBestAnswer } from "@u/matching";
import { getAnswers, getLastProfile, getSettings } from "@u/storage";
import { infoLog } from "@u/styled-log";
import { mount, unmount } from "svelte";
import { browser } from "wxt/browser";

import { Appstate } from "$lib/state.svelte";
import { Contentstate, ScannerOutcome } from "$lib/stores/content.svelte";

const INPUT_SELECTOR =
  'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="search"], textarea';

const SCAN_DEBOUNCE_MS = 250;
const PARTIAL_MATCH_THRESHOLD = 0.78;

const loadContentAnswers = async () => {
  const profile = (await getLastProfile()) ?? "default";
  Contentstate.profile = profile;
  Contentstate.answers = await getAnswers(profile);
  Contentstate.indicateFilled = Appstate.settings.indicateFilled;
};

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

  infoLog("Got settings:", settings);

  const profile = (await getLastProfile()) ?? "default";
  const answers = await getAnswers(profile);
  if (!answers.length) return;

  infoLog("Got answers:", answers);

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

    const winners = findBestAnswer(candidates, answers, settings.matchMode);
    if (!winners.first) continue;

    // NOTE may need to tweak this!
    const threshold =
      settings.matchMode === "exact" ? 1 : PARTIAL_MATCH_THRESHOLD;

    if (winners.first.score < threshold) {
      // ScannerOutcome.notFilled.push(element);
      // console.group("Not Filling:");
      // console.log(element);
      // console.log(winners);
      // console.groupEnd();
      ScannerOutcome.notFilled.set(element, winners);
      continue;
    }

    fillInput(element, winners.first.answer.value);

    ScannerOutcome.filled.push(element);
    // Filled.elements.push(element);
    // Filled.elements.set(element, {
    //   answer: winners.first.answer.value,
    //   label: winners.first.answer.label,
    // });
  }
};

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    // ? Filling & Scanning
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

    await loadContentAnswers();

    browser.storage.onChanged.addListener(async (changes, areaName) => {
      if (areaName !== "local") return;

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

        const activeProfile = (await getLastProfile()) ?? "default";
        if (changes[activeProfile]) {
          scheduleScan();
        }

        if (
          changes?.profiles ||
          changes?.lastProfile ||
          changes[activeProfile]
        ) {
          await loadContentAnswers();
        }
      }
    });

    browser.runtime.onMessage.addListener((msg) => {
      console.log("Content script received message:", msg);
      if (msg && typeof msg === "object" && "type" in msg) {
        if (msg.type === "START_AUTO") startAuto();
        if (msg.type === "STOP_AUTO") stopAuto();
        if (msg.type === "SCAN_NOW") scheduleScan();
      }
    });

    (async () => {
      const settings = await getSettings();
      if (settings.enabled) {
        startAuto();
      }
    })();

    //? Injected Menu
    const ui = await createShadowRootUi(ctx, {
      name: "inputbuddy-menu",
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        return mount(InjectedMenu, { target: container });
      },
      onRemove: (app) => {
        if (app) unmount(app);
      },
    });

    ui.mount();
  },
});
