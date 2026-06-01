import { Appstate } from "$lib/state.svelte";

/* eslint-disable @typescript-eslint/no-explicit-any */
//this set of utils just builds on console methods which accept any so it's fine here
export const infoLog = (...args: any[]) => {
  if (Appstate.settings.debug)
    console.log("%c[INFO]", "color: cyan; font-weight: bold;", ...args);
};
export const warnLog = (...args: any[]) => {
  if (Appstate.settings.debug)
    console.warn("%c[WARN]", "color: orange; font-weight: bold;", ...args);
};
export const errorLog = (...args: any[]) => {
  if (Appstate.settings.debug)
    console.error("%c[ERROR]", "color: red; font-weight: bold;", ...args);
};
export const successLog = (...args: any[]) => {
  if (Appstate.settings.debug)
    console.log("%c[SUCCESS]", "color: green; font-weight: bold;", ...args);
};
