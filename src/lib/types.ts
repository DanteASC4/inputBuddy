export type Answer = {
  id: string;
  label: string;
  value: string;
};

export type MatchResult = {
  answer: Answer;
  score: number;
  label: string;
};

export type MatchMode = "exact" | "similar" | "partial" | "fuzzy";

export type Settings = {
  enabled: boolean;
  matchMode: MatchMode;
  keepOpen: boolean;
  debug: boolean;
};

// export type AutofillSettingsProps = {};

// export type AnswerFormProps = {
// 	suggestions: readonly string[];
// };

// export type AnswerListProps = {};

// export type CollapseWrapperProps = {
// 	title: string;
// 	children?: Snippet;
// 	class?: ClassValue;
// };

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
  init: () => Promise<void>;
  saveAnswer: (label: string, value: string, id?: string) => Promise<void>;
  removeAnswer: (id: string) => Promise<void>;
  changeSettings: (settings: Partial<Settings>) => Promise<void>;
  switchProfile: (profile: string) => Promise<void>;
  switchsertProfile: (profile: string) => Promise<void>;
  delProfile: (profile: string) => Promise<void>;
};
