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

export type LabelSuggestion = {
  label: string;
  count: number;
};

export type AutofillSettingsProps = {
  enabled: boolean;
  matchMode: MatchMode;
  onEnabledChange: (next: boolean) => void;
  onMatchModeChange: (next: MatchMode) => void;
};

export type AnswerFormProps = {
  newLabel: string;
  newValue: string;
  isSaving: boolean;
  saveError: string;
  suggestions: LabelSuggestion[];
  /* onLabelChange: (value: string) => void;
  onValueChange: (value: string) => void; */
  onSave: () => void;
  onSuggestionClick: (label: string) => void;
};

export type AnswerListProps = {
  answers: Answer[];
  totalCount: number;
  filter: string;
  onFilterChange: (value: string) => void;
  onRemove: (id: string) => void;
};
