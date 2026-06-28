import {
  type Answer,
  AnswerSchema,
  type Settings,
  SettingsSchema,
} from "@types";
import * as v from "valibot";
import { browser } from "wxt/browser";

//    ▄█    █▄       ▄████████  ▄█          ▄███████▄    ▄████████    ▄████████    ▄████████
//   ███    ███     ███    ███ ███         ███    ███   ███    ███   ███    ███   ███    ███
//   ███    ███     ███    █▀  ███         ███    ███   ███    █▀    ███    ███   ███    █▀
//  ▄███▄▄▄▄███▄▄  ▄███▄▄▄     ███         ███    ███  ▄███▄▄▄      ▄███▄▄▄▄██▀   ███
// ▀▀███▀▀▀▀███▀  ▀▀███▀▀▀     ███       ▀█████████▀  ▀▀███▀▀▀     ▀▀███▀▀▀▀▀   ▀███████████
//   ███    ███     ███    █▄  ███         ███          ███    █▄  ▀███████████          ███
//   ███    ███     ███    ███ ███▌    ▄   ███          ███    ███   ███    ███    ▄█    ███
//   ███    █▀      ██████████ █████▄▄██  ▄████▀        ██████████   ███    ███  ▄████████▀
//                             ▀                                     ███    ███

const STORAGE_KEYS = {
  profiles: "profiles",
  settings: "settings",
  lastProfile: "lastProfile",
  inputsAutoFilled: "inputsAutoFilled",
  charactersAutoFilled: "charactersAutoFilled",
} as const;

const defaultAnswerProfiles = ["default"];

const normalizeKey = (label: string) => label.trim().toLowerCase();

const coerceAnswers = (value: unknown): Answer[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Answer => v.is(AnswerSchema, item));
};

const resetAllStorageKeys = async (): Promise<void> => {
  const allKeys = Object.keys(await browser.storage.local.get(null));
  if (allKeys.length) {
    await browser.storage.local.remove(allKeys);
  }
};

//    ▄███████▄    ▄████████  ▄██████▄     ▄████████  ▄█   ▄█          ▄████████    ▄████████
//   ███    ███   ███    ███ ███    ███   ███    ███ ███  ███         ███    ███   ███    ███
//   ███    ███   ███    ███ ███    ███   ███    █▀  ███▌ ███         ███    █▀    ███    █▀
//   ███    ███  ▄███▄▄▄▄██▀ ███    ███  ▄███▄▄▄     ███▌ ███        ▄███▄▄▄       ███
// ▀█████████▀  ▀▀███▀▀▀▀▀   ███    ███ ▀▀███▀▀▀     ███▌ ███       ▀▀███▀▀▀     ▀███████████
//   ███        ▀███████████ ███    ███   ███        ███  ███         ███    █▄           ███
//   ███          ███    ███ ███    ███   ███        ███  ███▌    ▄   ███    ███    ▄█    ███
//  ▄████▀        ███    ███  ▀██████▀    ███        █▀   █████▄▄██   ██████████  ▄████████▀
//                ███    ███                              ▀

export const setLastProfile = async (profile: string): Promise<void> => {
  await browser.storage.local.set({ [STORAGE_KEYS.lastProfile]: profile });
};

export const getLastProfile = async (): Promise<string | null> => {
  const result = await browser.storage.local.get(STORAGE_KEYS.lastProfile);
  const profile = result[STORAGE_KEYS.lastProfile];
  return typeof profile === "string" ? profile : null;
};

