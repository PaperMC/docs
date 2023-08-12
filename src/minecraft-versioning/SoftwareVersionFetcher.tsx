import axios from 'axios';

class SoftwareVersionFetcher {

    private paperVersion: string;
    private maxPaperVersion: string;
    private currentURLVersion: string = null;
    private static readonly VERSION_PATTERN: string = "\\/(\\d+\\.\\d+)(?:\\/|$)";

    constructor() {
        this.initVersions();

        // Refreshes every 5 minutes
        setInterval(() => {
            this.initVersions(true);
        }, 60 * 5 * 1000);

        setInterval(() => {
            this.ensureURLVersionChanges();
        }, 100);
    }

    private async ensureURLVersionChanges() {
        if (typeof document === 'undefined') return;

        let matchArray = document.location.pathname.match(SoftwareVersionFetcher.VERSION_PATTERN);
        if (matchArray) {
            // This means the new page is versioned, so we need to check if the version has changed
            if (this.currentURLVersion !== matchArray[1]) {
                this.currentURLVersion = matchArray[1];
                await this.initVersions(true);
            }
        } else {
            // This means the new page is not versioned, so we need to check if the last page was versioned
            if (this.currentURLVersion !== null) {
                this.currentURLVersion = null;
                await this.initVersions(true);
            }
        }
    }

    private async initVersions(override: boolean = false) {
        if (override || !this.paperVersion || this.paperVersion === "undefined") {
            this.paperVersion = await this.getProjectVersion("paper");
        }
    }

    private async checkVersion(response_data): Promise<string> {
        if(typeof document === 'undefined')
            return response_data.versions[response_data.versions.length - 1];

        // This looks for the version in the URL, and if it's not found, it uses the latest version
        let matchArray = document.location.pathname.match(SoftwareVersionFetcher.VERSION_PATTERN);
        let version = response_data.versions[response_data.versions.length - 1];
        this.maxPaperVersion = version;

        // If this is a versioned page, use the max minor version for that major version
        if (matchArray) {
            const filter = response_data.versions.filter((v) => v.toString().includes(matchArray[1]));
            if (filter.length > 0) {
                version = filter[filter.length - 1];
                this.currentURLVersion = matchArray[1];
                console.log("[SoftwareVersioner] Versioned page detected, using max minor version " + version);
            }
            // Something has gone really wrong, just return the latest version
        } else {
            this.currentURLVersion = null;
        }
        console.log("[SoftwareVersioner] No versioned page detected, using latest version");
        return version;
    }

    private async getProjectVersion(project: string): Promise<string> {
        try {
            const response = await axios.get(`https://api.papermc.io/v2/projects/${project}`);
            return await this.checkVersion(response.data);
        } catch (error) {
            console.error('Error fetching project version:', error);
            return '';
        }
    }

    public getMajorMinorPaperVersion(): string {
        return this.paperVersion;
    }

    public getMajorPaperVersion(): string {
        if (!this.paperVersion) return "";

        const parts = this.paperVersion.split(".");
        parts.length = 2;
        return parts.join(".");
    }

    public getMaxPaperVersion(): string {
        return this.maxPaperVersion;
    }
}

const softwareVersionFetcher = new SoftwareVersionFetcher();

export default softwareVersionFetcher;