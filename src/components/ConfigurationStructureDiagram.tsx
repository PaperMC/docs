import React from "react";

const folderData = [
    {
        name: "config",
        children: [
            { name: "paper-global.yml", url: "/paper/reference/global-configuration" },
            { name: "paper-world-defaults.yml", url: "/paper/reference/world-configuration" },
        ],
    },
    {
        name: "world",
        children: [
            { name: "paper-world.yml", url: "/paper/reference/configuration#per-world-values" },
        ],
    },
    { name: "bukkit.yml", url: "WIP" },
    { name: "spigot.yml", url: "WIP" },
    { name: "server.properties", url: "/paper/reference/server-properties" },
    { name: "permissions.yml", url: "WIP" },
    { name: "help.yml", url: "WIP" },
];

const IndentationArrow = ({ level }) => {

    if (level === 0) {
        return (<></>);
    }

    const arrowStyle = {
        fontSize: "14px",
        color: "#bbbbbb",
        marginRight: "8px",
        marginLeft: `8px`,
    };

    return (
        <span style={arrowStyle}>
            {level > 0 && Array(level).fill("→").join("")}
        </span>
    );
};

export default function ConfigurationStructureDiagram({}) {
    const renderNode = (node, level = 0) => {
        const isFolder = "children" in node && Array.isArray(node.children);

        const nodeStyle = {
            alignItems: "center",
        };

        if (level > 0) {
            nodeStyle.display = "flex";
        }

        const iconStyle = {
            fontSize: "20px",
            marginRight: "8px",
        };

        return (
            <div key={node.name} style={{ ...nodeStyle }}>

                <IndentationArrow level={level} />
                <a className={isFolder ? "config-explorer-file-folder-node" : "config-explorer-file-node"} href={node.url}>
                    <span style={iconStyle}>{isFolder ? "📁" : "📄"}</span>
                    <span>{node.name}</span>
                </a>

                {isFolder &&
                    node.children.map((child) => (
                        <div key={child.name}>
                            {renderNode(child, level + 1)}
                        </div>
                    ))}
            </div>
        );
    };

    return (
        <div>
            <pre>
                {folderData.map(item => renderNode(item))}
            </pre>
        </div>
    );
}
