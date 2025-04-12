<script lang="ts" module>
  type Option = { id: string; label?: string; value?: string };

  const platforms: Option[] = [
    { id: "linux", label: "Linux/Mac" },
    { id: "windows", label: "Windows" },
  ];

  const flags: Option[] = [
    { id: "none", label: "None", value: "" },
    {
      id: "aikar",
      label: "Aikar's",
      value: [
        "-XX:+AlwaysPreTouch",
        "-XX:+DisableExplicitGC",
        "-XX:+ParallelRefProcEnabled",
        "-XX:+PerfDisableSharedMem",
        "-XX:+UnlockExperimentalVMOptions",
        "-XX:+UseG1GC",
        "-XX:G1HeapRegionSize=8M",
        "-XX:G1HeapWastePercent=5",
        "-XX:G1MaxNewSizePercent=40",
        "-XX:G1MixedGCCountTarget=4",
        "-XX:G1MixedGCLiveThresholdPercent=90",
        "-XX:G1NewSizePercent=30",
        "-XX:G1RSetUpdatingPauseTimePercent=5",
        "-XX:G1ReservePercent=20",
        "-XX:InitiatingHeapOccupancyPercent=15",
        "-XX:MaxGCPauseMillis=200",
        "-XX:MaxTenuringThreshold=1",
        "-XX:SurvivorRatio=32",
        "-Dusing.aikars.flags=https://mcflags.emc.gs",
        "-Daikars.new.flags=true",
        "" /* space */,
      ].join(" "),
    },
    {
      id: "velocity",
      label: "Velocity",
      value: [
        "-XX:+AlwaysPreTouch",
        "-XX:+ParallelRefProcEnabled",
        "-XX:+UnlockExperimentalVMOptions",
        "-XX:+UseG1GC",
        "-XX:G1HeapRegionSize=4M",
        "-XX:MaxInlineLevel=15",
        "" /* space */,
      ].join(" "),
    },
  ];

  const generateScript = (
    memory: number,
    filename: string,
    flag: Option,
    gui: boolean,
    autoRestart: boolean,
    platform: Option
  ): string => {
    const javaCmd = `java -Xms${memory * 1024}M -Xmx${memory * 1024}M ${flag.value}-jar ${filename || "server.jar"}${gui || flag.id === "velocity" ? "" : " nogui"}`;

    let script = platform.id === "windows" ? `${javaCmd}\n\npause` : javaCmd;
    if (autoRestart) {
      script =
        platform.id === "windows"
          ? `:start\n${javaCmd}\n\necho Server restarting...\necho Press CTRL + C to stop.\ngoto :start`
          : `while [ true ]; do\n    ${javaCmd}\n    echo Server restarting...\n    echo Press CTRL + C to stop.\ndone`;
    }

    return (platform.id === "linux" ? "#!/usr/bin/env sh\n\n" : "@echo off\n\n") + script;
  };
</script>

<script lang="ts">
  let memory = $state(4.0);
  let filename = $state("server.jar");
  let flagId = $state<string>(flags[0].id);
  let flag = $derived<Option>(flags.find((f) => f.id === flagId) ?? flags[0]);
  let gui = $state(false);
  let autoRestart = $state(false);
  let platformId = $state<string>(platforms[0].id);
  let platform = $derived<Option>(platforms.find((p) => p.id === platformId) ?? platforms[0]);
  let command = $derived(generateScript(memory, filename, flag, gui, autoRestart, platform));

  let copied = $state(false);
  $effect(() => {
    if (copied) {
      setTimeout(() => (copied = false), 1500);
    }
  });

  const download = () => {
    const url = URL.createObjectURL(new Blob([command]));

    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = `start.${platform.id === "windows" ? "bat" : "sh"}`;

    link.click();

    setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(url);
    }, 200);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    copied = true;
  };
</script>

<div class="not-content generator">
  <div class="memory-input">
    <p><span class="label">Memory:</span> {memory}GB</p>
    <input type="range" min={0.5} max={24} step={0.5} bind:value={memory} />
    <p class="gauge">
      {#each { length: 5 } as _, i}
        <span>{(i + 1) * 4}GB</span>
      {/each}
    </p>
  </div>

  <div class="inputs">
    <div class="input">
      <p class="label">File name:</p>
      <input type="text" placeholder="server.jar" bind:value={filename} />
    </div>
    <div class="input">
      <p class="label">Platform:</p>
      <select bind:value={platformId}>
        {#each platforms as option (option.id)}
          <option value={option.id}>{option.label ?? option.id}</option>
        {/each}
      </select>
    </div>
    <div class="input">
      <p class="label">Flags:</p>
      <select bind:value={flagId}>
        {#each flags as option (option.id)}
          <option value={option.id}>{option.label ?? option.id}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="checkboxes">
    {#if flag.id !== "velocity"}
      <div class="checkbox">
        <input type="checkbox" bind:checked={gui} />
        <span class="label">GUI</span>
      </div>
    {/if}
    <div class="checkbox">
      <input type="checkbox" bind:checked={autoRestart} />
      <span class="label">Auto-restart</span>
    </div>
  </div>

  <textarea class="output" readonly bind:value={command}></textarea>

  <div class="actions">
    <button class:copied onclick={copyToClipboard}>
      {copied ? "Copied!" : "Copy"}
    </button>
    <button onclick={download}>Download</button>
  </div>
</div>

<style>
  .generator {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .label {
    font-weight: 600;
  }

  .gauge {
    display: flex;
    justify-content: space-evenly;
    font-size: var(--sl-text-xs);
  }

  .memory-input {
    width: 100%;
  }

  .memory-input input {
    width: 100%;
    height: 0.5rem;
  }

  .inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 1rem;
    width: 100%;
  }

  .input {
    display: flex;
    flex-direction: column;
  }

  .input .label {
    margin-bottom: 0.25rem;
  }

  .input input,
  .input select {
    height: 3rem;
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--sl-color-gray-4);
    border-radius: 0.25rem;
    background-color: var(--sl-color-gray-6);
  }

  .checkboxes {
    display: flex;
    gap: 1.5rem;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .checkbox input {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: var(--sl-color-accent);
  }

  .checkbox .label {
    font-weight: 500;
  }

  .output {
    width: 100%;
    resize: none;
    border: none;
    padding: 1rem;
    height: 16rem;
    line-height: 1.6;
    font-size: var(--sl-text-sm);
    font-family: var(--__sl-font-mono);
    word-break: break-all;
    background-color: var(--sl-color-gray-6);
    color: var(--sl-color-gray-1);
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .actions button {
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

  .actions button:hover {
    background-color: var(--sl-color-gray-5);
  }

  .copied {
    color: var(--sl-color-black) !important;
    background-color: var(--sl-color-green) !important;
  }

  @media (max-width: 640px) {
    .inputs {
      grid-template-columns: 1fr;
    }

    .actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
