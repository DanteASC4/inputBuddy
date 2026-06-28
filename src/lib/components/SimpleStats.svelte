<script lang="ts">
  import Keyboard from "@lucide/svelte/icons/keyboard";
  import TextCursorInput from "@lucide/svelte/icons/text-cursor-input";
  // import { onMount } from "svelte";
  import { Tween } from "svelte/motion";

  import { Appstate } from "$lib/state.svelte";

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  });

  const inputCounter = new Tween(0, {
    duration: 350,
  });

  const charCounter = new Tween(0, {
    duration: 350,
  });

  $effect(() => {
    if (Appstate.inputsAutoFilled !== inputCounter.current) {
      inputCounter.set(Appstate.inputsAutoFilled);
    }
    if (Appstate.charactersAutoFilled !== charCounter.current) {
      charCounter.set(Appstate.charactersAutoFilled);
    }
  });
</script>

<div
  class="flex w-full items-center justify-center opacity-50 transition-opacity hover:opacity-100"
>
  <div class="stats">
    <div class="stat">
      <div class="stat-figure text-secondary">
        <TextCursorInput />
      </div>
      <div class="stat-title">Auto Filled</div>
      <div class="stat-value text-2xl">{Math.round(inputCounter.current)}</div>
      <div class="stat-desc">Inputs For You</div>
    </div>
    <div class="stat">
      <div class="stat-figure text-secondary">
        <Keyboard />
      </div>
      <div class="stat-title">Saved</div>
      <div class="stat-value text-2xl">
        {formatter.format(Math.round(charCounter.current))}
      </div>
      <div class="stat-desc">Keystrokes</div>
    </div>
  </div>
</div>
