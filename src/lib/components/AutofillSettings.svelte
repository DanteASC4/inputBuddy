<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  // import type { AutofillSettingsProps } from '@types';

  // let {}: AutofillSettingsProps = $props();

  let enabled = $state(Appstate.settings.enabled);
  let matchMode = $state(Appstate.settings.matchMode);

  function updateEnabled(_event: Event) {
    Appstate.changeSettings({ enabled });
  }

  function updateMatchMode(_event: Event) {
    Appstate.changeSettings({ matchMode });
  }
</script>

{#snippet radioLabel(title: string, subtitle?: string)}
  {#if subtitle}
    <p>
      <span class="text-secondary font-bold brightness-150">
        {title} <br />
      </span>
      <span class="text-xs opacity-70">
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

<section
  class="rounded-2xl border border-neutral bg-base-100/80 p-4 shadow-sm focus-within:border-accent hover:border-accent"
>
  <div class="flex items-center justify-between">
    <div>
      <div
        class="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-content"
      >
        Autofill
      </div>
      <div class="text-xs text-neutral-content opacity-70">
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
    <!-- <div class="mt-3 grid gap-2 text-xs text-neutral-content">
      <label class="flex items-start gap-2">
        <input
          type="radio"
          name="match-mode"
          value="exact"
          checked={matchMode === 'exact'}
          onchange={() => onMatchModeChange('exact')}
        />
        <span>
          <span class="block text-sm font-semibold text-neutral-content">
            Exact match
          </span>
          Only fill when the label text matches exactly.
        </span>
      </label>
      <label class="flex items-start gap-2">
        <input
          type="radio"
          name="match-mode"
          value="partial"
          checked={matchMode === 'partial'}
          onchange={() => onMatchModeChange('partial')}
        />
        <span>
          <span class="block text-sm font-semibold text-neutral-content">
            Partial match
          </span>
          Use fuzzy matching with a conservative threshold.
        </span>
      </label>
      <label class="flex items-start gap-2">
        <input
          type="radio"
          name="match-mode"
          value="suggest"
          checked={matchMode === 'suggest'}
          onchange={() => onMatchModeChange('suggest')}
        />
        <span>
          <span class="block text-sm font-semibold text-neutral-content">
            Suggest for every input
          </span>
          Fill the best guess even if confidence is low.
        </span>
      </label>
    </div> -->
  </div>
</section>
