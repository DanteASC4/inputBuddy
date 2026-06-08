import type { ContentState, ScannerOutcomeShape } from "@types";

export const ScannerOutcome = $state<ScannerOutcomeShape>({
  filled: [],
  notFilled: new WeakMap(),
});

export const Contentstate = $state<ContentState>({
  answers: [],
  profile: "default",
  indicateFilled: true,
});
