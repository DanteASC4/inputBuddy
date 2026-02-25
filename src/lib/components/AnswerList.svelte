<script lang="ts">
  import type { AnswerListProps } from '../types';

  let {
    answers,
    totalCount,
    filter,
    onFilterChange,
    onRemove,
  }: AnswerListProps = $props();
</script>

<section
  class="mt-4 rounded-2xl border border-neutral bg-base-100/80 p-4 shadow-sm"
>
  <div class="flex items-center justify-between">
    <h2 class="text-sm font-semibold">Saved answers</h2>
    <span class="text-xs text-neutral-500">{totalCount}</span>
  </div>
  <input
    class="mt-3 w-full rounded-xl border border-neutral bg-base-100/80 px-3 py-2 text-xs"
    placeholder="Filter by label"
    value={filter}
    oninput={(event) =>
      onFilterChange((event.currentTarget as HTMLInputElement).value)}
  />

  {#if answers.length === 0}
    <div class="mt-4 text-xs text-neutral-500">
      No answers yet. Add one above to get started.
    </div>
  {:else}
    <div class="mt-4 grid gap-3">
      {#each answers as answer (answer.id)}
        <div class="rounded-xl border border-neutral bg-base-100/80 px-3 py-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-sm font-semibold">{answer.label}</div>
              <div class="mt-1 text-xs text-neutral-600">{answer.value}</div>
            </div>
            <button
              type="button"
              class="text-xs text-neutral-400 hover:text-neutral-700"
              onclick={() => onRemove(answer.id)}
            >
              Remove
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
