<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  import CollapseWrapper from './CollapseWrapper.svelte';
  // import type { AutofillSettingsProps } from '@types';

  // let {}: AutofillSettingsProps = $props();

  let enabled = $state(Appstate.settings.enabled);
  let matchMode = $state(Appstate.settings.matchMode);
  let keepOpen = $state(Appstate.settings.keepOpen);

  function updateEnabled(_event: Event) {
    Appstate.changeSettings({ enabled });
  }

  function updateKeepOpen(_event: Event) {
    Appstate.changeSettings({ keepOpen });
  }

  function updateMatchMode(_event: Event) {
    Appstate.changeSettings({ matchMode });
  }
</script>

{#snippet radioLabel(title: string, subtitle?: string)}
  {#if subtitle}
    <p>
      <span class="text-secondary font-bold brightness-150 text-base">
        {title} <br />
      </span>
      <span class="text-sm opacity-70">
        {subtitle}
      </span>
    </p>
  {:else}
    <p>
      <span class="text-secondary font-bold brightness-150">
        {title}
      </span>
    </p>
  {/if}
{/snippet}

<CollapseWrapper title="Settings" class="space-y-2">
  <div class="flex items-center justify-between mt-4">
    <div>
      <div
        class="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-content"
      >
        Autofill
      </div>
      <div class="text-sm text-neutral-content opacity-70">
        Fill matching labels on detected forms.
      </div>
    </div>
    <input
      bind:checked={enabled}
      onchange={updateEnabled}
      type="checkbox"
      class="toggle toggle-secondary"
    />
  </div>

  <div class="flex items-center justify-between">
    <div>
      <div
        class="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-content"
      >
        Keep open
      </div>
      <div class="text-sm text-neutral-content opacity-70">
        Keep the app sections open at all times.
      </div>
    </div>
    <input
      bind:checked={keepOpen}
      onchange={updateKeepOpen}
      type="checkbox"
      class="toggle toggle-secondary mt-2"
    />
  </div>

  <div class="divider mt-3"></div>

  <div class="mt-4">
    <div
      class="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-content"
    >
      Match behavior
    </div>

    <fieldset class="fieldset">
      <label class="flex gap-2 cursor-pointer items-center">
        <input
          bind:group={matchMode}
          onchange={updateMatchMode}
          value="exact"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        {@render radioLabel(
          'Exact Match',
          'Only fill when the label text matches exactly.',
        )}
      </label>
      <label class="flex gap-2 cursor-pointer items-center">
        <input
          bind:group={matchMode}
          onchange={updateMatchMode}
          value="partial"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        {@render radioLabel(
          'Partial Match',
          'Use fuzzy matching with a conservative threshold to find close matches.',
        )}
      </label>
      <label class="flex gap-2 cursor-pointer items-center">
        <input
          bind:group={matchMode}
          onchange={updateMatchMode}
          value="suggest"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        {@render radioLabel(
          'Suggest for every input',
          'Utilize autocomplete with all saved answers for every detected input.',
        )}
      </label>
    </fieldset>
  </div>
</CollapseWrapper>
