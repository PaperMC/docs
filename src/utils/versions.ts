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
  project: {
    id: string;
  };
  versions: {
    [key: string]: string[];
  };
}

function flattenVersions(project: Project) {
  return Object.entries(project.versions).flatMap(([_, versions]) => versions);
}

const paperProject: Project = await fetch("https://fill.papermc.io/v3/projects/paper").then((r) => r.json());

export const LATEST_PAPER_RELEASE = flattenVersions(paperProject)[0];

const velocityProject: Project = await fetch("https://fill.papermc.io/v3/projects/velocity").then((r) => r.json());

export const LATEST_VELOCITY_RELEASE = flattenVersions(velocityProject)[0];

const foliaProject: Project = await fetch("https://fill.papermc.io/v3/projects/folia").then((r) => r.json());

export const LATEST_FOLIA_RELEASE = flattenVersions(foliaProject)[0];

const waterfallProject: Project = await fetch("https://fill.papermc.io/v3/projects/waterfall").then((r) => r.json());

export const LATEST_WATERFALL_RELEASE = flattenVersions(waterfallProject)[0];

interface Tag {
  name: string;
}

const userdevVersions: string[] = await fetch("https://api.github.com/repos/PaperMC/paperweight/tags", GITHUB_OPTIONS)
  .then((r) => (r.ok ? r.json() : [{ name: "v0.0.0" }]))
  .then((tags: Tag[]) => tags.map((t) => t.name.substring(1)));

export const LATEST_USERDEV_RELEASE = userdevVersions[0];
