<script lang="ts" module>
  type Option = {
    label: string;
    value: string;
    description?: string;
  };

  const MODES: Option[] = [
    { label: "Command", value: "command" },
    { label: "Item Argument", value: "item-argument" },
    { label: "Component Argument", value: "component-argument" },
    { label: "Entity Argument", value: "entity-argument" },
  ].sort((e1, e2) => e1.label.localeCompare(e2.label));

  const ENTITY_TYPES: Option[] = [
    "item",
    "xp_orb",
    "area_effect_cloud",
    "elder_guardian",
    "wither_skeleton",
    "stray",
    "egg",
    "leash_knot",
    "painting",
    "arrow",
    "snowball",
    "fireball",
    "small_fireball",
    "ender_pearl",
    "eye_of_ender_signal",
    "potion",
    "xp_bottle",
    "item_frame",
    "wither_skull",
    "tnt",
    "falling_block",
    "fireworks_rocket",
    "husk",
    "spectral_arrow",
    "shulker_bullet",
    "dragon_fireball",
    "zombie_villager",
    "skeleton_horse",
    "zombie_horse",
    "armor_stand",
    "donkey",
    "mule",
    "evocation_fangs",
    "evocation_illager",
    "vex",
    "vindication_illager",
    "illusion_illager",
    "commandblock_minecart",
    "boat",
    "minecart",
    "chest_minecart",
    "furnace_minecart",
    "tnt_minecart",
    "hopper_minecart",
    "spawner_minecart",
    "creeper",
    "skeleton",
    "spider",
    "giant",
    "zombie",
    "slime",
    "ghast",
    "zombie_pigman",
    "enderman",
    "cave_spider",
    "silverfish",
    "blaze",
    "magma_cube",
    "ender_dragon",
    "wither",
    "bat",
    "witch",
    "endermite",
    "guardian",
    "shulker",
    "pig",
    "sheep",
    "cow",
    "chicken",
    "squid",
    "wolf",
    "mooshroom",
    "snowman",
    "ocelot",
    "villager_golem",
    "horse",
    "rabbit",
    "polar_bear",
    "llama",
    "llama_spit",
    "parrot",
    "villager",
    "ender_crystal",
  ]
    .map((e) => ({ label: e, value: e }))
    .sort((e1, e2) => e1.label.localeCompare(e2.label));
</script>

<script lang="ts">
  let convertSuccess = $state(false);
  let convertError = $state(false);
  let input = $state("");
  let output = $state("");

  let copied = $state(false);
  $effect(() => {
    if (copied) {
      setTimeout(() => (copied = false), 1500);
    }
  });

  let mode = $state<Option>(MODES[0]);

  let entityType = $state<Option>();
  let loading = $state(false);

  const toggleState = (state: boolean) => {
    state = true;
    setTimeout(() => (state = false), 500);
  };

  const convert = async () => {
    output = "";
    loading = true;
    try {
      // const query = mode === MODES[3] ? "?entityType=" + entityType?.value : "";
      // const response = await fetch(
      //   "https://item-converter.papermc.io/convert-" + mode.value + query,
      //   {
      //     method: "POST",
      //     body: input,
      //   }
      // );
      // if (response.status === 200) {
      // output = await response.text();
      output = input;
      toggleState(convertSuccess);
      // } else {
      //   console.warn(
      //     "Failed to convert command: " +
      //       response.status +
      //       ": " +
      //       (await response.text())
      //   );
      //   toggleState(convertError);
      // }
    } catch (error) {
      console.error("Failed to convert command: " + error);
      toggleState(convertError);
    }

    loading = false;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    copied = true;
  };
</script>

<div class="item-command-converter">
  <p class="label">
    Input:
    <textarea placeholder="Enter your 1.20.4 command here..." class="textarea-panel" bind:value={input}></textarea>
  </p>

  <div class="convert-controls">
    <button class="convert-content clickable convert-button" onclick={convert}>Convert</button>
    {#if mode.value === "entity-argument"}
      <p class="convert-content entity-type">
        Entity Type:
        <select bind:value={entityType} class="convert-content dropdown clickable">
          {#each ENTITY_TYPES as option (option.label)}
            <option value={option.value}>{option.label ?? option.value}</option>
          {/each}
        </select>
      </p>
    {/if}
    <p class="convert-content convert-mode">
      Mode:
      <select bind:value={mode} class="convert-content dropdown clickable">
        {#each MODES as option (option)}
          <option value={option}>{option.label ?? option.value}</option>
        {/each}
      </select>
    </p>
  </div>

  <p class="label">
    Output:
    <textarea placeholder="Press 'Convert' to convert the command." class="textarea-panel" readonly bind:value={output}
    ></textarea>
  </p>

  <button class:copied onclick={copyToClipboard} class="clickable" disabled={loading}
    >{copied ? "Copied!" : "Copy output!"}</button
  >
</div>

<style>
  .item-command-converter {
    margin-top: 1rem;
    padding: 1rem;
    border: 2px;
    border-style: solid;
    border-radius: 1rem;
    border-color: var(--sl-color-gray-6);
  }

  .label {
    font-weight: 600;
  }

  .textarea-panel {
    width: 100%;
    resize: none;
    border: none;
    padding: 1rem;
    height: 12rem;
    line-height: 1.6;
    font-size: var(--sl-text-sm);
    font-family: var(--__sl-font-mono);
    word-break: break-all;
    background-color: var(--sl-color-gray-6);
    color: var(--sl-color-gray-1);
    margin-top: 0.5rem;
    border-radius: 0.5rem;
  }

  .convert-controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .convert-content {
    margin-top: auto;
    margin-bottom: auto;
  }

  .convert-mode {
    float: right;
  }

  .dropdown {
    margin-left: 0.5rem;
  }

  .clickable {
    background-color: var(--sl-color-gray-6);
    color: var(--sl-color-gray-1);
    border-style: solid;
    border-radius: 0.5rem;
    border-color: var(--sl-color-gray-5);
    padding: 0.25rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    transition: 0.15s;
  }

  .clickable:hover {
    background-color: var(--sl-color-gray-5);
    transition: 0.15s;
  }
</style>
