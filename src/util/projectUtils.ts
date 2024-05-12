class ExpiringValue<T> {
  readonly ttl: number;
  readonly resolver: () => Promise<T>;

  private _value: Promise<T>;
  private _timestamp: number = 0;

  constructor(ttl: number, resolver: () => Promise<T>) {
    this.ttl = ttl;
    this.resolver = resolver;
  }

  get value(): Promise<T> {
    if (Date.now() - this._timestamp > this.ttl) {
      this._timestamp = Date.now();
      this._value = new Promise((resolve, reject) => {
        this.resolver().then(resolve, reject);
      });
    }

    return this._value;
  }
}

const createProjectVersionValue = (
  project: string,
  ttl: number = 5 * 60 * 1000
): ExpiringValue<string> => {
  return new ExpiringValue(ttl, () => {
    return fetch(`https://api.papermc.io/v2/projects/${project}`)
      .then((r) => r.json())
      .then((r) => r.versions[r.versions.length - 1]);
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

const projects: { [project: Project]: ExpiringValue<string> } = {
  paper: createProjectVersionValue("paper"),
  velocity: createProjectVersionValue("velocity"),
};

export const getProjectVersion = async (
  project: Project,
  versionType: VersionType = VersionType.MajorMinorPatch
): Promise<string | null> => {
  let version = await (projects[project]?.value ?? Promise.resolve(null));
  if (!version) {
    return null;
  }

  switch (versionType) {
    case VersionType.Major:
      version = version.split(".")[0];
    case VersionType.MajorZeroed:
      version = version.split(".")[0] + ".0.0";
    case VersionType.MajorMinor:
      version = version.split(".", 2).join(".");
    case VersionType.MajorMinorZeroed:
      version = version.split(".", 2).join(".") + ".0";
  }
  return version;
};
