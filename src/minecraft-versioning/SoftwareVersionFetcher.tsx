import axios from 'axios';

class SoftwareVersionFetcher {

    public paperVersion: string;

    constructor() {
        this.initVersions();

        // Refreshes every 5 minutes
        setInterval(() => {
            this.initVersions(true);
        }, 60 * 5 * 1000);
    }

    private async initVersions(override: boolean = false) {
        this.paperVersion = localStorage.getItem("paper-docs.paper.version");
        if (override || !this.paperVersion || this.paperVersion === "undefined") {
            this.paperVersion = await this.getProjectVersion("paper");
        }
    }

    private async getProjectVersion(project: string): Promise<string> {
        try {
            const response = await axios.get(`https://api.papermc.io/v2/projects/${project}`);
            const version = response.data.versions[response.data.versions.length - 1];
            localStorage.setItem(`paper-docs.${project}.version`, version);
            return version;
        } catch (error) {
            console.error('Error fetching project version:', error);
            return '';
        }
    }

    public getMajorMinorPaperVersion(): string {
        return this.paperVersion;
    }

    public getMajorPaperVersion(): string {
        const parts = this.paperVersion.split(".");
        parts.length = 2;
        return parts.join(".");
    }
}

const softwareVersionFetcher = new SoftwareVersionFetcher();

export default softwareVersionFetcher;