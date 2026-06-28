import { DEFAULT_SETTINGS } from "@types";

type StyledLogArgs = Parameters<typeof console.log>;

let debugLoggingEnabled: boolean = DEFAULT_SETTINGS.debug;

export const setDebugLogging = (enabled: boolean) => {
  debugLoggingEnabled = enabled;
};

export const infoLog = (...args: StyledLogArgs) => {
  if (debugLoggingEnabled)
    console.log("%c[IB|INFO]", "color: cyan; font-weight: bold;", ...args);
};
export const warnLog = (...args: StyledLogArgs) => {
  if (debugLoggingEnabled)
    console.warn("%c[IB|WARN]", "color: orange; font-weight: bold;", ...args);
};
export const errorLog = (...args: StyledLogArgs) => {
  if (debugLoggingEnabled)
    console.error("%c[IB|ERROR]", "color: red; font-weight: bold;", ...args);
};
export const successLog = (...args: StyledLogArgs) => {
  if (debugLoggingEnabled)
    console.log("%c[IB|SUCCESS]", "color: green; font-weight: bold;", ...args);
};
