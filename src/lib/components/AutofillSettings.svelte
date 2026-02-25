<script lang="ts">
  import type { AutofillSettingsProps } from '../types';

  let {
    enabled = $bindable(),
    matchMode = $bindable(),
    onEnabledChange,
    onMatchModeChange,
  }: AutofillSettingsProps = $props();
</script>

<section class="rounded-2xl border border-neutral bg-base-100/80 p-4 shadow-sm">
  <div class="flex items-center justify-between">
    <div>
      <div class="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-content">Autofill</div>
      <div class="text-xs text-neutral-content opacity-70">
        Fill matching labels on detected forms.
      </div>
    </div>
    <input
      bind:checked={enabled}
      onchange={() => onEnabledChange(enabled)}
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
          onchange={() => onMatchModeChange(matchMode)}
          value="exact"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        <p>
          Exact Match <br />
          <span class="text-xs opacity-70">
            Only fill when the label text matches exactly.
          </span>
        </p>
      </label>
      <label class="flex gap-2 cursor-pointer items-center">
        <input
          bind:group={matchMode}
          onchange={() => onMatchModeChange(matchMode)}
          value="partial"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        <p>
          Partial Match <br />
          <span class="text-xs opacity-70">
            Use fuzzy matching with a conservative threshold to find close
            matches.
          </span>
        </p>
      </label>
      <label class="flex gap-2 cursor-pointer items-center">
        <input
          bind:group={matchMode}
          onchange={() => onMatchModeChange(matchMode)}
          value="suggest"
          type="radio"
          class="radio radio-sm radio-secondary"
        />
        <p>
          Suggest for every input <br />
          <span class="text-xs opacity-70">
            Utilize autocomplete with all saved answers for every detected
            input.
          </span>
        </p>
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
