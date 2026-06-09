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
    selection = newProfileName;
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

<CollapseWrapper title="Answers Profiles">
  <Subtext>
    Save sets of labels & answers under profiles for easy switching &
    separation!
  </Subtext>
  <div class="flex flex-col items-center justify-center space-y-2 pt-8">
    {#key Appstate.currentProfile}
      <fieldset class="w-full grow">
        <legend class="fieldset-legend">Pick a profile</legend>
        <select
          {onchange}
          bind:value={selection}
          disabled={busy}
          class="select join-item active:select-secondary focus-within:select-secondary peer w-full"
        >
          {#each Appstate.profiles as profile, i (i)}
            {@const isCurrent = profile === Appstate.currentProfile}
            <option
              value={profile}
              selected={profile === Appstate.currentProfile}
            >
              {profile}
              {#if isCurrent}
                <span class="opacity-75"> (current) </span>
              {/if}
            </option>
          {/each}
        </select>
      </fieldset>
    {/key}

    <div class="join w-full">
      <div
        class="tooltip tooltip-secondary w-full"
        data-tip="Just enter a name & hit create!"
      >
        <input
          bind:value={newProfileName}
          class="input join-item active:input-secondary focus:input-secondary w-full"
          type="text"
          name="new-profile"
          placeholder="Or add a new profile"
        />
      </div>
      <button onclick={triggerCreate} class="btn join-item">Create</button>
    </div>

    <div class="tooltip tooltip-error tooltip-top" data-tip="No undoing this!">
      <button
        onclick={triggerDelete}
        class="btn btn-sm btn-error"
        disabled={Appstate.currentProfile === "default"}
      >
        {#if Appstate.currentProfile === "default"}
          Can't delete default profile
        {:else}
          Delete Current Profile
        {/if}
      </button>
    </div>
  </div>
</CollapseWrapper>
