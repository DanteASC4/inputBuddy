<script lang="ts">
  import SearchCode from "@lucide/svelte/icons/search-code";
  import Trophy from "@lucide/svelte/icons/trophy";
  import type { FillableElement, Winners } from "@types";
  import { fillInput } from "@u/eles";
  import { animate } from "animejs";
  import { debounce } from "radashi";
  import { onMount } from "svelte";

  import { Contentstate, ScannerOutcome } from "$lib/stores/content.svelte";

  let pane: HTMLElement | null = $state(null);
  let currentSuggestions: Winners = $state({
    first: null,
    second: null,
    third: null,
  });
  let currentTarget = $state<FillableElement | null>(null);
  let query = $state("");
  const matchingAnswers = $derived(
    Contentstate.answers.filter((answer) => {
      const search = query.trim().toLowerCase();
      if (!search) return true;
      return (
        answer.label.toLowerCase().includes(search) ||
        answer.value.toLowerCase().includes(search)
      );
    }),
  );

  function newTarget(e: FocusEvent) {
    const target = e.target as FillableElement;
    const targetWinners = ScannerOutcome.notFilled.get(target);
    if (targetWinners) {
      moveTo(target);
      currentTarget = target;
      currentSuggestions = targetWinners;
    }
  }

  function moveTo(el: HTMLElement) {
    if (!pane) return;

    const from = pane.getBoundingClientRect();
    const to = el.getBoundingClientRect();

    animate(pane, {
      duration: 1000,
      easing: "inOutCirc",
      x: [from.x, to.x + to.width * 0.5 - from.width * 0.5],
      y: [from.y, to.y + to.height + 12],
      opacity: [0, 1],
      onComplete: () => {
        pane!.classList.remove("pointer-events-none");
      },
    });
  }

  function fillFromSaved(v: string) {
    if (!currentTarget) return;

    fillInput(currentTarget, v);
  }

  function handleSuggestionClick(suggestion: string) {
    if (!currentTarget) return;

    fillInput(currentTarget, suggestion);
  }

  function resetInjectedMenu() {
    currentTarget = null;
    currentSuggestions = {
      first: null,
      second: null,
      third: null,
    };
    hidePane();
  }

  function hidePane() {
    if (!pane) return;
    animate(pane, {
      duration: 250,
      easing: "linear",
      opacity: [1, 0],
      onComplete: () => {
        pane!.classList.add("pointer-events-none");
      },
    });
  }

  function resizeMove() {
    if (currentTarget) {
      moveTo(currentTarget);
    }
  }
  const resizeMoveDeb = debounce({ delay: 100 }, resizeMove);

  $effect(() => {
    if (Contentstate.indicateFilled) {
      ScannerOutcome.filled.forEach((el) => {
        el.style.outline = "2px solid oklch(0.7941 0.1899 149.29)";
        el.style.outlineOffset = "2px";
        el.style.filter = "drop-shadow(0 0 2px oklch(0.7941 0.1899 149.29))";
      });
    } else {
      ScannerOutcome.filled.forEach((el) => {
        if (el.style.outline === "2px solid oklch(0.7941 0.1899 149.29)") {
          el.style.outline = "";
          el.style.outlineOffset = "";
          el.style.filter = "";
        }
      });
    }

    return () => {
      ScannerOutcome.filled.forEach((el) => {
        el.style.outline = "";
        el.style.outlineOffset = "";
        el.style.filter = "";
      });
    };
  });

  onMount(() => {
    if (!pane) return;

    document.addEventListener("focusin", newTarget);
    document.addEventListener("focusout", () => resetInjectedMenu);
  });
</script>

<svelte:window onresize={resizeMoveDeb} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={pane}
  onmouseleave={hidePane}
  data-theme="vdark"
  data-font="serif"
  class="inset-ring-secondary bubble pointer-events-none absolute top-0 left-0 z-1000 m-2 h-64 w-96 rounded-lg p-4 shadow-xl inset-ring-4"
  style="opacity: 0;"
>
  <div class="tabs tabs-lift size-full">
    <label class="tab">
      <input type="radio" name="input-buddy-menutabs" checked />
      <Trophy class="mr-1" size={14} />
      Most Likely
    </label>
    <div class="tab-content bg-base-100 border-base-200 p-4">
      <ul class="menu row-span-4 size-full">
        {#if currentSuggestions}
          {@const first = currentSuggestions?.first?.answer.value}
          {@const second = currentSuggestions?.second?.answer.value}
          {@const third = currentSuggestions?.third?.answer.value}
          {#if first}
            <li>
              <button
                class="btn btn-outline btn-accent"
                onclick={() => handleSuggestionClick(first)}
              >
                {currentSuggestions.first}
              </button>
            </li>
          {/if}

          {#if second}
            <li>
              <button
                class="btn btn-outline btn-accent"
                onclick={() => handleSuggestionClick(second)}
              >
                {currentSuggestions.second}
              </button>
            </li>
          {/if}

          {#if third}
            <li>
              <button
                class="btn btn-outline btn-accent"
                onclick={() => handleSuggestionClick(third)}
              >
                {currentSuggestions.third}
              </button>
            </li>
          {/if}

          {#if !first && !second && !third}
            <li>
              <div class="text-accent-content text-center text-sm italic">
                No suggestions for this input!
              </div>
            </li>
          {/if}
        {/if}
      </ul>
    </div>

    <label class="tab">
      <input type="radio" name="input-buddy-menutabs" />
      <SearchCode class="mr-1" size={14} />
      Search Saved Answers
    </label>
    <div class="tab-content bg-base-100 border-base-200 px-4 py-2">
      <div class="flex min-h-0 w-full flex-col">
        <input
          class="input input-sm active:input-secondary focus:input-secondary mt-3 w-full shrink-0"
          placeholder="Start typing to search saved answers"
          bind:value={query}
        />
        <button
          disabled
          class="mt-1 flex flex-row items-center justify-around px-4 font-mono opacity-75"
        >
          <span
            class="text-accent-content text-shadow-secondary-content font-bolder col-span-2 text-base"
          >
            Label
          </span>

          <span class="text-accent-content col-span-2 mt-1 text-sm">
            Answer
          </span>
        </button>

        {#if Contentstate.answers.length === 0}
          <div class="mt-4 text-xs text-neutral-500">
            No answers yet. Add one above to get started.
          </div>
        {:else if matchingAnswers.length === 0}
          <div class="mt-4 text-xs text-neutral-500">
            No answers match your filter.
          </div>
        {:else}
          <div class="mt-4 flex-1 overflow-y-auto pr-1">
            <div class="grid gap-3">
              {#each matchingAnswers as answer (answer.id)}
                <button
                  onclick={() => fillFromSaved(answer.value)}
                  class="btn btn-secondary btn-outline grid size-full h-10 cursor-pointer grid-cols-5 grid-rows-1"
                >
                  <span
                    class="text-secondary-content text-shadow-secondary-content col-span-2 text-base font-bold"
                  >
                    {answer.label}
                  </span>
                  <div class="divider divider-horizontal"></div>
                  <span class="text-accent-content col-span-2 mt-1 text-sm">
                    {answer.value}
                  </span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .bubble::after {
    content: "";
    position: absolute;
    width: 0;
    border-style: solid;
    border-color: var(--color-secondary) transparent;
    border-width: 0px 10px 10px;
    top: -10px;
    left: 50%;
    margin-left: -10px;
  }
</style>
