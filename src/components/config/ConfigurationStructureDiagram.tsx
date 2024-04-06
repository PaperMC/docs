import React, { useState } from "react";
import "@site/src/css/configuration-explorer-layout.css";
import { Icon } from "@iconify/react";
import Link from "@docusaurus/Link";
import clsx from "clsx";

const folderIcon = "mdi:folder";
const fileIcon = "mdi:file";

interface ExplorerNode {
  name: string;
  type: "folder" | "file";
  children?: ExplorerNode[];
  description?: string;
  url?: string;
}

const folderData: ExplorerNode[] = [
  {
    name: "logs",
    type: "folder",
    description:
      "This folder contains all the logs for the server. It compresses old logs into .gz files, but holds the most recent log as a .txt file.",
  },
  {
    name: "config",
    type: "folder",
    children: [
      { name: "paper-global.yml", type: "file", url: "/paper/reference/global-configuration" },
      {
        name: "paper-world-defaults.yml",
        type: "file",
        url: "/paper/reference/world-configuration",
      },
    ],
  },
  {
    name: "plugins",
    type: "folder",
    description: "You can place your plugin jars here.",
  },
  {
    name: "<world>",
    type: "folder",
    children: [
      {
        name: "paper-world.yml",
        type: "file",
        url: "/paper/reference/configuration#per-world-values",
        description:
          "Every world folder will have this file. The values here only apply to this world.",
      },
    ],
  },
  {
    name: "banned-ips.json",
    type: "file",
    description: "This file stores all the banned IP addresses on the server.",
  },
  {
    name: "banned-players.json",
    type: "file",
    description: "This file stores all the banned player information for the server.",
  },
  { name: "bukkit.yml", type: "file", url: "/paper/reference/bukkit-configuration" },
  { name: "commands.yml", type: "file", url: "/paper/reference/bukkit-commands-configuration" },
  {
    name: "eula.txt",
    type: "file",
    description:
      "This file is in place to allow you to accept the Minecraft EULA.\nThis is required to start the server.",
  },
  {
    name: "help.yml",
    type: "file",
    description:
      "This file provides you with a wide variety of ways to configure the /help system in your Paper Server.",
  },
  {
    name: "ops.json",
    type: "file",
    description: "This file stores a list of all players with operator status.",
  },
  {
    name: "permissions.yml",
    type: "file",
    description:
      "The permissions.yml file allows creating of permission nodes so that server admins can easily distribute permissions.",
  },
  { name: "server.properties", type: "file", url: "/paper/reference/server-properties" },
  { name: "spigot.yml", type: "file", url: "/paper/reference/spigot-configuration" },
  {
    name: "usercache.json",
    type: "file",
    description:
      "This file acts as a cache of user information that has been requested from Mojang's servers when they join the server or their texture is used as a Head.",
  },
  {
    name: "whitelist.json",
    type: "file",
    description:
      "This is is a server configuration file that stores the usernames of players who have been whitelisted on a server.",
  },
];

interface IndentationArrowProps {
  level: number;
}

const IndentationArrow = ({ level }: IndentationArrowProps): null | JSX.Element => {
  if (level === 0) {
    return null;
  }

  return <span className={"indentation-arrow"}>{level > 0 && "└─".repeat(level)}</span>;
};

export default function ConfigurationStructureDiagram(): JSX.Element {
  const [popupNode, setPopupNode] = useState<ExplorerNode | null>(null);

  const renderNode = (node: ExplorerNode, level: number = 0) => {
    const isFolder = node.type === "folder";
    const hasDescription = "description" in node;
    const hasUrl = "url" in node;

    const handleNodeOpening = (event: React.MouseEvent) => {
      event.stopPropagation();
      setPopupNode(node);
    };

    return (
      <div
        key={node.name}
        className={level > 0 ? "config-explorer-node" : "config-explorer-node-noflex"}
        onMouseLeave={() => {
          setPopupNode(null);
        }}
      >
        {level > 0 && <IndentationArrow level={level} />}

        <Link
          className={clsx(
            !isFolder && "config-explorer-file-node",
            isFolder && "config-explorer-file-folder-node",
            hasUrl && "config-explorer-file-node-with-link"
          )}
          to={node.url}
        >
          <span className={"config-node-contents-wrapper"}>
            <Icon
              icon={isFolder ? folderIcon : fileIcon}
              className={"config-explorer-icon config-explorer-node-icon"}
            />
            {node.name}
          </span>
          {hasDescription && (
            <span
              className={"config-explorer-popup-window-open-tag"}
              onMouseEnter={handleNodeOpening}
            >
              ⓘ
            </span>
          )}
        </Link>

        {hasDescription && (
          <div className={"config-explorer-popup-window-container"}>
            <div
              className={clsx(
                "config-explorer-popup-window",
                popupNode !== node && "display--none"
              )}
            >
              <strong>Description:</strong>
              <br />
              {node.description}
            </div>
          </div>
        )}

        {isFolder &&
          node.children &&
          node.children.map((child) => <div key={child.name}>{renderNode(child, level + 1)}</div>)}
      </div>
    );
  };

  return (
    <div>
      <pre className={"config-explorer-code-outer-container"}>
        {folderData.map((item) => renderNode(item))}
      </pre>
    </div>
  );
}