export const getAnswerProfiles = async (): Promise<string[]> => {
  const profiles = await browser.storage.local.get(STORAGE_KEYS.profiles);
  //? "profiles" returns an array of profile names, each profile name is key to an array of answers.

  const stored = profiles[STORAGE_KEYS.profiles];
  if (!stored) {
    await browser.storage.local.set({
      [STORAGE_KEYS.profiles]: defaultAnswerProfiles,
    });
    return defaultAnswerProfiles;
  }

  if (!Array.isArray(stored)) {
    console.error(
      "Invalid data for answer profiles. Non array saved under storage key.",
    );
    console.log(stored);
    await resetAllStorageKeys();
    await browser.storage.local.set({
      [STORAGE_KEYS.profiles]: defaultAnswerProfiles,
    });
    return defaultAnswerProfiles;
  }

  if (!stored.every((item) => typeof item === "string")) {
    console.error(
      "Invalid data in answer profiles! Expected array of strings.",
    );
    console.log(stored);
    await resetAllStorageKeys();
    await browser.storage.local.set({
      [STORAGE_KEYS.profiles]: defaultAnswerProfiles,
    });
    return defaultAnswerProfiles;
  }

  return stored;
};

export const saveNewProfile = async (profile: string): Promise<string[]> => {
  const trimmed = profile.trim();
  if (!trimmed) return getAnswerProfiles();

  const profiles = await getAnswerProfiles();
  if (profiles.includes(trimmed)) return profiles;

  const nextProfiles = [...profiles, trimmed];
  await browser.storage.local.set({
    [STORAGE_KEYS.profiles]: nextProfiles,
  });
  await browser.storage.local.set({ [trimmed]: [] });
  return nextProfiles;
};

export const deleteProfile = async (profile: string): Promise<string[]> => {
  const profiles = await getAnswerProfiles();
  if (!profiles.includes(profile)) return profiles;
  const nextProfiles = profiles.filter((p) => p !== profile);
  await browser.storage.local.set({
    [STORAGE_KEYS.profiles]: nextProfiles,
  });
  await browser.storage.local.remove(profile);
  return nextProfiles;
};

//    ▄████████ ███▄▄▄▄      ▄████████  ▄█     █▄     ▄████████    ▄████████    ▄████████
//   ███    ███ ███▀▀▀██▄   ███    ███ ███     ███   ███    ███   ███    ███   ███    ███
//   ███    ███ ███   ███   ███    █▀  ███     ███   ███    █▀    ███    ███   ███    █▀
//   ███    ███ ███   ███   ███        ███     ███  ▄███▄▄▄      ▄███▄▄▄▄██▀   ███
// ▀███████████ ███   ███ ▀███████████ ███     ███ ▀▀███▀▀▀     ▀▀███▀▀▀▀▀   ▀███████████
//   ███    ███ ███   ███          ███ ███     ███   ███    █▄  ▀███████████          ███
//   ███    ███ ███   ███    ▄█    ███ ███ ▄█▄ ███   ███    ███   ███    ███    ▄█    ███
//   ███    █▀   ▀█   █▀   ▄████████▀   ▀███▀███▀    ██████████   ███    ███  ▄████████▀
//                                                                ███    ███

export const getInputsAutoFilled = async () => {
  const inputsAutoFilled = await browser.storage.local.get(
    STORAGE_KEYS.inputsAutoFilled,
  );

  const actual = inputsAutoFilled[STORAGE_KEYS.inputsAutoFilled];
  if (!actual) {
    await browser.storage.local.set({
      [STORAGE_KEYS.inputsAutoFilled]: 0,
    });
    return 0;
  }
  return actual as number;
};

export const getCharsAutoFilled = async () => {
  const charsAutoFilled = await browser.storage.local.get(
    STORAGE_KEYS.charactersAutoFilled,
  );
  const actual = charsAutoFilled[STORAGE_KEYS.charactersAutoFilled];
  if (!actual) {
    await browser.storage.local.set({
      [STORAGE_KEYS.charactersAutoFilled]: 0,
    });
    return 0;
  }
  return actual as number;
};

export const incrementInputsAutoFilled = async (count = 1) => {
  const current = await getInputsAutoFilled();
  const next = current + count;
  await browser.storage.local.set({
    [STORAGE_KEYS.inputsAutoFilled]: next,
  });
  return next;
};

export const incrementCharsAutoFilled = async (count = 1) => {
  const current = await getCharsAutoFilled();
  const next = current + count;
  await browser.storage.local.set({
    [STORAGE_KEYS.charactersAutoFilled]: next,
  });
  return next;
};

