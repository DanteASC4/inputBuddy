import { browser } from 'wxt/browser';

//? Icon change signals
export const sigDefault = async () =>
  await browser.runtime.sendMessage({ type: 'I_DEFAULT' });
export const sigWarn = async () =>
  await browser.runtime.sendMessage({ type: 'I_WARN' });
export const sigClearWarn = async () =>
  await browser.runtime.sendMessage({ type: 'I_CLEARWARN' });
export const sigGreen = async () =>
  await browser.runtime.sendMessage({ type: 'I_GREEN' });

//? Scan signals
export const sigStartAutoScan = async () =>
  await browser.runtime.sendMessage({ type: 'START_AUTOSCAN' });
export const sigStopAutoScan = async () =>
  await browser.runtime.sendMessage({ type: 'STOP_AUTOSCAN' });
export const sigScanNow = async () =>
  await browser.runtime.sendMessage({ type: 'SCAN_NOW' });

//? Title change signal
export const sigSetTitle = async (title: string) =>
  await browser.runtime.sendMessage({ type: 'EXT_TITLE', title });
