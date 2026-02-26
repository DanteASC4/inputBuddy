<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  import type { AnswerFormProps } from '@types';
  import { fly } from 'svelte/transition';

  let { suggestions }: AnswerFormProps = $props();

  let newLabel = $state('');
  let newValue = $state('');

  function applySuggestion(suggestion: string) {
    newLabel = suggestion;
  }
</script>

{#snippet suggestionButton(suggestion: string, idx: number)}
  <button
    transition:fly|global={{ y: 30, duration: 500, delay: 50 * idx }}
    onclick={() => applySuggestion(suggestion)}
    class="btn btn-sm btn-secondary text-xs hover:outline-2 hover:outline-neutral-content"
  >
    {suggestion}
  </button>
{/snippet}

<section
  class="my-4 rounded-2xl border border-neutral bg-base-100/80 p-4 shadow-sm hover:border-accent focus-within:border-accent"
>
  <h2
    class="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-content"
  >
    Add an answer
  </h2>
  <div class="mt-3 grid gap-2">
    <input
      bind:value={newLabel}
      class="input active:input-primary focus:input-primary"
      placeholder="Question label (e.g. LinkedIn Profile)"
    />
    <textarea
      bind:value={newValue}
      class="textarea active:textarea-primary focus:textarea-primary"
      placeholder="Your answer"
    ></textarea>
    <button
      type="button"
      class="btn btn-primary"
      onclick={() => Appstate.saveAnswer(newLabel, newValue)}
      disabled={Appstate.isSaving || !newLabel.trim() || !newValue.trim()}
    >
      Save answer
    </button>
    {#if Appstate.saveError}
      <div class="text-xs text-red-600">{Appstate.saveError}</div>
    {/if}
  </div>

  <div class="mt-4">
    <div class="text-xs uppercase tracking-[0.2em] text-neutral-400">
      Suggested labels
    </div>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each suggestions as suggestion, i (suggestion)}
        {@render suggestionButton(suggestion, i)}
      {/each}
    </div>
  </div>
</section>
