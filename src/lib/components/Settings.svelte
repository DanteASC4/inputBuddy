<script lang="ts">
  import { Appstate } from "$lib/state.svelte";

  import CollapseWrapper from "./CollapseWrapper.svelte";
  import Subtext from "./Subtext.svelte";

  // TODO can make this more dynamic for sure but this works perfectly fine for now
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
      Matching Strategy
    </div>

    <details class="mt-2">
      <summary class="cursor-pointer text-sm underline">
        Learn More / What is this?
      </summary>
      <Subtext>
        The way InputBuddy works is by looking for all the input fields on a
        page, and then finding the corresponding label for each.

        <br />
        <br />
        Not Every page has a label or the label may be worded differently than what
        you saved.

        <br />
        <br />
        For example, you may have saved an answer like
        <b class="text-secondary">"First Name"</b>, but a label on a page could
        say
        <b class="text-secondary">"Your Name"</b>
        or <b class="text-secondary">"Name (First)"</b>. The matching strategy
        determines how flexible InputBuddy is when matching saved answers to
        input fields on a page.
      </Subtext>
    </details>

    <fieldset class="fieldset">
      <label class="flex cursor-pointer items-center gap-2">
        <input
          bind:group={matchMode}
          onchange={updateMatchMode}
          value="fuzzy"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        {@render radioLabel(
          "Fuzzy Match (Recommended)",
          "Use a well known matching algorithm to find the most likely match for each input, even if the label text isn't exactly the same.",
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
          "Partial Matching",
          "Find matches based on partial text similarity. This is less flexible than fuzzy matching but more likely to avoid incorrect matches.",
        )}
      </label>
      <label class="flex cursor-pointer items-center gap-2">
        <input
          bind:group={matchMode}
          onchange={updateMatchMode}
          value="similar"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        {@render radioLabel(
          "Text Matching",
          "Matches only text with the same characters, ignoring case and non-alphanumeric characters. A simple and fast option but won't handle typos or variations in wording.",
        )}
      </label>
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
          "Only fill inputs when the label text matches exactly, true 1 to 1.",
        )}
      </label>
    </fieldset>
  </div>
</CollapseWrapper>
