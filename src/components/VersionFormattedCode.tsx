import React, {useEffect, useRef, useState} from "react";
import CodeBlock from "@docusaurus/theme-classic/lib/theme/CodeBlock";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function VersionFormattedCode({ language = "", title = "", showLineNumbers = false, children }) {
    const [formattedCode, setFormattedCode] = useState(null);
    const mounted = useRef(true);

    useEffect(() => {
        (async () => {
            let code = children.props.children;
            let inline = true;

            if (code.props) {
                code = code.props.children;
                inline = false;
            }

            // Fetch version data
            const majorVersion = await SoftwareVersionFetcher.getMajorPaperVersion();
            const majorMinorVersion = await SoftwareVersionFetcher.getMajorMinorPaperVersion();

            // Replace placeholders with fetched versions
            code = code.toString().replace(/%%_MAJ_MC_%%/g, majorVersion);
            code = code.replace(/%%_MAJ_MIN_MC_%%/g, majorMinorVersion);

            if (mounted.current) {
                setFormattedCode({code, inline});
            }
        })();

        return () => {
            mounted.current = false;
        };
    }, [children]);

    if (!formattedCode) {
        return null;
    }

    const { code, inline } = formattedCode;

    return (
        inline ?
            <code>{code}</code>
            :
            <CodeBlock language={language} title={title} showLineNumbers={showLineNumbers}>{code}</CodeBlock>
    );
}
