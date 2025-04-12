export interface LeafData {
  description: string;
  default?: string;
}

export interface MessageData {
  message: string;
  color?: string;
}

export type Data = { [key: string]: Data } | LeafData | MessageData;

interface VanillaLeafData extends LeafData {
  vanilla?: string;
}

type VanillaData = { [key: string]: Data } | VanillaLeafData | MessageData;

// replaces "default" values with "vanilla" values, removes them if no "vanilla" value is defined
export const filterVanilla = (input: VanillaData): Data | null => {
  if ("message" in input) {
    return input; // MessageData
  }

  if ("description" in input) {
    const leaf = input as LeafData;
    if ("vanilla" in leaf) {
      leaf.default = (leaf as VanillaLeafData).vanilla!;
      return leaf;
    }

    return null; // remove key
  }

  const result: { [key: string]: Data } = {};
  for (const key in input) {
    const converted = filterVanilla(input[key]);
    if (converted !== null) {
      result[key] = converted;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
};
