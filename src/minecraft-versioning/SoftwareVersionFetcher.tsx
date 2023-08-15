import axios from 'axios';

class SoftwareVersionFetcher {
    private paperVersion: string = '';
    private maxPaperVersion: string = '';
    private currentURLVersion: string | null = null;
    private static readonly VERSION_PATTERN: RegExp = /\/(\d+\.\d+)(?:\/|$)/;
    private versionCache: Map<string, { version: string, timestamp: number }> = new Map();
    private initPromise: Promise<void> | null = null;
    private initInProgress: boolean = false;

    constructor() {
        this.initVersions();
    }

    private async ensureURLVersionChanges() {
        if (typeof document === 'undefined') return;

        const matchArray = document.location.pathname.match(SoftwareVersionFetcher.VERSION_PATTERN);
        const newURLVersion = matchArray ? matchArray[1] : null;

        if (this.currentURLVersion !== newURLVersion) {
            this.currentURLVersion = newURLVersion;
            await this.initVersions(true);
        }
    }

    private async initVersions(override: boolean = false) {
        if (this.initInProgress) {
            await this.initPromise;
            return;
        }

        if (override || !this.paperVersion) {
            this.initInProgress = true;
            this.initPromise = (async () => {
                try {
                    this.paperVersion = await this.getProjectVersion('paper');
                } finally {
                    this.initInProgress = false;
                }
            })();
            await this.initPromise;
        }
    }

    private async checkVersion(responseData): Promise<string> {
        if (typeof document === 'undefined') return responseData.versions[responseData.versions.length - 1];

        const matchArray = document.location.pathname.match(SoftwareVersionFetcher.VERSION_PATTERN);
        let version = responseData.versions[responseData.versions.length - 1];
        this.maxPaperVersion = version;

        if (matchArray) {
            const filter = responseData.versions.filter((v) => v.toString().includes(matchArray[1]));
            if (filter.length > 0) {
                version = filter[filter.length - 1];
                this.currentURLVersion = matchArray[1];
            } else {
                console.warn('No matching versions found for the given major version.');
            }
        } else {
            this.currentURLVersion = null;
        }
        return version;
    }

    private async getProjectVersion(project: string): Promise<string> {
        const cachedVersion = this.versionCache.get(project);

        if (cachedVersion && Date.now() - cachedVersion.timestamp <= 5 * 60 * 1000) {
            return cachedVersion.version;
        }

        try {
            const response = await axios.get(`https://api.papermc.io/v2/projects/${project}`);
            const version = await this.checkVersion(response.data);

            this.versionCache.set(project, { version, timestamp: Date.now() });
            return version;
        } catch (error) {
            console.error('Error fetching project version:', error);
            return '';
        }
    }

    public async getMajorMinorPaperVersion(): Promise<string> {
        await this.initVersions();
        await this.ensureURLVersionChanges();
        return this.paperVersion;
    }

    public async getMajorPaperVersion(): Promise<string> {
        await this.initVersions();
        await this.ensureURLVersionChanges();
        return this.paperVersion.split('.', 2).join('.');
    }

    public async getMaxPaperVersion(): Promise<string> {
        await this.initVersions();
        await this.ensureURLVersionChanges();
        return this.maxPaperVersion;
    }
}

const softwareVersionFetcher = new SoftwareVersionFetcher();

export default softwareVersionFetcher;
