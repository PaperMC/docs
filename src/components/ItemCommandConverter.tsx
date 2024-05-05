import React, { useState } from "react";
import Button from "@site/src/components/ui/Button";
import Select, { Option } from "@site/src/components/ui/Select";
import "@site/src/css/item-command-converter.scss";
import AutoComplete from "@site/src/components/ui/AutoComplete";

const MODES: Option[] = [
  { label: "Command", value: "command" },
  { label: "Item Argument", value: "item-argument" },
  { label: "Component Argument", value: "component-argument" },
  { label: "Entity Argument", value: "entity-argument" },
];

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
].map((e) => ({ label: e, value: e }));

const ItemCommandConverter: React.FC = () => {
  const [convertSuccess, setConvertSuccess] = useState(false);
  const [convertError, setConvertError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState(MODES[0]);
  const [entityType, setEntityType] = useState<Option>();
  const [loading, setLoading] = useState(false);

  const toggleState = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    setState(true);
    setTimeout(() => setState(false), 500);
  };

  const convert = async () => {
    setOutput("");
    setLoading(true);
    try {
      const query = mode === MODES[3] ? "?entityType=" + entityType?.value : "";
      const response = await fetch(
        "https://item-converter.papermc.io/convert-" + mode.value + query,
        {
          method: "POST",
          body: input,
        }
      );
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
          <Select options={MODES} value={mode} onSelect={setMode} />
        </label>
        {mode === MODES[3] && (
          <label>
            <span>Entity Type:</span>
            <AutoComplete
              options={ENTITY_TYPES}
              value={entityType}
              onSelect={setEntityType}
              placeholder="Enter Entity Type"
            />
          </label>
        )}
      </div>
      <label className="item-command-converter__output">
        Output:
        <textarea placeholder={"Press 'Convert' to convert the command."} readOnly value={output} />
      </label>
      <Button label="Copy output" success={copySuccess} onClick={copy} disabled={loading} />
    </div>
  );
};
export default ItemCommandConverter;
