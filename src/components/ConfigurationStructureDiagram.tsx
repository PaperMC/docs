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
    { name: "banned-ips.json", type: "file", description: "This file stores all the banned IP addresses on the server." },
    { name: "banned-players.json", type: "file", description: "This file stores all the banned player information for the server." },
    { name: "bukkit.yml", type: "file", url: "/paper/reference/bukkit-configuration" },
    { name: "commands.yml", type: "file", url: "/paper/reference/bukkit-commands-configuration" },
    { name: "eula.txt", type: "file", description: "This file is in place to allow you to accept the Minecraft EULA.\nThis is required to start the server." },
    { name: "help.yml", type: "file", description: "This file provides you with a wide variety of ways to configure the /help system in your Paper Server." },
    { name: "ops.json", type: "file", description: "ops.json is a JSON file located in the root directory of a server containing a list of players with operator status." },
    { name: "permissions.yml", type: "file", description: "The permissions.yml file allows creating of permission nodes so that server admins can easily distribute permissions." },
    { name: "server.properties", type: "file", url: "/paper/reference/server-properties" },
    { name: "spigot.yml", type: "file", url: "/paper/reference/spigot-configuration" },
    { name: "usercache.json", type: "file", description: "This file acts as a cache of user information that has been requested from Mojang's servers when they join the server or their texture is used as a Head." },
    { name: "whitelist.json", type: "file", description: "This is is a server configuration file that stores the usernames of players who have been whitelisted on a server." },
];

const IndentationArrow = ({ level }) => {

    if (level === 0) {
        return null;
    }

    const arrowStyle = {
        fontSize: "14px",
        color: "#bbbbbb",
        marginRight: "8px",
        marginLeft: `8px`,
    };

    return (
        <span style={arrowStyle}>
            {level > 0 && "→".repeat(level)}
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

        const handleNodeOpening = (event) => {
            event.stopPropagation();
            setPopupNode(node);
        };

        return (
            <div key={node.name} className={level > 0 ? "config-explorer-node" : "config-explorer-node-noflex"} onMouseLeave={closePopup}>

                {level > 0 && (
                    <IndentationArrow level={level} />
                )}

                <a className={`${(isFolder ? "config-explorer-file-folder-node" : "config-explorer-file-node")} 
                   ${(!hasUrl ? "config-explorer-file-node" : "config-explorer-file-node-with-link")}`} href={node.url}
                   style={{cursor: hasUrl ? "pointer" : "default"}}>

                    <span style={{cursor: hasDescription ? "pointer" : "auto"}} className={"config-explorer-node-icon"}>{isFolder ? "📁" : "📄"}</span>
                    <span style={{ margin: "0 5px 0 5px" }}>{node.name}</span>
                    {hasDescription && (
                        <span className={"config-explorer-popup-window-open-tag"} onMouseEnter={handleNodeOpening}>ⓘ</span>
                    )}
                </a>

                {hasDescription && (
                    <div className={"config-explorer-popup-window-container"}>
                        <div className={"config-explorer-popup-window"}
                             style={{ display: popupNode === node ? "block" : "none" }}>
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
            <pre className={"config-explorer-code-outer-container"}>
                {folderData.map(item => renderNode(item))}
            </pre>
        </div>
    );
}
