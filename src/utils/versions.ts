import { GITHUB_OPTIONS } from "./git";

// this is resolved on build-time, not by the client

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

// prettier-ignore
const manifest: Manifest = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")
  .then((r) => r.json());

export const LATEST_MC_RELEASE = manifest.latest.release;

interface Project {
  versions: Record<string, string[]>;
}

const fetchFillVersions = async (id: string): Promise<string[]> => {
  const project: Project = await fetch(`https://fill.papermc.io/v3/projects/${id}`).then((r) => r.json());

  return Object.values(project.versions).flat();
};

const paperVersions = await fetchFillVersions("paper");

export const LATEST_PAPER_RELEASE = paperVersions[0];

const velocityVersions = await fetchFillVersions("velocity");

export const LATEST_VELOCITY_RELEASE = velocityVersions[0];

const foliaVersions = await fetchFillVersions("folia");

export const LATEST_FOLIA_RELEASE = foliaVersions[0];

const waterfallVersions = await fetchFillVersions("waterfall");

export const LATEST_WATERFALL_RELEASE = waterfallVersions[0];

interface Tag {
  name: string;
}

const userdevVersions: string[] = await fetch("https://api.github.com/repos/PaperMC/paperweight/tags", GITHUB_OPTIONS)
  .then((r) => (r.ok ? r.json() : [{ name: "v0.0.0" }]))
  .then((tags: Tag[]) => tags.map((t) => t.name.substring(1)));

export const LATEST_USERDEV_RELEASE = userdevVersions[0];
