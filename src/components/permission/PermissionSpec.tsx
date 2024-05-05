import { CommandData, PermissionData } from "@site/src/components/permission/Permissions";

export const vanillaCommands: CommandData = {
  permissionPrefix: "minecraft.command",
  commands: [
    { name: "advancement", aliases: [], opLevel: 2 },
    { name: "attribute", aliases: [], opLevel: 2 },
    { name: "ban", aliases: [], opLevel: 3 },
    { name: "ban-ip", aliases: [], opLevel: 3 },
    { name: "banlist", aliases: [], opLevel: 3 },
    { name: "bossbar", aliases: [], opLevel: 2 },
    { name: "clear", aliases: [], opLevel: 2 },
    { name: "clone", aliases: [], opLevel: 2 },
    { name: "damage", aliases: [], opLevel: 2 },
    { name: "data", aliases: [], opLevel: 2 },
    { name: "datapack", aliases: [], opLevel: 2 },
    { name: "debug", aliases: [], opLevel: 3 },
    { name: "defaultgamemode", aliases: [], opLevel: 2 },
    { name: "deop", aliases: [], opLevel: 3 },
    { name: "difficulty", aliases: [], opLevel: 2 },
    { name: "effect", aliases: [], opLevel: 2 },
    { name: "enchant", aliases: [], opLevel: 2 },
    { name: "execute", aliases: [], opLevel: 2 },
    { name: "fill", aliases: [], opLevel: 2 },
    { name: "fillbiome", aliases: [], opLevel: 2 },
    { name: "forceload", aliases: [], opLevel: 2 },
    { name: "function", aliases: [], opLevel: 2 },
    { name: "gamemode", aliases: [], opLevel: 2 },
    { name: "gamerule", aliases: [], opLevel: 2 },
    { name: "give", aliases: [], opLevel: 2 },
    { name: "help", aliases: [], opLevel: 0 },
    { name: "item", aliases: [], opLevel: 2 },
    { name: "jfr", aliases: [], opLevel: 4 },
    { name: "kick", aliases: [], opLevel: 3 },
    { name: "kill", aliases: [], opLevel: 2 },
    { name: "list", aliases: [], opLevel: 0 },
    { name: "locate", aliases: [], opLevel: 2 },
    { name: "loot", aliases: [], opLevel: 2 },
    { name: "me", aliases: [], opLevel: 0 },
    { name: "msg", aliases: ["w", "tell"], opLevel: 0 },
    { name: "op", aliases: [], opLevel: 3 },
    { name: "pardon", aliases: [], opLevel: 3 },
    { name: "pardon-ip", aliases: [], opLevel: 3 },
    { name: "particle", aliases: [], opLevel: 2 },
    { name: "perf", aliases: [], opLevel: 4 },
    { name: "place", aliases: [], opLevel: 2 },
    { name: "playsound", aliases: [], opLevel: 2 },
    { name: "publish", aliases: [], opLevel: 4 },
    {
      name: "random",
      aliases: [],
      defaultComment: "Yes without sequence argument, No with sequence argument.",
    },
    { name: "recipe", aliases: [], opLevel: 2 },
    { name: "reload", aliases: [], opLevel: 2 },
    { name: "return", aliases: [], opLevel: 2 },
    { name: "ride", aliases: [], opLevel: 2 },
    { name: "save-all", aliases: [], opLevel: 4 },
    { name: "save-off", aliases: [], opLevel: 4 },
    { name: "save-on", aliases: [], opLevel: 4 },
    { name: "say", aliases: [], opLevel: 2 },
    { name: "schedule", aliases: [], opLevel: 2 },
    { name: "scoreboard", aliases: [], opLevel: 2 },
    { name: "seed", aliases: [], opLevel: 2 },
    { name: "setblock", aliases: [], opLevel: 2 },
    { name: "setidletimeout", aliases: [], opLevel: 3 },
    { name: "setworldspawn", aliases: [], opLevel: 2 },
    { name: "spawnpoint", aliases: [], opLevel: 2 },
    { name: "spectate", aliases: [], opLevel: 2 },
    { name: "spreadplayers", aliases: [], opLevel: 2 },
    { name: "stop", aliases: [], opLevel: 4 },
    { name: "stopsound", aliases: [], opLevel: 2 },
    { name: "summon", aliases: [], opLevel: 2 },
    { name: "tag", aliases: [], opLevel: 2 },
    { name: "team", aliases: [], opLevel: 2 },
    { name: "teammsg", aliases: ["tm"], opLevel: 0 },
    { name: "teleport", aliases: ["tp"], opLevel: 2 },
    { name: "tellraw", aliases: [], opLevel: 2 },
    { name: "tick", aliases: [], opLevel: 3 },
    { name: "time", aliases: [], opLevel: 2 },
    { name: "title", aliases: [], opLevel: 2 },
    { name: "transfer", aliases: [], opLevel: 3 },
    { name: "trigger", aliases: [], opLevel: 0 },
    { name: "weather", aliases: [], opLevel: 2 },
    { name: "whitelist", aliases: [], opLevel: 3 },
    { name: "worldborder", aliases: [], opLevel: 2 },
    { name: "xp", aliases: ["experience"], opLevel: 2 },
  ],
};

