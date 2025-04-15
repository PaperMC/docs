<script lang="ts" module>
  type Option = { label: string; value: string; description?: string };

  const modes: Option[] = [
    { label: "Command", value: "command" },
    { label: "Item argument", value: "item-argument" },
    { label: "Component argument", value: "component-argument" },
    { label: "Entity argument", value: "entity-argument" },
  ];

  const entityTypes: Option[] = [
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

  type State = "success" | "error" | "loading" | "idle";
</script>

<script lang="ts">
  let convState = $state<State>("idle");
  let input = $state("");
  let output = $state("");

  let copied = $state(false);
  $effect(() => {
    if (copied) {
      setTimeout(() => (copied = false), 1500);
    }
  });

  let modeId = $state(modes[0]?.value);
  let mode = $derived<Option>(modes.find((m) => m.value === modeId) ?? modes[0]);
  let entityTypeId = $state(entityTypes[0]?.value);
  let entityType = $derived<Option>(entityTypes.find((m) => m.value === entityTypeId) ?? entityTypes[0]);

  const convert = async () => {
    if (convState === "loading") {
      return;
    }

    convState = "loading";
    output = "Converting...";
    try {
      const query = mode.value === "entity-argument" ? `?entityType=${entityType!.value}` : "";
      const response = await fetch(`https://item-converter.papermc.io/convert-${mode.value}${query}`, {
        method: "POST",
        body: input,
      });

      if (response.ok) {
        output = await response.text();
        convState = "success";
      } else {
        output = `Failed to convert command. (${await response.text()})`;
        convState = "error";
      }
    } catch (e) {
      output = "Failed to convert command, check the console.";
      console.error(e);

      convState = "error";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    copied = true;
  };
</script>

<div class="not-content generator">
  <div class="area">
    <p class="label">Input:</p>
    <textarea placeholder="Enter your 1.20.4 command here..." bind:value={input}></textarea>
  </div>

  <div class="controls">
    <button onclick={convert} disabled={convState === "loading"}>Convert</button>
    {#if mode.value === "entity-argument"}
      <div class="dropdown">
        <div class="label">Entity type:</div>
        <select bind:value={entityTypeId} class="dropdown-code">
          {#each entityTypes as option (option.label)}
            <option value={option.value}>{option.label ?? option.value}</option>
          {/each}
        </select>
      </div>
    {/if}
    <div class="dropdown">
      <div class="label">Mode:</div>
      <select bind:value={modeId}>
        {#each modes as option (option)}
          <option value={option.value}>{option.label ?? option.value}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="area">
    <p class="label">Output:</p>
    <textarea placeholder="Press 'Convert' to convert the command." readonly bind:value={output}></textarea>
  </div>

  <div class="controls">
    <button class:copied onclick={copyToClipboard} disabled={convState !== "success"}>
      {copied ? "Copied!" : "Copy"}
    </button>
  </div>
</div>

<style>
  .generator {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
    border: 1px solid var(--sl-color-gray-6);
    border-radius: 0.25rem;
  }

  .label {
    font-weight: 600;
  }

  .area textarea {
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
  }

  .area .label {
    margin-bottom: 0.25rem;
  }

  .controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .dropdown {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  .dropdown .label {
    flex-shrink: 0;
  }

  .dropdown select {
    height: 3rem;
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--sl-color-gray-4);
    border-radius: 0.25rem;
    background-color: var(--sl-color-gray-6);
  }

  .dropdown-code {
    font-family: var(--__sl-font-mono);
  }

  .controls button {
    height: 3rem;
    width: 6rem;
    padding: 0.5rem 1rem;
    color: var(--sl-color-white);
    background-color: var(--sl-color-gray-6);
    border: none;
    border-radius: 0.25rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      color 0.2s,
      background-color 0.2s;
  }

  .controls button:hover {
    background-color: var(--sl-color-gray-5);
  }

  .controls button[disabled] {
    cursor: not-allowed;
    color: var(--sl-color-gray-1);
    background-color: var(--sl-color-gray-5);
  }

  .copied {
    color: var(--sl-color-black) !important;
    background-color: var(--sl-color-green) !important;
  }

  @media (max-width: 640px) {
    .controls {
      flex-direction: column-reverse;
      align-items: stretch;
    }

    .dropdown {
      gap: 0.5rem;
      flex-direction: column;
      align-items: start;
    }

    .controls button {
      width: inherit;
    }
  }
</style>
