/*
Copyright (C) 2026 Dante Rivera

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import "./app.css";

import InjectedMenu from "@c/InjectedMenu.svelte";
import { fillInput, getLabelCandidates, isEligibleInput } from "@u/eles";
import { findBestAnswer } from "@u/matching";
import { getAnswers, getLastProfile, getSettings } from "@u/storage";
import { infoLog } from "@u/styled-log";
import { mount, unmount } from "svelte";
import { browser } from "wxt/browser";

import { ContentScriptContext } from "#imports";
import { Contentstate, ScannerOutcome } from "$lib/stores/content.svelte";

const INPUT_SELECTOR =
  'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="search"], textarea';

const SCAN_DEBOUNCE_MS = 250;
const PARTIAL_MATCH_THRESHOLD = 0.65;

let floatingMenu: Awaited<ReturnType<typeof createShadowRootUi>> | null = null;

const mountFloatingMenu = async (ctx: ContentScriptContext) => {
  if (floatingMenu) return;

  floatingMenu = await createShadowRootUi(ctx, {
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

  floatingMenu.mount();
};

const unmountFloatingMenu = () => {
  floatingMenu?.remove();
  floatingMenu = null;
};

const nodeEligible = (n: Node): boolean => {
  if (!(n instanceof Element)) return false;
  if (n.matches(INPUT_SELECTOR)) return true;
  return Boolean(n.querySelector(INPUT_SELECTOR));
};

const mutationEligible = (mutation: MutationRecord): boolean => {
  if (mutation.type === "childList") {
    return Array.from(mutation.addedNodes).some(nodeEligible);
  }
  if (mutation.type === "attributes") {
    const target = mutation.target;
    if (!(target instanceof Element)) return false;
    if (target.matches(INPUT_SELECTOR)) return true;
    if (target.matches("label")) return true;
  }
  return false;
};

const resetScanState = () => {
  Contentstate.seenInputs = new WeakSet();
  ScannerOutcome.notFilled = new WeakMap();
  ScannerOutcome.filled = [];
};

const reloadAndRescan = async () => {
  await loadContentAnswers();
  resetScanState();
  const settings = await getSettings();
  if (settings.enabled && settings.autoFillEnabled) {
    scheduleScan();
  }
};

const loadContentAnswers = async () => {
  const profile = (await getLastProfile()) ?? "default";
  Contentstate.profile = profile;
  Contentstate.answers = await getAnswers(profile);
  Contentstate.indicateFilled = (await getSettings()).indicateFilled;
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
    if (Contentstate.seenInputs.has(element)) continue;

    const candidates = getLabelCandidates(element);
    if (!candidates.length) continue;
    Contentstate.seenInputs.add(element);

    const winners = findBestAnswer(candidates, answers, settings.matchMode);
    if (!winners.first) continue;

    // NOTE may need to tweak this!
    const threshold =
      settings.matchMode === "exact" ? 1 : PARTIAL_MATCH_THRESHOLD;

    if (winners.first.score < threshold) {
      ScannerOutcome.notFilled.set(element, winners);
      continue;
    }

    fillInput(element, winners.first.answer.value);

    ScannerOutcome.filled.push(element);
  }
};

//  ▄████████  ▄██████▄  ███▄▄▄▄       ███        ▄████████ ███▄▄▄▄       ███
// ███    ███ ███    ███ ███▀▀▀██▄ ▀█████████▄   ███    ███ ███▀▀▀██▄ ▀█████████▄
// ███    █▀  ███    ███ ███   ███    ▀███▀▀██   ███    █▀  ███   ███    ▀███▀▀██
// ███        ███    ███ ███   ███     ███   ▀  ▄███▄▄▄     ███   ███     ███   ▀
// ███        ███    ███ ███   ███     ███     ▀▀███▀▀▀     ███   ███     ███
// ███    █▄  ███    ███ ███   ███     ███       ███    █▄  ███   ███     ███
// ███    ███ ███    ███ ███   ███     ███       ███    ███ ███   ███     ███
// ████████▀   ▀██████▀   ▀█   █▀     ▄████▀     ██████████  ▀█   █▀     ▄████▀
//

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    // ? Filling & Scanning
    let observer: MutationObserver | null = null;
    const startAuto = () => {
      if (observer) return;
      observer = new MutationObserver((mutations) => {
        const hasNewNodes = mutations.some(mutationEligible);
        if (hasNewNodes) scheduleScan();
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "placeholder",
          "aria-label",
          "aria-labelledby",
          "name",
          "id",
          "for",
        ],
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

      const settings = await getSettings();
      const activeProfile = (await getLastProfile()) ?? "default";
      const settingsChanged = "settings" in changes;
      const profileChanged = "profiles" in changes || "lastProfile" in changes;
      const answersChanged = activeProfile in changes;

      if (settingsChanged) {
        if (!settings.enabled || !settings.autoFillEnabled) {
          stopAuto();
          await loadContentAnswers();
          resetScanState();
        } else {
          startAuto();
          await reloadAndRescan();
        }

        if (settings.enabled && settings.floatingMenuEnabled) {
          await mountFloatingMenu(ctx);
        } else {
          unmountFloatingMenu();
        }
        return;
      }

      if (profileChanged || answersChanged) {
        await reloadAndRescan();
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
      if (settings.enabled && settings.autoFillEnabled) {
        startAuto();
      }

      if (settings.enabled && settings.floatingMenuEnabled) {
        await mountFloatingMenu(ctx);
      }
    })();
  },
});
