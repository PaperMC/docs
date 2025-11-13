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

interface Tag {
  name: string;
}

const fetchGitHubTags = async (repo: string) =>
  await fetch(`https://api.github.com/repos/${repo}/tags`, GITHUB_OPTIONS)
    .then((r) => (r.ok ? r.json() : [{ name: "v0.0.0" }]))
    .then((tags: Tag[]) => tags.map((t) => t.name.substring(1)));

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

  // find the newest version with at least one non-alpha build
  for (const version of versions) {
    const builds = await fetchBuilds(project, version);
    if (builds.some((b) => b.channel !== "ALPHA")) {
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

const userdevVersions: string[] = await fetchGitHubTags("PaperMC/paperweight");

export const LATEST_USERDEV_RELEASE = userdevVersions[0];

export const LATEST_ADVENTURE_SUPPORTED_MC = "1.21.9";
export const LATEST_ADVENTURE_SUPPORTED_MC_RANGE = LATEST_ADVENTURE_SUPPORTED_MC;
export const LATEST_ADVENTURE_API_RELEASE = "4.25.0";
export const LATEST_ADVENTURE_PLATFORM_RELEASE = "4.4.1";
export const LATEST_ADVENTURE_PLATFORM_MOD_RELEASE = "6.7.0";
export const LATEST_ANSI_RELEASE = "1.1.1";
