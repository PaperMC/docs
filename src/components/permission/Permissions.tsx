import React from "react";

interface Command {
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

export interface CommandData {
  /** The permission node prefix. */
  [0]: string;
  /** List of all commands under the prefix*/
  [1]: Command[];
}

export interface CommandsPermissionsTableProps {
  data: CommandData;
}

interface Permission {
  /** Permission node*/
  [0]: string;
  /**
   * If a number: the default OP level required for a command as registered by Minecraft code.
   * If a string: an explanation of when the command is accessible to players by default and when it's not.
   * If a boolean: the boolean will determine if "Yes" or "No" will be shown.
   */
  [1]: number | string | boolean;
}

export interface PermissionData {
  /** The permission node prefix. */
  [0]: string;
  /** List of all permissions under the prefix*/
  [1]: Permission[];
}

export interface PermissionTableProps {
  data: PermissionData;
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

function command(data: CommandData, x1: string) {
  if (data["0"] === "minecraft.command") {
    return (
      <a href={`https://minecraft.wiki/w/Commands/${x1}`}>
        <span className={"no-wrap"}>{x1}</span>
      </a>
    );
  } else {
    return <span className={"no-wrap"}>{x1}</span>;
  }
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
      {data["1"].map((x) => (
        <tr>
          <td>{command(data, x[0])}</td>
          <td>{listAliases(x[1])}</td>
          <td>{`${data["0"]}.${x[0]}`}</td>
          <td>{typeof x[2] === "string" ? x[2] : x[2] == 0 ? "Yes" : "No"}</td>
        </tr>
      ))}
    </table>
  );
}

export function PermissionsTable({ data }: PermissionTableProps): JSX.Element {
  return (
    <table>
      <tr>
        <th>Permission Node</th>
        <th>Players Have Permission By Default?</th>
      </tr>
      {data["1"].map((x) => (
        <tr>
          <td>{`${data["0"]}${x[0] === "" ? "" : "." + x[0]}`}</td>
          <td>
            {typeof x[1] === "boolean"
              ? x[1]
                ? "Yes"
                : "No"
              : typeof x[2] === "string"
                ? x[2]
                : x[2] == 0
                  ? "Yes"
                  : "No"}
          </td>
        </tr>
      ))}
    </table>
  );
}
