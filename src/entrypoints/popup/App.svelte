<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  import AnswerForm from '@c/AnswerForm.svelte';
  import AnswerList from '@c/AnswerList.svelte';
  import AutofillSettings from '@c/AutofillSettings.svelte';
  import { recommendedLabels } from '@u/data';
  import { onMount } from 'svelte';

  onMount(async () => {
    await Appstate.init();
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

  <AnswerForm suggestions={recommendedLabels} />

  <AutofillSettings />

  <AnswerList />
</main>
