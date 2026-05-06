<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  import AnswerForm from '@c/AnswerForm.svelte';
  import AnswerList from '@c/AnswerList.svelte';
  import Profiles from '@c/Profiles.svelte';
  import ScanNowButton from '@c/ScanNowButton.svelte';
  import Settings from '@c/Settings.svelte';
  import { recommendedLabels } from '@u/data';

  const trueRecommendations = $derived.by(() => {
    const existingLabels = Appstate.answers.map((a) => a.label.toLowerCase());
    return recommendedLabels.filter(
      (label) => !existingLabels.includes(label.toLowerCase()),
    );
  });

  const ready = Appstate.init();

  $inspect(Appstate.currentProfile);

  /* onMount(async () => {
    await Appstate.init();
  }); */
</script>

<main id="app" class="min-h-full w-full p-4 text-sm">
  <header class="mb-4">
    <div class="text-xs uppercase tracking-[0.24em] font-bold">
      <span class="text-primary-content bg-primary px-2 rounded">
        InputBuddy
      </span>
    </div>
    <h1 class="text-2xl font-semibold">Autofill your repeat answers</h1>
    <p class="mt-1 text-sm italic text-neutral-content opacity-70">
      Save common answers once, then reuse them across any forms.
    </p>
  </header>

  {#await ready}
    <p>Loading...</p>
  {:then}
    <ScanNowButton />
    <AnswerForm suggestions={trueRecommendations} />
    <AnswerList />
    <Settings />
    <Profiles />
  {:catch}
    <p>Failed to initialize!</p>
  {/await}
</main>
