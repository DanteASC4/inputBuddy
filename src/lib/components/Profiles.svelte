<script lang="ts">
  import { Appstate } from '$lib/state.svelte';
  import CollapseWrapper from './CollapseWrapper.svelte';

  let selection = $state(Appstate.currentProfile);
  let newProfileName = $state('');
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
    newProfileName = '';
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
  <div class="flex flex-row justify-center items-center pt-8">
    <div class="join">
      <div class="relative">
        {#key Appstate.currentProfile}
          <select
            {onchange}
            bind:value={selection}
            disabled={busy}
            class="select join-item w-32 active:select-secondary focus-within:select-secondary peer"
          >
            {#each Appstate.profiles as profile}
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
          class="absolute -top-4 left-4 font-bold peer-has-focus-within:opacity-50 transition-opacity"
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
          class="input join-item w-36 active:input-secondary focus:input-secondary"
          type="text"
          name="new-profile"
          placeholder="Or add a new profile"
        />
      </div>
      <button onclick={triggerCreate} class="btn join-item">Create</button>
    </div>
  </div>
</CollapseWrapper>
