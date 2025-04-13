// Versions just manually obtained from https://jd.advntr.dev. Will be fetched dynamically later

const versions: Map<string, string> = new Map(
  Object.entries({
    "serializer-configurate4": "4.20.0",
    "text-minimessage": "4.20.0",
    "serializer-configurate3": "4.15.0",
    api: "4.20.0",
    "text-serializer-gson-legacy-impl": "4.20.0",
    "text-serializer-gson": "4.20.0",
    "text-serializer-commons": "4.20.0",
    "text-logger-slf4j": "4.20.0",
    key: "4.20.0",
    nbt: "4.20.0",
    "text-serializer-plain": "4.20.0",
    "ext-serializer-legacy": "4.20.0",
    "ext-serializer-json-legacy-impl": "4.20.0",
    ansi: "1.1.1",
    "text-serializer-json": "4.20.0",
    "text-serializer-ansi": "4.20.0",
    "text-serializer-legacy-text3": "4.3.4",
    spongeapi: "4.3.4",
    bukkit: "4.3.4",
    "text-serializer-bungeecord": "4.3.4",
    "adventure-platform-fabric": "6.3.0",
    facet: "4.3.4",
    // "api": "4.3.4", -- Duplicate key?
    bungeecord: "4.3.4",
    viaversion: "4.3.4",
    neoforge: "6.3.0",
    "mod-shared": "6.3.0",
  })
);

export const getVersion = (project: string) => {
  const out = versions.get(project);
  if (out == null) {
    throw `Cannot resolve project version from project ${project}!`;
  }

  return out;
};
