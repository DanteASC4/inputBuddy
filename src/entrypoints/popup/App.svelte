<script lang="ts">
  import { recommendedLabels } from '@/lib/data';
  import { onMount } from 'svelte';
  import AnswerForm from '../../lib/components/AnswerForm.svelte';
  import AnswerList from '../../lib/components/AnswerList.svelte';
  import AutofillSettings from '../../lib/components/AutofillSettings.svelte';
  import { normalizeText } from '../../lib/matching';
  import {
    deleteAnswer,
    getAnswers,
    getSettings,
    updateSettings,
    upsertAnswer,
  } from '../../lib/storage';
  import type { Answer, MatchMode, Settings } from '../../lib/types';

  let answers = $state<Answer[]>([]);
  let settings = $state<Settings>({ enabled: true, matchMode: 'partial' });
  let newLabel = $state('');
  let newValue = $state('');
  let filter = $state('');
  let isSaving = $state(false);
  let saveError = $state('');

  const filteredAnswers = $derived.by(() => {
    if (!filter.trim()) return answers;
    const query = normalizeText(filter);
    return answers.filter((answer) =>
      normalizeText(answer.label).includes(query),
    );
  });

  const refreshAnswers = async () => {
    answers = await getAnswers();
  };

  const saveAnswer = async () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    isSaving = true;
    saveError = '';

    try {
      answers = await upsertAnswer(newLabel, newValue);
      newLabel = '';
      newValue = '';
    } catch (error) {
      console.error('Failed to save answer.', error);
      saveError = 'Something went wrong while saving.';
    } finally {
      isSaving = false;
    }
  };

  const removeAnswer = async (id: string) => {
    answers = await deleteAnswer(id);
  };

  const handleEnabledChange = async (enabled: boolean) => {
    settings = await updateSettings({ enabled });
  };

  const handleMatchModeChange = async (matchMode: MatchMode) => {
    settings = await updateSettings({ matchMode });
  };

  const applySuggestion = (label: string) => {
    newLabel = label;
  };

  const handleLabelChange = (value: string) => {
    newLabel = value;
    if (saveError) saveError = '';
  };

  const handleValueChange = (value: string) => {
    newValue = value;
    if (saveError) saveError = '';
  };

  const handleFilterChange = (value: string) => {
    filter = value;
  };

  onMount(async () => {
    settings = await getSettings();
    await refreshAnswers();
  });
</script>

<main class="min-h-full w-full p-4 text-sm">
  <header class="mb-4">
    <div class="text-xs text-primary uppercase tracking-[0.24em]">
      InputBuddy
    </div>
    <h1 class="text-2xl font-semibold">Autofill your repeat answers</h1>
    <p class="mt-1 text-xs italic text-neutral-content opacity-70">
      Save common answers once, then reuse them across job application forms.
    </p>
  </header>

  <AnswerForm
    {newLabel}
    {newValue}
    {isSaving}
    {saveError}
    suggestions={recommendedLabels}
    onSave={saveAnswer}
    onSuggestionClick={applySuggestion}
  />

  <AutofillSettings
    enabled={settings.enabled}
    matchMode={settings.matchMode}
    onEnabledChange={handleEnabledChange}
    onMatchModeChange={handleMatchModeChange}
  />

  <AnswerList
    answers={filteredAnswers}
    totalCount={answers.length}
    {filter}
    onFilterChange={handleFilterChange}
    onRemove={removeAnswer}
  />
</main>
