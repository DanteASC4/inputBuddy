<script lang="ts">
  import { Appstate } from "$lib/state.svelte";

  import CollapseWrapper from "./CollapseWrapper.svelte";
  import Subtext from "./Subtext.svelte";

  let selection = $state(Appstate.currentProfile);
  let newProfileName = $state("");
  let busy = $state(false);

  async function onchange() {
    if (busy) return;
    busy = true;
    await Appstate.switchProfile(selection);
    busy = false;
  }

  async function triggerCreate() {
    if (busy) return;
    busy = true;
    await Appstate.switchsertProfile(newProfileName);
    newProfileName = "";
    busy = false;
  }
  async function triggerDelete() {
    if (busy) return;
    busy = true;
    await Appstate.delProfile(selection);
    busy = false;
  }
</script>

<CollapseWrapper title="Input Profiles">
  <Subtext>
    Save sets of inputs & values under profiles for easy switching & separation!
  </Subtext>
  <div class="flex flex-row items-center justify-center pt-8">
    <div class="join">
      <div class="relative">
        {#key Appstate.currentProfile}
          <select
            {onchange}
            bind:value={selection}
            disabled={busy}
            class="select join-item active:select-secondary focus-within:select-secondary peer w-32"
          >
            {#each Appstate.profiles as profile, i (i)}
              {@const isCurrent = profile === Appstate.currentProfile}
              <option value={profile} selected={isCurrent} disabled={isCurrent}>
                {profile}
                {#if isCurrent}
                  <span class="opacity-75"> (current) </span>
                  <div
                    class="tooltip tooltip-error tooltip-left"
                    data-tip="No undoing this!"
                  >
                    <button
                      onclick={triggerDelete}
                      class="btn btn-sm btn-outline btn-error"
                    >
                      Delete
                    </button>
                  </div>
                {/if}
              </option>
            {/each}
          </select>
        {/key}
        <div
          class="absolute -top-4 left-4 font-bold transition-opacity peer-has-focus-within:opacity-50"
        >
          Input Profile
        </div>
      </div>
      <div
        class="tooltip tooltip-secondary"
        data-tip="Just enter a name & hit create!"
      >
        <input
          bind:value={newProfileName}
          class="input join-item active:input-secondary focus:input-secondary w-36"
          type="text"
          name="new-profile"
          placeholder="Or add a new profile"
        />
      </div>
      <button onclick={triggerCreate} class="btn join-item">Create</button>
    </div>
  </div>
</CollapseWrapper>
