---
title: Migrating to or from Paper
description: It's simple to migrate your server to or from Paper. This page will help you get started.
slug: paper/migration
---

It's simple to migrate your server to or from Paper. The steps below will help you get started.

:::caution[Backup your data before you start!]

Before you begin, please ensure you have a full backup of your server.

See our [Backup Guide](/paper/updating#step-1-backup) for more information.

:::

## Migrating to Paper

### From CraftBukkit or Spigot

It's easy to migrate from CraftBukkit or Spigot to Paper. Follow the steps below.

1. Stop your server if it is running, and create a full backup.
2. Download Paper from [our downloads page](https://papermc.io/downloads).
3. Rename the downloaded file to match the name specified in the [start command](/paper/getting-started#running-the-server).
4. Replace your existing JAR file with your freshly downloaded Paper JAR.
5. Start your new server.

Paper retains full compatibility with all Spigot plugins, allowing a seamless transition.

:::note

Your new Paper server will still use [`bukkit.yml`](/paper/reference/bukkit-configuration)
and [`spigot.yml`](/paper/reference/spigot-configuration).
New configuration options can be found in [`config/paper-global.yml`](/paper/reference/global-configuration)
and [`config/paper-world-defaults.yml`](/paper/reference/world-configuration).

:::

If you have any issues migrating from CraftBukkit or Spigot, do not hesitate to reach out for
support on [our Discord server](https://discord.gg/papermc) (`#paper-help` channel).

### From Vanilla

When migrating to Paper from Vanilla, the way worlds are stored will automatically be changed.
Should you ever want to go back to Vanilla, follow the [Vanilla Migration Guide](#to-vanilla)
closely, as manual changes will be required.

1. Stop your Vanilla server if it is running, and create a full backup.
2. Download Paper from [our downloads page](https://papermc.io/downloads) and replace your Vanilla
   server JAR with your freshly downloaded Paper JAR.
3. Rename the downloaded file to match the name specified in the [start command](/paper/getting-started#running-the-server).
4. Start your new Paper server.

You have now successfully migrated to Paper. If you encounter any issues, do not hesitate to reach
out for support on [our Discord server](https://discord.gg/papermc) (`#paper-help` channel).

### From Fabric/Forge

Because both Fabric and Forge use the Vanilla world directory structure, the same steps as the
[Vanilla Migration Guide](#from-vanilla) may be used, with one caveat. If your Fabric or Forge
server used mods that added new blocks, items, or other data to the game, Paper will be unable to
load these features.

Additionally, note that Paper does not support Fabric or Forge mods. You will need to find plugin
replacements. Any hybrids that attempt to support both mods and plugins are fundamentally flawed and
not recommended for use.

## Migrating from Paper

### To Vanilla

Because Paper stores worlds slightly differently than Vanilla, manual work is required to migrate.
If these steps are not taken, your nether and end will look like they have been reset. Don't worry!
Even if this has happened, you haven't lost any data. The Vanilla server just doesn't know where to
find it.

Here is a chart to show the difference between how Vanilla and Paper store worlds.

| Server Software | Overworld | Nether                | End                   |
| --------------- | --------- | --------------------- | --------------------- |
| Vanilla         | `/world`  | `/world/DIM-1`        | `/world/DIM1`         |
| Paper           | `/world`  | `/world_nether/DIM-1` | `/world_the_end/DIM1` |

Follow these steps to migrate from Paper to Vanilla:

:::note

These steps assume a `level-name` (as set in `server.properties`) of `world`. If this is not the
case for you, replace `world` with your `level-name` for all steps below.

:::

1. Stop your Paper server, if it is running.
2. If you have already started your server with Vanilla, enter the `world` folder and delete both
   the `DIM-1` and `DIM1` folders. This step is only necessary should you have started your server
   with Vanilla.
3. Copy the `/world_nether/DIM-1` folder into the `/world` folder.
4. Copy the `/world_the_end/DIM1` folder into the `/world` folder.
5. Delete both the `/world_nether` and `/world_the_end` folders.
6. Replace your Paper JAR with a Vanilla server JAR.
7. Start your Vanilla server.

### To CraftBukkit or Spigot

Paper does **not** support migration to either CraftBukkit or Spigot! While you may find success
(both CraftBukkit and Spigot use the same directory structure as Paper), **do not** reach out for
support with issues you encounter and note that data loss is possible.

### To Fabric/Forge

Because both Fabric and Forge use the same directory structure for world storage as Vanilla, follow
the [Vanilla Migration Guide](#to-vanilla) for this process. Note that neither Fabric nor Forge will
support Paper plugins! You will be required to find replacement mods.
