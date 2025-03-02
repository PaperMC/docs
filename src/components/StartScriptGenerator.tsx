import React, { useEffect, useState } from "react";
import "@site/src/css/start-script-generator.css";
import Button from "@site/src/components/ui/Button";
import Select, { Option } from "@site/src/components/ui/Select";

const markerPoints = [4, 8, 12, 16, 20];

const WINDOWS_AUTO_RESTART =
  ":start\n%%CONTENT%%\n\necho Server restarting...\necho Press CTRL + C to stop.\ngoto :start";
const LINUX_AUTO_RESTART =
  "while [ true ]; do\n    %%CONTENT%%\n    echo Server restarting...\n    echo Press CTRL + C to stop.\ndone";

const PLATFORMS: Option[] = [
  { label: "Linux/Mac", value: "linux" },
  { label: "Windows", value: "windows" },
];

const LINUX = PLATFORMS[0];
const WINDOWS = PLATFORMS[1];

const FLAGS: Option[] = [
  {
    label: "Aikar's",
    value: [
      "-XX:+AlwaysPreTouch",
      "-XX:+DisableExplicitGC",
      "-XX:+ParallelRefProcEnabled",
      "-XX:+PerfDisableSharedMem",
      "-XX:+UnlockExperimentalVMOptions",
      "-XX:+UseG1GC",
      "-XX:G1HeapWastePercent=5",
      "-XX:G1MixedGCCountTarget=4",
      "-XX:G1MixedGCLiveThresholdPercent=90",
      "-XX:G1RSetUpdatingPauseTimePercent=5",
      "-XX:MaxGCPauseMillis=200",
      "-XX:MaxTenuringThreshold=1",
      "-XX:SurvivorRatio=32",
      "-Dusing.aikars.flags=https://mcflags.emc.gs",
      "-Daikars.new.flags=true",
    ].join(" "),
    altFlags: new Map<number, string>([
      // Alternate values for different memory sizes. The outputted flags will match the closest lower bound.
      // Example: If the memory is 12 or 13.5, the flags for 12 will be used, and if the memory is 4 or 11.5, the flags for 0 will be used.
      [
        0,
        [
          "-XX:G1NewSizePercent=30",
          "-XX:G1MaxNewSizePercent=40",
          "-XX:G1HeapRegionSize=8M",
          "-XX:G1ReservePercent=20",
          "-XX:InitiatingHeapOccupancyPercent=15",
        ].join(" "),
      ],
      [
        12,
        [
          "-XX:G1NewSizePercent=40",
          "-XX:G1MaxNewSizePercent=50",
          "-XX:G1HeapRegionSize=16M",
          "-XX:G1ReservePercent=15",
          "-XX:InitiatingHeapOccupancyPercent=20",
        ].join(" "),
      ],
    ]),
    description: "Optimized Minecraft flags by Aikar for better server performance.",
  },
  {
    label: "None",
    value: "",
    description: "No additional flags.",
  },
  {
    label: "Velocity",
    value: [
      "-XX:+AlwaysPreTouch",
      "-XX:+ParallelRefProcEnabled",
      "-XX:+UnlockExperimentalVMOptions",
      "-XX:+UseG1GC",
      "-XX:G1HeapRegionSize=4M",
      "-XX:MaxInlineLevel=15",
    ].join(" "),
    description: "Flags recommended for use with the Velocity proxy server.",
  },
];
const AIKARS = FLAGS[0];
const NONE = FLAGS[1];
const VELOCITY = FLAGS[2];

const isServerSide = typeof document === "undefined";

// Works with the altFlags property of the Option object defined in Select.tsx.
// Returns the flags for the closest lower bound of memory. Necessary for Aikar's flags that change depending on memory size.
// Takes in memory and selectedFlag as arguments. Returns a string of flags.
// Returns "" if the selectedFlag does not have an altFlags property.
function getAltFlags(memory: number, selectedFlag: Option): string {
  if (!selectedFlag.altFlags) return "";
  let closestKey = 0;
  for (const currentKey of selectedFlag.altFlags.keys()) {
    if (memory >= currentKey && currentKey > closestKey) {
      closestKey = currentKey;
    }
  }
  return selectedFlag.altFlags.get(closestKey);
}

const generateStartCommand = (
  memory: number,
  selectedFlag: Option,
  filename: string,
  guiEnabled: boolean,
  autoRestartEnabled: boolean,
  platform: Option
) => {
  setTimeout(resizeOutput, 0);
  let content = "";
  const command = `java -Xms${memory * 1024}M -Xmx${memory * 1024}M ${selectedFlag.value}${getAltFlags(memory, selectedFlag)}${selectedFlag === NONE ? "" : " "}-jar ${filename === "" ? "server.jar" : filename} ${guiEnabled || selectedFlag === VELOCITY ? "" : "nogui"}`;

  if (autoRestartEnabled)
    content = (platform === WINDOWS ? WINDOWS_AUTO_RESTART : LINUX_AUTO_RESTART).replace(
      "%%CONTENT%%",
      command
    );
  else content = platform === WINDOWS ? command + "\n\npause" : command;

  content = (platform === LINUX ? "#!/usr/bin/env sh\n\n" : "@echo off\n\n") + content;

  return content;
};

