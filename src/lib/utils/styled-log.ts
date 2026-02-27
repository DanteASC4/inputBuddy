export const infoLog = (...args: any[]) => console.log('%c[INFO]', 'color: cyan; font-weight: bold;', ...args);
export const warnLog = (...args: any[]) => console.warn('%c[WARN]', 'color: orange; font-weight: bold;', ...args);
export const errorLog = (...args: any[]) => console.error('%c[ERROR]', 'color: red; font-weight: bold;', ...args);
export const successLog = (...args: any[]) => console.log('%c[SUCCESS]', 'color: green; font-weight: bold;', ...args);