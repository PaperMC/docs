class ProjectVersionData {
  public version: string = "";
  public maxVersion: string = "";
  public currentURLVersion: string | null = null;
  public initPromise: Promise<void> | null = null;
  public initInProgress: boolean = false;

  constructor(
    public readonly projectName: string,
    private readonly versionPattern: RegExp,
    private readonly versionCache: Map<string, { version: string; timestamp: number }>
  ) {}

  public async init() {
    if (this.initInProgress) {
      await this.initPromise;
      return;
    }

    const cachedVersion = this.versionCache.get(this.projectName);

    if (!this.version || (cachedVersion && Date.now() - cachedVersion.timestamp > 5 * 60 * 1000)) {
      this.initInProgress = true;
      this.initPromise = (async () => {
        try {
          this.version = await this.getProjectVersion();
        } finally {
          this.initInProgress = false;
        }
      })();
      await this.initPromise;
    }
  }

  private async getProjectVersion(): Promise<string> {
    console.log(`Fetching version for project "${this.projectName}"...`);

    try {
      const response = await fetch(`https://api.papermc.io/v2/projects/${this.projectName}`);
      const version = await this.checkVersion(await response.json());

      this.versionCache.set(this.projectName, { version, timestamp: Date.now() });
      return version;
    } catch (error) {
      console.error("Error fetching project version:", error);
      return "";
    }
  }

  private async checkVersion(responseData: { versions: any[] }): Promise<string> {
    if (typeof document === "undefined")
      return responseData.versions[responseData.versions.length - 1];

    const matchArray = document.location.pathname.match(this.versionPattern);
    let version = responseData.versions[responseData.versions.length - 1];
    this.maxVersion = version;

    if (matchArray) {
      const filter = responseData.versions.filter((v) => v.toString().includes(matchArray[1]));
      if (filter.length > 0) {
        version = filter[filter.length - 1];
        this.currentURLVersion = matchArray[1];
      } else {
        console.warn("No matching versions found for the given major version.");
      }
    } else {
      this.currentURLVersion = null;
    }
    return version;
  }
}

class SoftwareVersionFetcher {
  private readonly versionCache: Map<string, { version: string; timestamp: number }> = new Map();
  private readonly projects: ProjectVersionData[] = [
    new ProjectVersionData("paper", /\/(\d+\.\d+)(?:\/|$)/, this.versionCache),
    new ProjectVersionData("velocity", /\/(\d+\.\d+)(?:\/|$)/, this.versionCache),
  ];

  constructor() {
    this.initVersions();
  }

  private async initVersions() {
    await Promise.all(this.projects.map((project) => project.init()));
  }

  private async getProject(projectName: string): Promise<ProjectVersionData> {
    const project = this.projects.find((p) => p.projectName === projectName);
    if (!project) throw new Error(`Project "${projectName}" not found.`);

    await project.init();
    return project;
  }

  public async getMajorMinorVersion(projectName: string): Promise<string> {
    const project = await this.getProject(projectName);
    return project.version;
  }

  public async getMajorVersion(projectName: string): Promise<string> {
    const project = await this.getProject(projectName);
    return project.version.split(".", 2).join(".");
  }

  public async getMaxVersion(projectName: string): Promise<string> {
    const project = await this.getProject(projectName);
    return project.maxVersion;
  }
}

const softwareVersionFetcher = new SoftwareVersionFetcher();

export default softwareVersionFetcher;
