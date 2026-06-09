<script lang="ts">
  import { sigScanNow } from "@u/runtime-messages";
  import { animate, utils } from "animejs";
  import { debounce } from "radashi";

  import { Appstate } from "$lib/state.svelte";

  let theBtn: HTMLButtonElement;

  let btnText = $state("Fill Current Page");

  function setTextDelayed(text: string, delay: number) {
    setTimeout(() => {
      btnText = text;
    }, delay);
  }

  const debouncedSetText = debounce({ delay: 500 }, setTextDelayed);

  function onclick() {
    if (Appstate.answers.length === 0) {
      btnText = "Add some answers first!";
      animate(theBtn, {
        scale: [1, 1.1, 1],
        rotate: utils.randomPick([
          [-10, 10, 0],
          [10, -10, 0],
        ]),
        backgroundColor: [
          "var(--color-error)",
          "var(--color-error-content)",
          "var(--color-error)",
          "var(--color-base-200)",
        ],
        duration: 500,
        easing: "linear",
      });

      debouncedSetText("Fill Current Page", 4000);
      return;
    }
    if (!Appstate.settings.enabled) {
      btnText = "Extension filling disabled!";
      animate(theBtn, {
        scale: [1, 1.1, 1],
        rotate: utils.randomPick([
          [-10, 10, 0],
          [10, -10, 0],
        ]),
        backgroundColor: [
          "var(--color-warning)",
          "var(--color-warning-content)",
          "var(--color-warning)",
          "var(--color-base-200)",
        ],
        duration: 500,
        easing: "linear",
      });

      debouncedSetText("Fill Current Page", 4000);
      return;
    }
    sigScanNow();
  }
</script>

<button
  bind:this={theBtn}
  {onclick}
  class="btn btn-xl hover:btn-primary w-full tracking-widest uppercase"
>
  {btnText}
</button>