export const getAnswers = async (
  profile: string = "default",
): Promise<Answer[]> => {
  const profiles = await getAnswerProfiles();
  if (!profiles.includes(profile)) {
    await browser.storage.local.set({
      [STORAGE_KEYS.profiles]: [...profiles, profile],
    });
  }

  const result = await browser.storage.local.get(profile);
  const stored = result[profile];

  if (!stored) {
    await browser.storage.local.set({ [profile]: [] });
    return [];
  }

  if (!Array.isArray(stored)) {
    console.error(
      "Invalid data for answers. Expected array saved under profile key.",
    );
    console.log(stored);
    await browser.storage.local.set({ [profile]: [] });
    return [];
  }

  return coerceAnswers(stored);
};

/**
 * Set answers for a given profile in storage.
 * @param profile - profile name, used as key for setting answers
 * @param answers - answer array, saved as value for profile
 */
export const setAnswers = async (
  profile: string,
  answers: Answer[],
): Promise<void> => {
  const profiles = await getAnswerProfiles();
  if (!profiles.includes(profile)) {
    await browser.storage.local.set({
      [STORAGE_KEYS.profiles]: [...profiles, profile],
    });
  }
  await browser.storage.local.set({ [profile]: answers });
};

export const upsertAnswer = async (
  profile: string,
  label: string,
  value: string,
  id?: string,
): Promise<Answer[]> => {
  const trimmedLabel = label.trim();
  const trimmedValue = value.trim();
  const answers = await getAnswers(profile);
  const key = normalizeKey(trimmedLabel);
  const existingIndex = id
    ? answers.findIndex((answer) => answer.id === id)
    : answers.findIndex((answer) => normalizeKey(answer.label) === key);

  if (existingIndex >= 0) {
    answers[existingIndex] = {
      ...answers[existingIndex],
      label: trimmedLabel,
      value: trimmedValue,
    };
  } else {
    answers.push({
      id: crypto.randomUUID(),
      label: trimmedLabel,
      value: trimmedValue,
    });
  }

  await setAnswers(profile, answers);
  return answers;
};

export const deleteAnswer = async (
  profile: string,
  id: string,
): Promise<Answer[]> => {
  const answers = await getAnswers(profile);
  const nextAnswers = answers.filter((answer) => answer.id !== id);
  await setAnswers(profile, nextAnswers);
  return nextAnswers;
};

//    ▄████████    ▄████████     ███         ███      ▄█  ███▄▄▄▄      ▄██████▄     ▄████████
//   ███    ███   ███    ███ ▀█████████▄ ▀█████████▄ ███  ███▀▀▀██▄   ███    ███   ███    ███
//   ███    █▀    ███    █▀     ▀███▀▀██    ▀███▀▀██ ███▌ ███   ███   ███    █▀    ███    █▀
//   ███         ▄███▄▄▄         ███   ▀     ███   ▀ ███▌ ███   ███  ▄███          ███
// ▀███████████ ▀▀███▀▀▀         ███         ███     ███▌ ███   ███ ▀▀███ ████▄  ▀███████████
//          ███   ███    █▄      ███         ███     ███  ███   ███   ███    ███          ███
//    ▄█    ███   ███    ███     ███         ███     ███  ███   ███   ███    ███    ▄█    ███
//  ▄████████▀    ██████████    ▄████▀      ▄████▀   █▀    ▀█   █▀    ████████▀   ▄████████▀
//

export const getSettings = async (): Promise<Settings> => {
  const result = await browser.storage.local.get(STORAGE_KEYS.settings);
  const stored = result[STORAGE_KEYS.settings];

  const storedSettings = v.safeParse(SettingsSchema, stored);

  if (!storedSettings.success) {
    return v.getFallbacks(SettingsSchema);
  } else {
    return {
      ...storedSettings.output,
    };
  }
};

export const updateSettings = async (
  partial: Partial<Settings>,
): Promise<Settings> => {
  const current = await getSettings();
  const next = { ...current, ...partial };
  await browser.storage.local.set({ [STORAGE_KEYS.settings]: next });
  return next;
};
