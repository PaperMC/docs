import React, { type JSX } from "react";

interface Command {
  /** The primary name of the command as registered by Minecraft code. */
  name: string;
  /** A list of name that redirect to the primary name; i.e. aliases */
  aliases: string[];
  /**
   * If a number: the default OP level required for a command as registered by Minecraft code.
   * If a string: an explanation of when the command is accessible to players by default and when it's not
   */
  opLevel?: number;
  /** A comment explaining when a command is usable */
  defaultComment?: string;
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
  opLevel?: number;
  /** Weather the permission is granted by default for Operators */
  requiresOp?: boolean;
  /** A comment explaining when a permissions is granted by default */
  defaultComment?: string;
}

export interface PermissionData {
  /** Sections containing a prefix*/
  sections: PermissionSection[];
}

export interface PermissionSection {
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

function getCommand(data: CommandData, command: string) {
  if (data.permissionPrefix === "minecraft.command") {
    return (
      <a href={`https://minecraft.wiki/w/Commands/${command}`}>
        <span className={"no-wrap"}>{command}</span>
      </a>
    );
  } else {
    return <span className={"no-wrap"}>{command}</span>;
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
            {command.opLevel === undefined
              ? command.defaultComment
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
      {data.sections.map((section) =>
        section.permissions.map((permission) => (
          <tr>
            <td>{`${section.permissionPrefix}${permission.permission === "" ? "" : "." + permission.permission}`}</td>
            <td>{permission.description}</td>
            <td>
              {permission.opLevel === undefined
                ? permission.requiresOp === undefined
                  ? permission.defaultComment
                  : permission.requiresOp
                    ? "Yes"
                    : "No"
                : permission.opLevel == 0
                  ? "Yes"
                  : "No"}
            </td>
          </tr>
        ))
      )}
    </table>
  );
}
