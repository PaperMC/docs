import React, {useState} from "react";

const folderData = [
    {
        name: "config",
        type: "folder",
        children: [
            { name: "paper-global.yml", url: "/paper/reference/global-configuration" },
            { name: "paper-world-defaults.yml", url: "/paper/reference/world-configuration" },
        ],
    },
    {
        name: "plugins",
        type: "folder",
        description: "Plugin jars go here.",
    },
    {
        name: "<world>",
        type: "folder",
        children: [
            { name: "paper-world.yml", url: "/paper/reference/configuration#per-world-values" },
        ],
    },
    { name: "banned-ips.json", type: "file", description: "WIP" },
    { name: "banned-players.json", type: "file", description: "WIP" },
    { name: "bukkit.yml", type: "file", url: "/paper/reference/bukkit-configuration" },
    { name: "commands.yml", type: "file", url: "WIP" },
    { name: "eula.txt", type: "file", description: "This file is in place to allow you to accept the Minecraft EULA.\nThis is required to start the server." },
    { name: "help.yml", type: "file", url: "WIP" },
    { name: "ops.json", type: "file", description: "WIP" },
    { name: "permissions.yml", type: "file", url: "WIP" },
    { name: "server.properties", type: "file", url: "/paper/reference/server-properties" },
    { name: "spigot.yml", type: "file", url: "/paper/reference/spigot-configuration" },
    { name: "usercache.json", type: "file", description: "WIP" },
    { name: "whitelist.json", type: "file", description: "WIP" },
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
    const [popupNode, setPopupNode] = useState(null);

    const closePopup = () => {
        setPopupNode(null);
    };

    const renderNode = (node, level = 0) => {
        const isFolder = node.type === "folder";
        const hasDescription = "description" in node;
        const hasUrl = "url" in node;

        const nodeStyle = {
            alignItems: "center",
            position: "relative",
        };

        if (level > 0) {
            nodeStyle.display = "flex";
        }

        const iconStyle = {
            fontSize: "20px",
            cursor: hasDescription ? "pointer" : "auto",
        };

        const handleNodeOpening = (event) => {
            event.stopPropagation();
            setPopupNode(node);
        };

        return (
            <div key={node.name} style={nodeStyle} onMouseLeave={closePopup}>

                {level > 0 && (
                    <IndentationArrow level={level} />
                )}

                <a className={`${(isFolder ? "config-explorer-file-folder-node" : "config-explorer-file-node")} ${(!hasUrl ? "config-explorer-file-node" : "config-explorer-file-node-with-link")}`} href={node.url}
                   style={{cursor: hasUrl ? "pointer" : "default"}}>

                    <span style={iconStyle}>{isFolder ? "📁" : "📄"}</span>
                    <span style={{ margin: "0 5px 0 5px" }}>{node.name}</span>
                    {hasDescription && (
                        <span style ={{ zIndex: 100 }} className={"config-explorer-popup-window-open-tag"} onMouseEnter={handleNodeOpening}>ⓘ</span>
                    )}

                </a>

                {hasDescription && (
                    <div className={"config-explorer-popup-window-container"}>
                        <div className={"config-explorer-popup-window"}
                             style={{ display: popupNode === node ? "block" : "none", marginLeft: "30px" }}>
                            <strong>Description:</strong><br/>{node.description}
                        </div>
                    </div>
                )}

                {isFolder && node.children &&
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
