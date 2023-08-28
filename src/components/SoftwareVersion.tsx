import React, {useEffect, useState} from "react";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function SoftwareVersion({ versionType }) {
    const [fetched, setFetched] = useState(null);

    useEffect(() => {
        (async () => {

            let version = '';

            if (versionType === 'maj-min') {
                version = await SoftwareVersionFetcher.getMajorMinorVersion("paper");
            } else if (versionType === 'maj') {
                version = await SoftwareVersionFetcher.getMajorVersion("paper");
            } else if (versionType === 'max') {
                version = await SoftwareVersionFetcher.getMaxVersion("paper");
            }

            setFetched(version);
        })();

    }, [versionType]);

    if (!fetched) {
        return null;
    }

    return fetched;
}
