import { browser } from 'wxt/browser';

const setWarn = async () => {
  await browser.action.setBadgeText({
    text: '⚠️',
  });
};

const clearWarnBadge = async () => {
  await browser.action.setBadgeText({ text: '' });
};

const setGreenIcon = async () => {
  await browser.action.setIcon({
    path: {
      16: '/icon/inputbuddy_green16.png',
      32: '/icon/inputbuddy_green32.png',
      48: '/icon/inputbuddy_green48.png',
      96: '/icon/inputbuddy_green96.png',
      128: '/icon/inputbuddy_green128.png',
    },
  });
};

const setDefaultIcon = async () => {
  await browser.action.setIcon({
    path: {
      16: '/icons/16.png',
      32: '/icons/32.png',
      48: '/icons/48.png',
      128: '/icons/128.png',
    },
  });
};

const setTitle = async (title: string) => {
  await browser.action.setTitle({ title });
};

const isRecommendedDomain = (check: URL | null) => {
  if (!check) return false;
  const ghReg = /job-boards\.greenhouse\.io$/g;
  const ahReg = /ashbyhq\.com$/g;

  return ghReg.test(check.hostname) || ahReg.test(check.hostname);
};

export default defineBackground(() => {
  console.log('InputBuddy ready!', { id: browser.runtime.id });
});

browser.runtime.onMessage.addListener(async (message) => {
  if ('type' in message) {
    if (message.type === 'I_DEFAULT') await setDefaultIcon();
    if (message.type === 'I_WARN') await setWarn();
    if (message.type === 'I_CLEARWARN') await clearWarnBadge();
    if (message.type === 'I_GREEN') await setGreenIcon();
    if (message.type === 'EXT_TITLE' && 'title' in message) {
      const title = message.title;
      await setTitle(title);
    }
  }
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  console.log(changeInfo.url);
  const actual = changeInfo.url ? new URL(changeInfo.url) : null;
  if (isRecommendedDomain(actual)) {
    await setGreenIcon();
    await setTitle('InputBuddy - Recommended Site');
  } else {
    await setDefaultIcon();
    await setTitle('InputBuddy');
  }
});
