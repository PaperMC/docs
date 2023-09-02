import React, {useEffect, useState} from "react";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function SoftwareVersion({ versionType, project = "paper" }) {
    const [fetched, setFetched] = useState(null);

    useEffect(() => {
        (async () => {

            let version = '';

            if (versionType === 'maj-min') {
                version = await SoftwareVersionFetcher.getMajorMinorVersion(project);
            } else if (versionType === 'maj') {
                version = await SoftwareVersionFetcher.getMajorVersion(project);
            } else if (versionType === 'max') {
                version = await SoftwareVersionFetcher.getMaxVersion(project);
            }

            setFetched(version);
        })();

    }, [versionType]);

    if (!fetched) {
        return null;
    }

    return fetched;
}
