import properties from "@site/config-specs/properties.json";

export function hasProperty(key: string): boolean {
  return key in properties;
}

export function getProperty(key: string): string | null {
  return properties[key] ?? null;
}

interface PropertyProps {
    name: string;
    defaultValue?: string;
}

export default function Property({ name, defaultValue = "<placeholder>" }: PropertyProps) {
  if (!hasProperty(name)) {
    return defaultValue;
  }

  return getProperty(name);
}
