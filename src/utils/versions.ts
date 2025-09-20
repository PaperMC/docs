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
  project: { id: string; name: string };
  versions: Record<string, string[]>;
}

const fetchProject = async (id: string): Promise<Project> => {
  return fetch(`https://fill.papermc.io/v3/projects/${id}`).then((r) => r.json());
};

interface Build {
  id: number;
  channel: "ALPHA" | "BETA" | "STABLE" | "RECOMMENDED";
}

const fetchBuilds = async ({ project }: Project, version: string): Promise<Build[]> => {
  return fetch(`https://fill.papermc.io/v3/projects/${project.id}/versions/${version}/builds`).then((r) => r.json());
};

const findLatest = async (project: Project): Promise<string> => {
  const versions = Object.values(project.versions).flat();

  // find the newest version with at least one stable build
  for (const version of versions) {
    const builds = await fetchBuilds(project, version);
    if (builds.some((b) => b.channel === "STABLE")) {
      return version;
    }
  }

  return versions[0];
};

const paperProject = await fetchProject("paper");

export const LATEST_PAPER_RELEASE = await findLatest(paperProject);

const velocityProject = await fetchProject("velocity");

export const LATEST_VELOCITY_RELEASE = await findLatest(velocityProject);

const foliaProject = await fetchProject("folia");

export const LATEST_FOLIA_RELEASE = await findLatest(foliaProject);

const waterfallProject = await fetchProject("waterfall");

export const LATEST_WATERFALL_RELEASE = await findLatest(waterfallProject);

interface Tag {
  name: string;
}

const userdevVersions: string[] = await fetch("https://api.github.com/repos/PaperMC/paperweight/tags", GITHUB_OPTIONS)
  .then((r) => (r.ok ? r.json() : [{ name: "v0.0.0" }]))
  .then((tags: Tag[]) => tags.map((t) => t.name.substring(1)));

export const LATEST_USERDEV_RELEASE = userdevVersions[0];
