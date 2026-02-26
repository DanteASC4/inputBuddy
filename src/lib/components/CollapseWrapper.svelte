<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  import type { CollapseWrapperProps } from '@types';

  let { title, children, class: className }: CollapseWrapperProps = $props();
</script>

<section
  class="collapse collapse-arrow rounded-2xl border border-neutral bg-base-100/80 py-4 shadow-sm hover:border-secondary focus-within:border-secondary my-4"
  class:collapse-open={Appstate.settings.keepOpen}
>
  <input type="checkbox" />
  <div
    class="collapse-title text-xl font-semibold uppercase tracking-[0.2em] text-neutral-content py-0 flex items-center underline underline-offset-4"
  >
    {title}
  </div>
  <div class={['collapse-content', className]}>
    {@render children?.()}
  </div>
</section>
