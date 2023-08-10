import axios from 'axios';

class SoftwareVersionFetcher {

    public paperVersion: string;
    public maxPaperVersion: string;

    constructor() {
        this.initVersions();

        // Refreshes every 5 minutes
        setInterval(() => {
            this.initVersions(true);
        }, 60 * 5 * 1000);
    }

    private async initVersions(override: boolean = false) {
        if (override || !this.paperVersion || this.paperVersion === "undefined") {
            this.paperVersion = await this.getProjectVersion("paper");
        }
    }

    private async checkVersion(response_data): Promise<string> {
        // This looks for the version in the URL, and if it's not found, it uses the latest version
        const versionPattern = "\\/(\\d+\\.\\d+)(?:\\/|$)";
        let matchArray = document.location.pathname.match(versionPattern);
        let version = response_data.versions[response_data.versions.length - 1];
        this.maxPaperVersion = version;

        // If this is a versioned page, use the max minor version for that major version
        if (matchArray) {
            const filter = response_data.versions.filter((v) => v.toString().includes(matchArray[1]));
            if (filter.length > 0) {
                version = filter[filter.length - 1];
                console.log("[SoftwareVersioner] Versioned page detected, using max minor version " + version);
            }
            // Something has gone really wrong, just return the latest version
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