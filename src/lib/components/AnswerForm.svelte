<script lang="ts">
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";

  import { Appstate } from "$lib/state.svelte";

  import CollapseWrapper from "./CollapseWrapper.svelte";

  type AnswerFormProps = {
    suggestions: readonly string[];
  };

  const [send, receive] = crossfade({
    fallback(node, _params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  let { suggestions }: AnswerFormProps = $props();

  let newLabel = $state("");
  let newValue = $state("");

  function applySuggestion(suggestion: string) {
    newLabel = suggestion;
    // Clear value when switching suggestions
    newValue = "";
  }
</script>

<CollapseWrapper title="Add an answer">
  <div class="mt-3 grid gap-2">
    <input
      bind:value={newLabel}
      class="input active:input-secondary focus:input-secondary"
      placeholder="Question label (e.g. LinkedIn Profile)"
    />
    <textarea
      bind:value={newValue}
      class="textarea active:textarea-secondary focus:textarea-secondary"
      placeholder="Your answer"
    ></textarea>
    <button
      type="button"
      class="btn btn-secondary"
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
    <div class="text-xs tracking-[0.2em] text-neutral-400 uppercase">
      Suggested labels / input targets
    </div>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each suggestions as suggestion, i (suggestion)}
        <button
          in:receive={{ key: i }}
          out:send={{ key: i }}
          animate:flip
          onclick={() => applySuggestion(suggestion)}
          class="btn btn-sm btn-secondary hover:outline-neutral-content text-xs hover:outline-2"
        >
          {suggestion}
        </button>
      {/each}
    </div>
  </div>
</CollapseWrapper>
