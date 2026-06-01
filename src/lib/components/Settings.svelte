<script lang="ts">
  import { Appstate } from "$lib/state.svelte";

  import CollapseWrapper from "./CollapseWrapper.svelte";

  let enabled = $state(Appstate.settings.enabled);
  let matchMode = $state(Appstate.settings.matchMode);
  let keepOpen = $state(Appstate.settings.keepOpen);
  let debug = $state(Appstate.settings.debug);

  function updateEnabled() {
    Appstate.changeSettings({ enabled });
  }

  function updateKeepOpen() {
    Appstate.changeSettings({ keepOpen });
  }

  function updateMatchMode() {
    Appstate.changeSettings({ matchMode });
  }

  function updateDebug() {
    Appstate.changeSettings({ debug });
  }
</script>

{#snippet radioLabel(title: string, subtitle?: string)}
  {#if subtitle}
    <p>
      <span class="text-secondary text-base font-bold brightness-150">
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
  <div class="mt-4 flex items-center justify-between">
    <div>
      <div
        class="text-neutral-content text-sm font-semibold tracking-[0.2em] uppercase"
      >
        Autofill
      </div>
      <div class="text-neutral-content text-sm opacity-70">
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
        class="text-neutral-content text-sm font-semibold tracking-[0.2em] uppercase"
      >
        Keep open
      </div>
      <div class="text-neutral-content text-sm opacity-70">
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

  <div class="mt-4 flex items-center justify-between">
    <div>
      <div
        class="text-neutral-content text-sm font-semibold tracking-[0.2em] uppercase"
      >
        Debug Mode
      </div>
      <div class="text-neutral-content text-sm opacity-70">
        Enable browser console logging of various app actions.
      </div>
    </div>
    <input
      bind:checked={debug}
      onchange={updateDebug}
      type="checkbox"
      class="toggle toggle-secondary"
    />
  </div>

  <div class="divider mt-3"></div>

  <div class="mt-4">
    <div
      class="text-neutral-content text-sm font-semibold tracking-[0.2em] uppercase"
    >
      Match behavior
    </div>

    <fieldset class="fieldset">
      <label class="flex cursor-pointer items-center gap-2">
        <input
          bind:group={matchMode}
          onchange={updateMatchMode}
          value="exact"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        {@render radioLabel(
          "Exact Match",
          "Only fill when the label text matches exactly.",
        )}
      </label>
      <label class="flex cursor-pointer items-center gap-2">
        <input
          bind:group={matchMode}
          onchange={updateMatchMode}
          value="partial"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        {@render radioLabel(
          "Partial Match",
          "Use fuzzy matching with a conservative threshold to find close matches.",
        )}
      </label>
      <label class="flex cursor-pointer items-center gap-2">
        <input
          bind:group={matchMode}
          onchange={updateMatchMode}
          value="suggest"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        {@render radioLabel(
          "Suggest for every input",
          "Utilize autocomplete with all saved answers for every detected input.",
        )}
      </label>
    </fieldset>
  </div>
</CollapseWrapper>
