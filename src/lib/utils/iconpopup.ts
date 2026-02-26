import { browser } from 'wxt/browser';
export const sigDefault = async () =>
  await browser.runtime.sendMessage({ type: 'I_DEFAULT' });
export const sigWarn = async () =>
  await browser.runtime.sendMessage({ type: 'I_WARN' });
export const sigClearWarn = async () =>
  await browser.runtime.sendMessage({ type: 'I_CLEARWARN' });
export const sigGreen = async () =>
  await browser.runtime.sendMessage({ type: 'I_GREEN' });
