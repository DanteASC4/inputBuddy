<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  type SubtextProps = {
    children?: Snippet;
    class?: ClassValue;
  };

  let props: SubtextProps = $props();
</script>

<p class="text-xs italic mt-2 font-mono {props.class}">
  {@render props.children?.()}
</p>
