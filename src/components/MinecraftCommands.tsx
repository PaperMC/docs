import React from "react";

export interface CommandData {
  /** The primary name of the command as registered by Minecraft code. */
  [0]: string;
  /** A list of name that redirect to the primary name; i.e. aliases */
  [1]: string[];
  /**
   * If a number: the default OP level required for a command as registered by Minecraft code.
   * If a string: an explanation of when the command is accessible to players by default and when it's not
   */
  [2]: number | string;
}

export const commands: CommandData[] = [
  ["advancement", [], 2],
  ["attribute", [], 2],
  ["ban", [], 3],
  ["ban-ip", [], 3],
  ["banlist", [], 3],
  ["bossbar", [], 2],
  ["clear", [], 2],
  ["clone", [], 2],
  ["damage", [], 2],
  ["data", [], 2],
  ["datapack", [], 2],
  ["debug", [], 3],
  ["defaultgamemode", [], 2],
  ["deop", [], 3],
  ["difficulty", [], 2],
  ["effect", [], 2],
  ["enchant", [], 2],
  ["execute", [], 2],
  ["fill", [], 2],
  ["fillbiome", [], 2],
  ["forceload", [], 2],
  ["function", [], 2],
  ["gamemode", [], 2],
  ["gamerule", [], 2],
  ["give", [], 2],
  ["help", [], 0],
  ["item", [], 2],
  ["jfr", [], 4],
  ["kick", [], 3],
  ["kill", [], 2],
  ["list", [], 0],
  ["locate", [], 2],
  ["loot", [], 2],
  ["me", [], 0],
  ["msg", ["w", "tell"], 0],
  ["op", [], 3],
  ["pardon", [], 3],
  ["pardon-ip", [], 3],
  ["particle", [], 2],
  ["perf", [], 4],
  ["place", [], 2],
  ["playsound", [], 2],
  ["publish", [], 4],
  ["random", [], "Yes without sequence argument, No with sequence argument."],
  ["recipe", [], 2],
  ["reload", [], 2],
  ["return", [], 2],
  ["ride", [], 2],
  ["save-all", [], 4],
  ["save-off", [], 4],
  ["save-on", [], 4],
  ["say", [], 2],
  ["schedule", [], 2],
  ["scoreboard", [], 2],
  ["seed", [], 2],
  ["setblock", [], 2],
  ["setidletimeout", [], 3],
  ["setworldspawn", [], 2],
  ["spawnpoint", [], 2],
  ["spectate", [], 2],
  ["spreadplayers", [], 2],
  ["stop", [], 4],
  ["stopsound", [], 2],
  ["summon", [], 2],
  ["tag", [], 2],
  ["team", [], 2],
  ["teammsg", ["tm"], 0],
  ["teleport", ["tp"], 2],
  ["tellraw", [], 2],
  ["tick", [], 3],
  ["time", [], 2],
  ["title", [], 2],
  ["transfer", [], 3],
  ["trigger", [], 0],
  ["weather", [], 2],
  ["whitelist", [], 3],
  ["worldborder", [], 2],
  ["xp", ["experience"], 2],
];

export interface CommandsPermissionsTableProps {
  data: CommandData[];
}

type AliasList = [] | JSX.Element | [AliasList, AliasList, AliasList];

function listAliases(aliases: string[]): AliasList {
  if (aliases.length === 0) {
    return [];
  }

  return aliases
    .map((x) => `/${x}`)
    .map((x) => (<span className="no-wrap">{x}</span>) as AliasList)
    .reduce((prev, curr) => [prev, <span>, </span>, curr]);
}

export function CommandsPermissionsTable({ data }: CommandsPermissionsTableProps): JSX.Element {
  return (
    <table>
      <tr>
        <th>Command</th>
        <th>Aliases</th>
        <th>Permission Node</th>
        <th>Players Have Permission By Default?</th>
      </tr>
      {data.map((x) => (
        <tr>
          <td>
            <a href={`https://minecraft.wiki/w/Commands/${x[0]}`}>
              <span className="no-wrap">/{x[0]}</span>
            </a>
          </td>
          <td>{listAliases(x[1])}</td>
          <td>minecraft.command.{x[0]}</td>
          <td>{typeof x[2] === "string" ? x[2] : x[2] == 0 ? "Yes" : "No"}</td>
        </tr>
      ))}
    </table>
  );
}
