<script lang="ts">
  import type { ChangeEventHandler } from "svelte/elements";

  type ToggleSettingProps = {
    checked: boolean;
    onchange?: ChangeEventHandler<HTMLInputElement> | null | undefined;
    settingName: string;
    settingDesc: string;
  };

  let {
    checked = $bindable(),
    onchange,
    settingName,
    settingDesc,
  }: ToggleSettingProps = $props();
</script>

<div class="mt-4 flex items-center justify-between">
  <div>
    <div
      class="text-neutral-content text-sm font-semibold tracking-[0.2em] uppercase"
    >
      {settingName}
    </div>
    <div class="text-neutral-content text-sm opacity-70">
      {settingDesc}
    </div>
  </div>
  <input
    bind:checked
    {onchange}
    type="checkbox"
    class="toggle toggle-secondary"
  />
</div>
