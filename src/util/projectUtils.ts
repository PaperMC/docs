class ExpiringValue<T> {
  readonly ttl: number;
  readonly resolver: () => Promise<T>;

  private _value: Promise<T>;
  private _timestamp: number = 0;

  constructor(ttl: number, resolver: () => Promise<T>) {
    this.ttl = ttl;
    this.resolver = resolver;
  }

  value(): Promise<T> {
    if (Date.now() - this._timestamp > this.ttl) {
      this._timestamp = Date.now();
      this._value = new Promise((resolve, reject) => {
        this.resolver().then(resolve, reject);
      });
    }

    return this._value;
  }
}

const createProjectVersionsValue = (
  project: string,
  ttl: number = 5 * 60 * 1000
): ExpiringValue<string[]> => {
  return new ExpiringValue(ttl, async () => {
    const result = await fetch(`https://api.papermc.io/v2/projects/${project}`).then((r) =>
      r.json()
    );

    return result.versions;
  });
};

export type Project = "paper" | "velocity";

export enum VersionType {
  Major,
  MajorZeroed,
  MajorMinor,
  MajorMinorZeroed,
  MajorMinorPatch,
}

const projects: Record<Project, ExpiringValue<string[]>> = {
  paper: createProjectVersionsValue("paper"),
  velocity: createProjectVersionsValue("velocity"),
};

export interface DocusaurusVersion {
  pluginId: string;
  version: string;
  isLast: boolean;
}

export const getProjectVersion = async (
  project: Project,
  baseVersion: DocusaurusVersion | null,
  versionType: VersionType = VersionType.MajorMinorPatch
): Promise<string | null> => {
  const versionsValue = projects[project];
  if (!versionsValue) {
    return null;
  }

  let versions = await versionsValue.value();
  if (baseVersion && baseVersion.pluginId === project && !baseVersion.isLast) {
    // restrict version lookup to the newest patch of the base version
    versions = versions.filter((v) => v.startsWith(baseVersion.version));
  }

  const version = versions[versions.length - 1];
  switch (versionType) {
    case VersionType.Major:
      return version.split(".")[0];
    case VersionType.MajorZeroed:
      return version.split(".")[0] + ".0.0";
    case VersionType.MajorMinor:
      return version.split(".", 2).join(".");
    case VersionType.MajorMinorZeroed:
      return version.split(".", 2).join(".") + ".0";
  }

  return version;
};
