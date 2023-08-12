import React, {useEffect, useState} from "react";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function VersionedJavaDocLink({ target, children }) {
    const [href, setHref] = useState(null);

    useEffect(() => {
        async function fetchHrefLink() {
            setHref("https://jd.papermc.io/paper/" + await SoftwareVersionFetcher.getMajorPaperVersion() + target);
        }

        fetchHrefLink();
    }, [target]);

    return (
        <a href={href}>{children}</a>
    );
}