const resizeOutput = () => {
  if (isServerSide) return;
  const element = document.getElementById("output-command-text");
  if (!element) return;

  element.style.height = "auto";
  const scrollHeight = element.scrollHeight;

  requestAnimationFrame(() => {
    element.style.height = `${scrollHeight}px`;
  });
};

const StartScriptGenerator: React.FC = () => {
  const [memory, setMemory] = useState(4.0);
  const [filename, setFilename] = useState("server.jar");
  const [selectedFlag, setSelectedFlag] = useState(AIKARS);
  const [guiEnabled, setGuiEnabled] = useState(false);
  const [autoRestart, setAutoRestart] = useState(false);
  const [platform, setPlatform] = useState(LINUX);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleGreenButtonHighlight = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    setState(true);
    setTimeout(function () {
      setState(false);
    }, 500);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      generateStartCommand(memory, selectedFlag, filename, guiEnabled, autoRestart, platform)
    );
    handleGreenButtonHighlight(setCopySuccess);
  };

  const handleDownload = () => {
    handleGreenButtonHighlight(setDownloadSuccess);
    const blob = new Blob(
      [generateStartCommand(memory, selectedFlag, filename, guiEnabled, autoRestart, platform)],
      {
        type: "text/plain",
      }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "start." + (platform === WINDOWS ? "bat" : "sh");
    link.click();
    link.remove();
  };

  useEffect(() => {
    resizeOutput();
  }, [memory, filename, selectedFlag, guiEnabled, autoRestart]);

  return (
    <div className="server-config-container">
      <h4>Server Configuration</h4>
      <div className="config-section">
        <label id="memory-slider-label" className="sr-only">
          Memory Usage: {memory}GB
        </label>
        <input
          id="memory-slider"
          type="range"
          min={0.5}
          max={24}
          step={0.5}
          list="slide-markers-datalist"
          value={memory}
          onChange={(e) => setMemory(parseFloat(e.target.value))}
          aria-labelledby="memory-slider-label"
        />
        <datalist id="slide-markers-datalist" className="slider-markers">
          <option className="slider-marker"></option>
          {markerPoints.map((point) => (
            <option key={point} className="slider-marker">
              {point}GB
            </option>
          ))}
          <option className="slider-marker"></option>
        </datalist>
      </div>
      <div className={"middle-flex-wrapper"}>
        <div className="config-section">
          <label htmlFor="filename-input">Filename:</label>
          <input
            id="filename-input"
            type="text"
            value={filename}
            placeholder={"server.jar"}
            onChange={(e) => setFilename(e.target.value)}
            className={"filename-input"}
          />
        </div>
        <div className={"config-section"}>
          <label htmlFor="platform-dropdown">Platform:</label>
          <Select options={PLATFORMS} value={platform} onSelect={setPlatform} />
        </div>
        <div className="config-section">
          <label htmlFor="flags-dropdown">Flags:</label>
          <Select options={FLAGS} value={selectedFlag} onSelect={setSelectedFlag} />
        </div>
      </div>
      <div className="config-section toggles">
        {selectedFlag != VELOCITY && (
          <div className={"gui-container"}>
            <label className={"margin-right--sm"}>GUI:</label>
            <input
              type="checkbox"
              id="gui-toggle"
              className="checkbox"
              onChange={() => setGuiEnabled(!guiEnabled)}
            />
            <label htmlFor="gui-toggle" className="switch"></label>
          </div>
        )}
        <div className={"gui-container"}>
          <label className={"margin-right--sm"}>Auto-Restart:</label>
          <input
            type="checkbox"
            id="restart-toggle"
            className="checkbox"
            onChange={() => setAutoRestart(!autoRestart)}
          />
          <label htmlFor="restart-toggle" className="switch"></label>
        </div>
      </div>
      <div className="config-section">
        <h4>Generated Command</h4>
        <textarea
          className={"output-command"}
          value={generateStartCommand(
            memory,
            selectedFlag,
            filename,
            guiEnabled,
            autoRestart,
            platform
          )}
          id={"output-command-text"}
          readOnly
        />
        <div className="copy-button">
          <Button
            label="Copy to Clipboard"
            onClick={handleCopyToClipboard}
            id="clipboard-copy-button"
            success={copySuccess}
          />
          <Button
            label="Download"
            onClick={handleDownload}
            id="contents-download-button"
            success={downloadSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default StartScriptGenerator;
