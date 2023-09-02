import React, {useEffect, useState} from "react";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function VersionedJavaDocLink({ target, project = "paper", children }) {
    const [href, setHref] = useState(null);

    useEffect(() => {
        (async () => {
            let version = await SoftwareVersionFetcher.getMajorVersion(project);
            if (project === "velocity") {
                version = version[0] + ".0.0";
            }

            setHref("https://jd.papermc.io/" + project + "/" + version + target);
        })();
    }, [target]);

    return (
        <a href={href}>{children}</a>
    );
}
