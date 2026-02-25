export type Answer = {
  id: string;
  label: string;
  value: string;
  updatedAt: number;
};

export type MatchMode = 'exact' | 'partial' | 'suggest';

export type Settings = {
  enabled: boolean;
  matchMode: MatchMode;
};

export type AutofillSettingsProps = {};

export type AnswerFormProps = {
  suggestions: readonly string[];
};

export type AnswerListProps = {};

export type AppState = {
  answers: Answer[];
  settings: Settings;
  isSaving: boolean;
  saveError: string;
  loadAnswers: () => Promise<void>;
  loadSettings: () => Promise<void>;
  init: () => Promise<void>;
  saveAnswer: (label: string, value: string) => Promise<void>;
  removeAnswer: (id: string) => Promise<void>;
  changeSettings: (settings: Partial<Settings>) => Promise<void>;
};
