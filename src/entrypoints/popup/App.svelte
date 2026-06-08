<script lang="ts">
  import AnswerForm from "@c/AnswerForm.svelte";
  import AnswerList from "@c/AnswerList.svelte";
  import Profiles from "@c/Profiles.svelte";
  import ScanNowButton from "@c/ScanNowButton.svelte";
  import Settings from "@c/Settings.svelte";
  import { recommendedLabels } from "@u/data";

  import { Appstate } from "$lib/state.svelte";

  const trueRecommendations = $derived.by(() => {
    const existingLabels = Appstate.answers.map((a) => a.label.toLowerCase());
    return recommendedLabels.filter(
      (label) => !existingLabels.includes(label.toLowerCase()),
    );
  });

  const ready = Appstate.init();
  $inspect(ready);

  /* onMount(async () => {
    await Appstate.init();
  }); */
</script>

<main id="app" class="min-h-full w-full p-4 text-sm">
  <header class="mb-4">
    <div class="text-xs font-bold tracking-[0.24em] uppercase">
      <span class="text-primary-content bg-primary rounded px-2">
        InputBuddy
      </span>
    </div>
    <h1 class="text-2xl font-semibold">Autofill your repeat answers</h1>
    <p class="text-neutral-content mt-1 text-sm italic opacity-70">
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