export const bukkitCommands: CommandData = {
  permissionPrefix: "bukkit.command",
  commands: [
    { name: "help", aliases: ["?"], opLevel: 0 },
    { name: "plugins", aliases: ["pl"], opLevel: 0 },
    { name: "reload", aliases: ["rl"], opLevel: 4 },
    { name: "timings", aliases: [], opLevel: 4 },
    { name: "version", aliases: ["ver", "about"], opLevel: 0 },
  ],
};

export const paperCommands: CommandData = {
  permissionPrefix: "bukkit.command",
  commands: [{ name: "paper", aliases: [], opLevel: 4 }],
};

export const vanillaPermissions: PermissionData = {
  permissionPrefix: "minecraft",
  permissions: [
    {
      permission: "",
      description: "Gives the user the ability to use all vanilla utilities and commands.",
      opLevel: 4,
    },
    {
      permission: "admin.command_feedback",
      description: "Receive command broadcasts when sendCommandFeedback is true.",
      opLevel: 4,
    },
    {
      permission: "nbt.place",
      description: "Gives the user the ability to place restricted blocks with NBT in creative.",
      opLevel: 4,
    },
    {
      permission: "nbt.copy",
      description: "Gives the user the ability to copy NBT in creative.",
      opLevel: 0,
    },
    {
      permission: "debugstick",
      description: "Gives the user the ability to use the debug stick in creative.",
      opLevel: 4,
    },
    {
      permission: "debugstick.always",
      description: "Gives the user the ability to use the debug stick in all game modes.",
      requiresOp: false,
    },
    {
      permission: "commandblock",
      description: "Gives the user the ability to use command blocks.",
      opLevel: 4,
    },
  ],
};

export const bukkitPermissions: PermissionData = {
  permissionPrefix: "bukkit",
  permissions: [
    {
      permission: "broadcast",
      description: "Allows the user to receive all broadcast messages",
      opLevel: 4,
    },
    {
      permission: "broadcast.admin",
      description: "Allows the user to receive administrative broadcasts",
      opLevel: 4,
    },
    {
      permission: "broadcast.user",
      description: "Allows the user to receive user broadcasts",
      opLevel: 0,
    },
  ],
};

export const paperPermissions: PermissionData = {
  permissionPrefix: "bukkit.command.paper",
  permissions: [
    { permission: "heap", description: "Allows the user to run the heap sub command", opLevel: 4 },
    {
      permission: "entity",
      description: "Allows the user to run the entity sub command",
      opLevel: 4,
    },
    {
      permission: "reload",
      description: "Allows the user to run the reload sub command",
      opLevel: 4,
    },
    {
      permission: "version",
      description: "Allows the user to run the version sub command",
      opLevel: 4,
    },
    {
      permission: "dumpplugins",
      description: "Allows the user to run the dumpplugins sub command",
      opLevel: 4,
    },
    {
      permission: "syncloadinfo",
      description: "Allows the user to run the syncloadinfo sub command",
      opLevel: 4,
    },
    {
      permission: "dumpitem",
      description: "Allows the user to run the dumpitem sub command",
      opLevel: 4,
    },
    {
      permission: "mobcaps",
      description: "Allows the user to run the mobcaps sub command",
      opLevel: 4,
    },
    {
      permission: "dumplisteners",
      description: "Allows the user to run the dumplisteners sub command",
      opLevel: 4,
    },
    {
      permission: "fixlight",
      description: "Allows the user to run the fixlight sub command",
      opLevel: 4,
    },
    {
      permission: "debug",
      description: "Allows the user to run the debug sub command",
      opLevel: 4,
    },
  ],
};
