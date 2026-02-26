<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  import AnswerForm from '@c/AnswerForm.svelte';
  import AnswerList from '@c/AnswerList.svelte';
  import AutofillSettings from '@c/AutofillSettings.svelte';
  import { recommendedLabels } from '@u/data';
  import { sigDefault } from '@u/iconpopup';
  import { onMount } from 'svelte';

  const trueRecommendations = $derived.by(() => {
    const existingLabels = Appstate.answers.map((a) => a.label.toLowerCase());
    return recommendedLabels.filter(
      (label) => !existingLabels.includes(label.toLowerCase()),
    );
  });

  onMount(async () => {
    await Appstate.init();
    await sigDefault();
  });
</script>

<main class="min-h-full w-full p-4 text-sm">
  <header class="mb-4">
    <div class="text-xs uppercase tracking-[0.24em] font-bold">
      <span class="text-primary-content bg-primary px-2 rounded"> InputBuddy </span>
    </div>
    <h1 class="text-2xl font-semibold">Autofill your repeat answers</h1>
    <p class="mt-1 text-xs italic text-neutral-content opacity-70">
      Save common answers once, then reuse them across job application forms.
    </p>
  </header>

  <AnswerForm suggestions={trueRecommendations} />

  <AutofillSettings />

  <AnswerList />
</main>
