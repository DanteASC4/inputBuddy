import { browser } from "wxt/browser";

const sendToActiveTab = async (message: { type: string }) => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  try {
    await browser.tabs.sendMessage(tab.id, message);
  } catch (error) {
    console.warn("Could not deliver message to active tab content script.", {
      message,
      error,
    });
  }
};

//? Icon change signals
export const sigDefault = async () =>
  await browser.runtime.sendMessage({ type: "I_DEFAULT" });
export const sigWarn = async () =>
  await browser.runtime.sendMessage({ type: "I_WARN" });
export const sigClearWarn = async () =>
  await browser.runtime.sendMessage({ type: "I_CLEARWARN" });
export const sigGreen = async () =>
  await browser.runtime.sendMessage({ type: "I_GREEN" });

//? Scan signals
export const sigStartAutoScan = async () =>
  await sendToActiveTab({ type: "START_AUTO" });
export const sigStopAutoScan = async () =>
  await sendToActiveTab({ type: "STOP_AUTO" });
export const sigScanNow = async () =>
  await sendToActiveTab({ type: "SCAN_NOW" });

//? Title change signal
export const sigSetTitle = async (title: string) =>
  await browser.runtime.sendMessage({ type: "EXT_TITLE", title });
