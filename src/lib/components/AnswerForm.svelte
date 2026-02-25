<script lang="ts">
  import type { AnswerFormProps } from '../types';

  let {
    newLabel = $bindable(''),
    newValue = $bindable(''),
    isSaving,
    saveError,
    suggestions,
    onSave,
    onSuggestionClick,
  }: AnswerFormProps = $props();
</script>

{#snippet suggestionButton(suggestion: string)}
  <button
    onclick={() => onSuggestionClick(suggestion)}
    class="btn btn-outline btn-sm"
  >
    {suggestion}
  </button>
{/snippet}

<section
  class="my-4 rounded-2xl border border-neutral bg-base-100/80 p-4 shadow-sm"
>
  <h2 class="text-sm font-semibold">Add an answer</h2>
  <div class="mt-3 grid gap-2">
    <input
      bind:value={newLabel}
      class="input"
      placeholder="Question label (e.g. LinkedIn Profile)"
    />
    <textarea bind:value={newValue} class="textarea" placeholder="Your answer"
    ></textarea>
    <button
      type="button"
      class="btn btn-primary"
      onclick={onSave}
      disabled={isSaving || !newLabel.trim() || !newValue.trim()}
    >
      Save answer
    </button>
    {#if saveError}
      <div class="text-xs text-red-600">{saveError}</div>
    {/if}
  </div>

  <div class="mt-4">
    <div class="text-xs uppercase tracking-[0.2em] text-neutral-400">
      Suggested labels
    </div>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each suggestions as suggestion, i (suggestion)}
        {@render suggestionButton(suggestion)}
      {/each}
    </div>
  </div>
</section>
