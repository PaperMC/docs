import React, {useEffect, useState} from "react";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function VersionedJavaDocLink({ target, project = "velocity", children }: VersionedJavaDocLinkProps) {
    const [href, setHref] = useState<string>(null);

    useEffect(() => {
        (async () => {
            let version = await SoftwareVersionFetcher.getMajorVersion(project);
            if (project === "velocity") {
                version = version.split(".")[0] + ".0.0";
            }

            setHref("https://jd.papermc.io/" + project + "/" + version + target);
        })();
    }, [target]);

    return (
        <a href={href}>{children}</a>
    );
}

interface VersionedJavaDocLinkProps {
    target: string,
    project?: "paper" | "velocity",
    children: any,
}
