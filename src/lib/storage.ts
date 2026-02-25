import { browser } from 'wxt/browser';
import type { Answer, Settings } from './types';

const STORAGE_KEYS = {
  answers: 'answers',
  settings: 'settings',
} as const;

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  matchMode: 'partial',
};

const normalizeKey = (label: string) => label.trim().toLowerCase();

const isMatchMode = (s: string): s is Settings['matchMode'] =>
  s === 'exact' || s === 'partial' || s === 'suggest';

const coerceAnswers = (value: unknown): Answer[] => {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is Answer => {
    if (!item || typeof item !== 'object') return false;
    const record = item as Answer;
    return (
      typeof record.id === 'string' &&
      typeof record.label === 'string' &&
      typeof record.value === 'string' &&
      typeof record.updatedAt === 'number'
    );
  });
};

export const getAnswers = async (): Promise<Answer[]> => {
  const result = await browser.storage.local.get(STORAGE_KEYS.answers);
  return coerceAnswers(result[STORAGE_KEYS.answers]);
};

export const setAnswers = async (answers: Answer[]): Promise<void> => {
  await browser.storage.local.set({ [STORAGE_KEYS.answers]: answers });
};

export const upsertAnswer = async (
  label: string,
  value: string,
): Promise<Answer[]> => {
  const trimmedLabel = label.trim();
  const trimmedValue = value.trim();
  const answers = await getAnswers();
  const key = normalizeKey(trimmedLabel);
  const now = Date.now();
  const existingIndex = answers.findIndex(
    (answer) => normalizeKey(answer.label) === key,
  );

  if (existingIndex >= 0) {
    answers[existingIndex] = {
      ...answers[existingIndex],
      label: trimmedLabel,
      value: trimmedValue,
      updatedAt: now,
    };
  } else {
    answers.push({
      id: crypto.randomUUID(),
      label: trimmedLabel,
      value: trimmedValue,
      updatedAt: now,
    });
  }

  await setAnswers(answers);
  return answers;
};

export const deleteAnswer = async (id: string): Promise<Answer[]> => {
  const answers = await getAnswers();
  const nextAnswers = answers.filter((answer) => answer.id !== id);
  await setAnswers(nextAnswers);
  return nextAnswers;
};

export const getSettings = async (): Promise<Settings> => {
  const result = await browser.storage.local.get(STORAGE_KEYS.settings);
  const stored = result[STORAGE_KEYS.settings];
  const storedSettings = stored && typeof stored === 'object' ? stored : {};
  const enabled =
    typeof (storedSettings as Settings).enabled === 'boolean'
      ? (storedSettings as Settings).enabled
      : DEFAULT_SETTINGS.enabled;
  const matchMode = (storedSettings as Settings).matchMode;
  const validMatchMode = isMatchMode(matchMode);

  return {
    enabled,
    matchMode: validMatchMode ? matchMode : DEFAULT_SETTINGS.matchMode,
  };
};

export const updateSettings = async (
  partial: Partial<Settings>,
): Promise<Settings> => {
  const current = await getSettings();
  const next = { ...current, ...partial };
  await browser.storage.local.set({ [STORAGE_KEYS.settings]: next });
  return next;
};
