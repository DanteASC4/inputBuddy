<script lang="ts">
  import type { AutofillSettingsProps } from '../types';

  let {
    enabled,
    matchMode,
    onEnabledChange,
    onMatchModeChange,
  }: AutofillSettingsProps = $props();
</script>

<section
  class="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm"
>
  <div class="flex items-center justify-between">
    <div>
      <div class="text-sm font-semibold">Autofill</div>
      <div class="text-xs text-neutral-500">
        Fill matching labels on detected forms.
      </div>
    </div>
    <label class="relative inline-flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        class="peer sr-only"
        checked={enabled}
        onchange={(event) =>
          onEnabledChange((event.currentTarget as HTMLInputElement).checked)}
      />
      <span
        class="h-5 w-9 rounded-full bg-neutral-300 transition peer-checked:bg-emerald-400"
      ></span>
      <span
        class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4"
      ></span>
    </label>
  </div>

  <div class="mt-4">
    <div class="text-xs uppercase tracking-[0.2em] text-neutral-400">
      Match behavior
    </div>
    <div class="mt-3 grid gap-2 text-xs text-neutral-600">
      <label class="flex items-start gap-2">
        <input
          type="radio"
          name="match-mode"
          value="exact"
          checked={matchMode === 'exact'}
          onchange={() => onMatchModeChange('exact')}
        />
        <span>
          <span class="block text-sm font-semibold text-neutral-800">
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
          <span class="block text-sm font-semibold text-neutral-800">
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
          <span class="block text-sm font-semibold text-neutral-800">
            Suggest for every input
          </span>
          Fill the best guess even if confidence is low.
        </span>
      </label>
    </div>
  </div>
</section>
