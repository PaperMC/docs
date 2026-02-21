---
title: CLI Arguments
slug: paper/reference/cli-arguments
description: Reference for all CLI arguments Paper recognizes.
version: 1.21.11
tableOfContents: false
---

Paper provides CLI arguments you can set to configure certain behavior. CLI arguments are always added directly
**after** the server file name when starting the server. For example:
```bash
java -jar server.jar --nogui
```

`--nogui` is referred to as a CLI argument (more specifically, as it has no value, a **flag**).
This page acts as a reference to all arguments Paper provides.

Some of these options are direct counterparts to settings you can modify in the `server.properties` file.
The CLI arguments always **override** those set in the `server.properties` file.

##### `-?, --help`
Prints a help message with all CLI arguments you may pass. Using this flag will not start the server.

##### `-C, --commands-settings <commands yml file>`
The path towards the command settings file. Defaults to `commands.yml`.

##### `-P, --plugins <plugin directory>`
The directory to look in for plugin jars. Defaults to `plugins`.

##### `-S, --spigot-settings <yml file>`
The path towards the Spigot configuration file. Defaults to `spigot.yml`.

##### `-W, --universe, --world-container, --world-dir <world directory>`
The folder to put other world folders into. Defaults to `.` (this folder).

##### `--add-extra-plugin-dir, --add-plugin-dir <directory>`
Additional directory to look for plugin files in. May be specified multiple times for more than one
extra plugin directory.

##### `--add-extra-plugin-jar, --add-plugin <jar file>`
Additional plugin jar file to load. May be specified multiple times for multiple plugin jars.

##### `-b, --bukkit-settings <yml file>`
The path towards the Bukkit configuration file. Defaults to `bukkit.yml`.

##### `-c, --config <properties file>`
The path towards the Minecraft server properties file. Defaults to `server.properties`.

##### `-d, --date-format <log date format>`
Override for the date format displayed in log entries.

##### `--demo`
Whether to load the server in demo mode. This results in always the same world being generated and additional
demo reminders and help messages being sent.

##### `--eraseCache`
Whether to force cache erase during world upgrades. This removes data such as heightmap and light data,
which may be useful if you want to force recalculate those.

##### `--forceUpgrade`
Whether to force a full world upgrade on server start.

:::warning

This setting should rarely ever be used. The upgrade system in Paper is fast enough to do
upgrades gradually as you play.

:::

##### `-h, --host, --server-ip <hostname or ip>`
The host to listen on.

##### `--initSettings`
Whether to only create setting files and then shut down the server before creating any worlds. This is useful
if you want to first set some configuration values, which may be relevant during world creation.

##### `--jfrProfile`
Whether to enable jfr profiling.

##### `--log-append <true|false>`
Whether to append to the log file. Defaults to `true`.

##### `--log-count <value>`
The amount of log files to cycle through. Defaults to `1`.

##### `--log-limit <value>`
The maximum size of the log file. A value of `0` means it may grow in size indefinitely.
Defaults to `0`.

##### `--log-pattern <filename>`
The log file name pattern. Defaults to `server.log`.

##### `--log-strip-color`
Strips color codes from the log file.

##### `--noconsole`
Disables the console.

##### `--nogui`
Disables the graphical interface.

##### `--nojline`
Disables jline and emulates the Vanilla console.

##### `-o, --online-mode <true|false>`
Whether to use online authentication.

##### `-p, --port, --server-port <port>`
The port to listen on.

##### `--paper, --paper-settings <yml file>`
The legacy Paper settings file path. Defaults to `paper.yml`.

##### `--paper-dir, --paper-settings-directory <config directory>`
Path to the Paper settings directory. Defaults to `config`.

##### `--pidFile <path>`
Path to the pid file.

##### `--recreateREgionFiles``
Whether to recreate region files during world upgrades.

##### `-s, --max-players, --size <value>`
The maximum amount of players.

##### `--safeMode`
Loads worlds only with the Vanilla datapack enabled.

##### `--server-name <name>`
The name of the server. Defaults to `Unknown Server`.

##### `--serverId <string>`
The server ID.

##### `-v, --version`
Prints the CraftBukkit version. This option prevents the server from starting.

##### `-w, --level-name, --world <name>`
Set the world name.
