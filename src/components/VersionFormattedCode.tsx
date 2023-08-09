import React from "react";
import CodeBlock from "@docusaurus/theme-classic/lib/theme/CodeBlock";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function VersionFormattedCode({ language, children }) {
    let code = children.props.children;
    let inline = true;

    if (code.props) {
        code = code.props.children;
        inline = false;
    }

    code = code.toString();

    // Replace the placeholder with the versions
    // Replace %%_MAJOR_MC_%% with the major Minecraft version
    code = code.replace(/%%_MAJ_MC_%%/g, SoftwareVersionFetcher.getMajorPaperVersion());

    // Replace %%_MAJ_MIN_MC_%% with the minor Minecraft version
    code = code.replace(/%%_MAJ_MIN_MC_%%/g, SoftwareVersionFetcher.getMajorMinorPaperVersion());

    return (
        inline ?
            <code>{code}</code>
            :
            <CodeBlock language={language}>{code}</CodeBlock>
    );
}