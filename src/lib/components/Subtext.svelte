<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  type SubtextProps = {
    children?: Snippet;
    class?: ClassValue;
  };

  let props: SubtextProps = $props();
</script>

<p class="mt-2 font-mono text-xs italic {props.class}">
  {@render props.children?.()}
</p>
