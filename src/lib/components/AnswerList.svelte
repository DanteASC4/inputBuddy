<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  import { normalizeText } from '@u/matching';
  import CollapseWrapper from './CollapseWrapper.svelte';

  let filter = $state('');

  const filteredAnswers = $derived.by(() => {
    if (!filter.trim()) return Appstate.answers;
    const query = normalizeText(filter);
    return Appstate.answers.filter((answer) =>
      normalizeText(answer.label).includes(query),
    );
  });

  async function updateAnswer(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    l: string,
    id: string,
  ) {
    const v = (event.currentTarget as HTMLInputElement).value;

    await Appstate.saveAnswer(l, v, id);
  }
</script>

<CollapseWrapper title="Saved answers">
  <div class="flex items-center justify-start mt-4">
    <div class="text-sm font-semibold uppercase tracking-widest">
      Saved Count:&nbsp;
    </div>
    <div class="badge badge-info font-mono">{Appstate.answers.length}</div>
  </div>
  <p class="text-xs italic mt-2">
    Answers are editable and save automatically when changed!
  </p>

  <input
    class="mt-3 w-full input input-sm active:input-secondary focus:input-secondary"
    placeholder="Start typing to filter by label"
    bind:value={filter}
  />

  {#if Appstate.answers.length === 0}
    <div class="mt-4 text-xs text-neutral-500">
      No answers yet. Add one above to get started.
    </div>
  {:else if filteredAnswers.length === 0}
    <div class="mt-4 text-xs text-neutral-500">
      No answers match your filter.
    </div>
  {:else}
    <div class="mt-4 grid gap-3">
      {#each filteredAnswers as answer (answer.id)}
        <div class="rounded-xl border border-neutral bg-base-100/80 px-3 py-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-base text-secondary font-semibold">
                {answer.label}
              </div>
              <!-- <div class="mt-1 text-sm text-accent-content">{answer.value}</div> -->
              <input
                onchange={(e) => updateAnswer(e, answer.label, answer.id)}
                type="text"
                name="answer-editor"
                class="input mt-1 input-sm"
                value={answer.value}
              />
            </div>
            <button
              type="button"
              class="text-xs text-neutral-400 hover:text-neutral-700"
              onclick={() => Appstate.removeAnswer(answer.id)}
            >
              Remove
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</CollapseWrapper>
