import * as v from "valibot";

export const AnswerSchema = v.object({
  id: v.string(),
  label: v.string(),
  value: v.string(),
});

export type Answer = v.InferOutput<typeof AnswerSchema>;

export type MatchResult = {
  answer: Answer;
  score: number;
  label: string;
};

export type Winners = {
  first: MatchResult | null;
  second: MatchResult | null;
  third: MatchResult | null;
};

export const MatchModeSchema = v.picklist([
  "exact",
  "similar",
  "partial",
  "fuzzy",
]);

export type MatchMode = v.InferOutput<typeof MatchModeSchema>;

export const SettingsSchema = v.object({
  enabled: v.fallback(v.boolean(), true),
  autoFillEnabled: v.fallback(v.boolean(), true),
  floatingMenuEnabled: v.fallback(v.boolean(), true),
  matchMode: v.fallback(MatchModeSchema, "fuzzy"),
  fontStyle: v.fallback(v.picklist(["serif", "sans-serif"]), "serif"),
  keepOpen: v.fallback(v.boolean(), false),
  debug: v.fallback(v.boolean(), false),
  indicateFilled: v.fallback(v.boolean(), true),
});

export const DEFAULT_SETTINGS = v.getFallbacks(SettingsSchema);

export type Settings = v.InferOutput<typeof SettingsSchema>;

export type FillableElement = HTMLInputElement | HTMLTextAreaElement;
export type PartialMatchInfo = {
  bestAnswer: string;
  score: number;
};

export type AppState = {
  answers: Answer[];
  profiles: string[];
  settings: Settings;
  isSaving: boolean;
  saveError: string;
  currentProfile: string;
  loadAnswers: (profile?: string) => Promise<void>;
  loadSettings: () => Promise<void>;
  loadProfiles: () => Promise<void>;
  loadLastProfile: () => Promise<void>;
  init: () => Promise<true>;
  saveAnswer: (label: string, value: string, id?: string) => Promise<void>;
  removeAnswer: (id: string) => Promise<void>;
  changeSettings: (settings: Partial<Settings>) => Promise<void>;
  switchProfile: (profile: string) => Promise<void>;
  switchsertProfile: (profile: string) => Promise<void>;
  delProfile: (profile: string) => Promise<void>;
};

export type ScannerOutcomeShape = {
  filled: FillableElement[];
  notFilled: WeakMap<FillableElement, Winners>;
};

export type ContentState = {
  answers: Answer[];
  profile: string;
  indicateFilled: Settings["indicateFilled"];
  seenInputs: WeakSet<FillableElement>;
};
