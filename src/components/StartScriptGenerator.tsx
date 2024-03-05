import React, { useEffect, useState, useRef } from "react";
import "@site/src/css/start-script-generator.css";

const markerPoints = [4, 8, 12, 16, 20];

type FlagType = {
  label: string;
  value: string;
  description: string;
};

const WINDOWS_AUTO_RESTART =
  ":start\n%%CONTENT%%\n\necho Server restarting...\necho Press CTRL + C to stop.\ngoto :start";
const LINUX_AUTO_RESTART =
  "while [ true ]; do\n    %%CONTENT%%\n    echo Server restarting...\n    echo Press CTRL + C to stop.\ndone";

const FLAGS: { [key: string]: FlagType } = {
  AIKARS: {
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
    ].join(" "),
    description: "Optimized Minecraft flags by Aikar for better server performance.",
  },
  NONE: {
    label: "None",
    value: "",
    description: "No additional flags.",
  },
  VELOCITY: {
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
};

const isServerSide = typeof document === "undefined";

const generateStartCommand = (
  memory: number,
  selectedFlag: FlagType,
  filename: string,
  guiEnabled: boolean,
  autoRestartEnabled: boolean,
  platform: string
) => {
  setTimeout(resizeOutput, 0);
  let content = "";
  const command = `java -Xmx${memory * 1024}M -Xms${memory * 1024}M ${selectedFlag.value}${selectedFlag === FLAGS.NONE ? "" : " "}-jar ${filename === "" ? "server.jar" : filename} ${guiEnabled || selectedFlag === FLAGS.VELOCITY ? "" : "--nogui"}`;

  if (autoRestartEnabled)
    content = (platform === "windows" ? WINDOWS_AUTO_RESTART : LINUX_AUTO_RESTART).replace(
      "%%CONTENT%%",
      command
    );
  else content = command;

  if (platform === "linux") content = "#!/bin/bash\n\n" + content;

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
  const [selectedFlag, setSelectedFlag] = useState(FLAGS.AIKARS);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [guiEnabled, setGuiEnabled] = useState(false);
  const [autoRestart, setAutoRestart] = useState(false);
  const [platform, setPlatform] = useState("linux");
  const dropdownRef = useRef(null);

  const handleClickOutside = (event: { target: EventTarget | null }) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  const handleGreenButtonHighlight = (element: HTMLElement | null) => {
    if (!element) return;
    element.classList.add("success");
    setTimeout(function () {
      element.classList.remove("success");
    }, 500);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      generateStartCommand(memory, selectedFlag, filename, guiEnabled, autoRestart, platform)
    );
    handleGreenButtonHighlight(document.getElementById("clipboard-copy-button"));
  };

  const handleDownload = () => {
    handleGreenButtonHighlight(document.getElementById("contents-download-button"));
    const blob = new Blob(
      [generateStartCommand(memory, selectedFlag, filename, guiEnabled, autoRestart, platform)],
      {
        type: "text/plain",
      }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "start." + (platform === "windows" ? "bat" : "sh");
    link.click();
    link.remove();
  };

  useEffect(() => {
    resizeOutput();
    if (isServerSide) return;
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [memory, filename, selectedFlag, guiEnabled, autoRestart]);

  return (
    <div className="server-config-container">
      <h2>Server Configuration</h2>
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
          value={memory}
          onChange={(e) => setMemory(parseFloat(e.target.value))}
          aria-labelledby="memory-slider-label"
        />
        <div className="slider-markers">
          {markerPoints.map((point) => (
            <div
              key={point}
              className="slider-marker"
              style={{ left: `${((point - 0.5) / 23.5) * 100}%` }}
            >
              {point}GB
            </div>
          ))}
        </div>
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
        <div className="config-section">
          <label htmlFor="flags-dropdown">Flags:</label>
          <div className="custom-dropdown" ref={dropdownRef}>
            <div className="selected-flag" onClick={() => setDropdownVisible(!dropdownVisible)}>
              {selectedFlag.label}
            </div>
            {dropdownVisible && (
              <div className="dropdown-content">
                {Object.values(FLAGS).map((flag) => (
                  <div
                    key={flag.label}
                    className={`dropdown-item ${flag === selectedFlag ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedFlag(flag);
                      setDropdownVisible(false);
                    }}
                  >
                    <div className="flag-label">{flag.label}</div>
                    <div className="flag-description">{flag.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="config-section">
        <div className={"gui-container"}>
          <label style={{ marginRight: "10px" }}>GUI:</label>
          <input
            type="checkbox"
            id="gui-toggle"
            className="checkbox"
            onChange={() => setGuiEnabled(!guiEnabled)}
          />
          <label htmlFor="gui-toggle" className="switch"></label>
        </div>
        <div className={"gui-container"}>
          <label style={{ marginRight: "10px" }}>Auto-Restart:</label>
          <input
            type="checkbox"
            id="restart-toggle"
            className="checkbox"
            onChange={() => setAutoRestart(!autoRestart)}
          />
          <label htmlFor="restart-toggle" className="switch"></label>
        </div>

        <div className={"platform-selector"}>
          <label>Platform:</label>
          <select id={"platform-select"} onChange={(event) => setPlatform(event.target.value)}>
            <option value="linux">Linux/Mac</option>
            <option value="windows">Windows</option>
          </select>
          {platform === "windows" && (
            <p className={"windows-warning"}>For optimal performance, we recommend running Linux</p>
          )}
        </div>
      </div>
      <div className="config-section">
        <label>Generated Command:</label>
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
        <div className={"copy-button"}>
          <button id={"clipboard-copy-button"} onClick={handleCopyToClipboard}>
            Copy to Clipboard
          </button>
          <button id={"contents-download-button"} onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScriptGenerator;
