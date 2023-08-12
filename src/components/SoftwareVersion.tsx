import React, {useEffect, useState} from "react";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function SoftwareVersion({ versionType }) {
    const [fetched, setFetched] = useState(null);

    useEffect(() => {
        async function fetchVersion() {

            let version = '';

            if (versionType === 'maj-min') {
                version = await SoftwareVersionFetcher.getMajorMinorPaperVersion();
            } else if (versionType === 'maj') {
                version = await SoftwareVersionFetcher.getMajorPaperVersion();
            } else if (versionType === 'max') {
                version = await SoftwareVersionFetcher.getMaxPaperVersion();
            }

            setFetched(version);
        }

        fetchVersion();
    }, [versionType]);

    if (!fetched) {
        return null;
    }

    return fetched;
}
