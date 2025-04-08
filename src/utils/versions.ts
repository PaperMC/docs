interface Latest {
  release: string;
  snapshot: string;
}

interface Version {
  id: string;
  type: "release" | "snapshot" | "old_beta" | "old_alpha";
}

interface Manifest {
  latest: Latest;
  versions: Version[];
}

const VERSION_MANIFEST_V2 = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";

// this is resolved on build-time, not by the client
const manifest: Manifest = await fetch(VERSION_MANIFEST_V2).then((r) => r.json());

export const LATEST_RELEASE = manifest.latest.release;
