<script lang="ts">
  import type { Settings } from "@types";

  import { Appstate } from "$lib/state.svelte";

  import CollapseWrapper from "./CollapseWrapper.svelte";
  import Subtext from "./Subtext.svelte";
  import ToggleSetting from "./ToggleSetting.svelte";

  let transientSettings: Settings = $state(Appstate.settings);
  let fontStyleChoice = $state(Appstate.settings.fontStyle === "serif");

  $effect(() => {
    if (fontStyleChoice) transientSettings.fontStyle = "serif";
    else transientSettings.fontStyle = "sans-serif";

    updateAllSettings();
  });

  function updateAllSettings() {
    Appstate.changeSettings(transientSettings);
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
  <ToggleSetting
    bind:checked={transientSettings.enabled}
    onchange={updateAllSettings}
    settingName="Filling Enabled"
    settingDesc="Disabling this will prevent any form of filling inputs, whether automatic or manual."
  />

  <ToggleSetting
    bind:checked={transientSettings.autoFillEnabled}
    onchange={updateAllSettings}
    settingName="Autofill"
    settingDesc="Enables whether the extension will automatically attempt to fill inputs on pages with found inputs."
  />

  <ToggleSetting
    bind:checked={transientSettings.floatingMenuEnabled}
    onchange={updateAllSettings}
    settingName="Floating Menu"
    settingDesc="Decides whether the floating menu is shown for inputs that didn't have a confident match."
  />

  <ToggleSetting
    bind:checked={transientSettings.keepOpen}
    onchange={updateAllSettings}
    settingName="Keep open"
    settingDesc="Keep the app sections open at all times."
  />

  <ToggleSetting
    bind:checked={transientSettings.debug}
    onchange={updateAllSettings}
    settingName="Debug Mode"
    settingDesc="Enable browser console logging of various app actions."
  />

  <ToggleSetting
    bind:checked={transientSettings.indicateFilled}
    onchange={updateAllSettings}
    settingName="Indicate Filled"
    settingDesc="Toggles adding a green outline to any inputs that were filled by InputBuddy."
  />

  <div class="mt-4 flex items-center justify-between">
    <div>
      <div
        class="text-neutral-content text-sm font-semibold tracking-[0.2em] uppercase"
      >
        Font Style
      </div>
      <div class="text-neutral-content text-sm opacity-70">
        Change whether the extension's font is Serif or Sans-Serif!
      </div>
    </div>
    <label class="swap cursor-pointer">
      <input bind:checked={fontStyleChoice} type="checkbox" />

      <span
        style="font-family: 'Besley', serif;"
        class="swap-on border-secondary flex size-12 items-center justify-center rounded-lg border-2 border-dotted text-lg"
      >
        Aa
      </span>
      <span
        style="font-family: 'TikTok Sans', sans-serif;"
        class="swap-off border-secondary flex size-12 items-center justify-center rounded-lg border-2 border-dotted text-lg"
      >
        Aa
      </span>
    </label>
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
          bind:group={transientSettings.matchMode}
          onchange={updateAllSettings}
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
          bind:group={transientSettings.matchMode}
          onchange={updateAllSettings}
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
          bind:group={transientSettings.matchMode}
          onchange={updateAllSettings}
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
          bind:group={transientSettings.matchMode}
          onchange={updateAllSettings}
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
