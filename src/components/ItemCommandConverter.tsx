import React, { useState } from "react";
import Button from "@site/src/components/ui/Button";
import "@site/src/css/item-command-converter.css";

const ItemCommandConverter: React.FC = () => {
  const [convertSuccess, setConvertSuccess] = useState(false);
  const [convertError, setConvertError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("command");
  const [loading, setLoading] = useState(false);

  const toggleState = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    setState(true);
    setTimeout(function () {
      setState(false);
    }, 500);
  };

  const convert = async () => {
    setOutput("");
    setLoading(true);
    try {
      const response = await fetch("https://item-converter.papermc.io/convert-" + mode, {
        method: "POST",
        body: input,
      });
      if (response.status === 200) {
        setOutput(await response.text());
        toggleState(setConvertSuccess);
      } else {
        console.warn(
          "Failed to convert command: " + response.status + ": " + (await response.text())
        );
        toggleState(setConvertError);
      }
    } catch (error) {
      console.error("Failed to convert command: " + error);
      toggleState(setConvertError);
    }
    setLoading(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toggleState(setCopySuccess);
  };

  return (
    <div className="item-command-converter">
      <label>
        Input:
        <textarea
          placeholder="Enter your 1.20.4 command here..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </label>
      <div className="item-command-converter__action">
        <Button
          label="Convert"
          success={convertSuccess}
          error={convertError}
          onClick={convert}
          disabled={loading}
        />
        <label>
          Mode:
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="command">Command</option>
            <option value="item-argument">Item Argument</option>
            <option value="component-argument">Component Argument</option>
          </select>
        </label>
      </div>
      <label>
        Output:
        <textarea placeholder={"Press 'Convert' to convert the command."} readOnly value={output} />
      </label>
      <Button label="Copy output" success={copySuccess} onClick={copy} disabled={loading} />
    </div>
  );
};
export default ItemCommandConverter;
