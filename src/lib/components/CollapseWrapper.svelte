<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  import { Appstate } from "$lib/state.svelte";

  type CollapseWrapperProps = {
    title: string;
    children?: Snippet;
    class?: ClassValue;
  };

  let { title, children, class: className }: CollapseWrapperProps = $props();
</script>

<section
  class="collapse-arrow border-neutral bg-base-100/80 hover:border-secondary focus-within:border-secondary focus-within:[&_.collapse-title]:text-secondary collapse my-4 rounded-2xl border py-4 shadow-sm focus-within:[&_.collapse-title]:brightness-200"
  class:collapse-open={Appstate.settings.keepOpen}
>
  <input type="checkbox" />
  <div
    class="collapse-title text-neutral-content flex items-center py-0 text-xl font-semibold tracking-[0.2em] uppercase underline underline-offset-4"
  >
    {title}
  </div>
  <div class={["collapse-content", className]}>
    {@render children?.()}
  </div>
</section>
