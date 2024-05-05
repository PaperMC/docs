import React from "react";

interface Command {
  /** The primary name of the command as registered by Minecraft code. */
  name: string;
  /** A list of name that redirect to the primary name; i.e. aliases */
  aliases: string[];
  /**
   * If a number: the default OP level required for a command as registered by Minecraft code.
   * If a string: an explanation of when the command is accessible to players by default and when it's not
   */
  opLevel: number | string;
}

export interface CommandData {
  /** The permission node prefix. */
  permissionPrefix: string;
  /** List of all commands under the prefix*/
  commands: Command[];
}

export interface CommandsPermissionsTableProps {
  data: CommandData;
}

interface Permission {
  /** Permission node*/
  permission: string;
  /** Description of the permission*/
  description: string;
  /**
   * If a number: the default OP level required for a command as registered by Minecraft code.
   * If a string: an explanation of when the command is accessible to players by default and when it's not.
   * If a boolean: the boolean will determine if "Yes" or "No" will be shown.
   */
  opLevel: number | string | boolean;
}

export interface PermissionData {
  /** The permission node prefix. */
  permissionPrefix: string;
  /** List of all permissions under the prefix*/
  permissions: Permission[];
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

function getCommand(data: CommandData, x1: string) {
  if (data.permissionPrefix === "minecraft.command") {
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
      {data.commands.map((command) => (
        <tr>
          <td>{getCommand(data, command.name)}</td>
          <td>{listAliases(command.aliases)}</td>
          <td>{`${data.permissionPrefix}.${command.name}`}</td>
          <td>
            {typeof command.opLevel === "string"
              ? command.opLevel
              : command.opLevel == 0
                ? "Yes"
                : "No"}
          </td>
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
        <th>Description</th>
        <th>Players Have Permission By Default?</th>
      </tr>
      {data.permissions.map((permission) => (
        <tr>
          <td>{`${data.permissionPrefix}${permission.permission === "" ? "" : "." + permission.permission}`}</td>
          <td>{permission.description}</td>
          <td>
            {typeof permission.opLevel === "boolean"
              ? permission.opLevel
                ? "Yes"
                : "No"
              : typeof permission.opLevel === "string"
                ? permission.opLevel
                : permission.opLevel == 0
                  ? "Yes"
                  : "No"}
          </td>
        </tr>
      ))}
    </table>
  );
}
