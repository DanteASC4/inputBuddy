<script lang="ts">
  import { normalizeText } from "@u/matching";

  import { Appstate } from "$lib/state.svelte";

  import CollapseWrapper from "./CollapseWrapper.svelte";
  import Subtext from "./Subtext.svelte";

  let filter = $state("");

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
  <div class="mt-4 flex items-center justify-start">
    <div class="text-sm font-semibold tracking-widest uppercase">
      Saved Count:&nbsp;
    </div>
    <div class="badge badge-info font-mono">{Appstate.answers.length}</div>
  </div>
  <Subtext>Answers are editable and save automatically when changed!</Subtext>

  <input
    class="input input-sm active:input-secondary focus:input-secondary mt-3 w-full"
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
        <div class="border-neutral bg-base-100/80 rounded-xl border px-3 py-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div
                class="text-secondary text-shadow-secondary-content text-base font-bold"
              >
                {answer.label}
              </div>
              <!-- <div class="mt-1 text-sm text-accent-content">{answer.value}</div> -->
              <input
                onchange={(e) => updateAnswer(e, answer.label, answer.id)}
                type="text"
                name="answer-editor"
                class="input input-sm mt-1"
                value={answer.value}
              />
            </div>
            <button
              type="button"
              class="btn btn-xs btn-error btn-outline font-mono"
              onclick={() => Appstate.removeAnswer(answer.id)}
            >
              &nbsp;X&nbsp;
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</CollapseWrapper>
