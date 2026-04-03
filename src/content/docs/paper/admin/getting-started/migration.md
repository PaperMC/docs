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

### From Vanilla

When migrating to Paper from Vanilla, the way worlds are stored will automatically be changed.
Should you ever want to go back to Vanilla, follow the [Vanilla Migration Guide](#to-vanilla)
closely, as manual changes will be required.

1. Stop your Vanilla server if it is running, and create a full backup.
2. Download Paper from [our downloads page](https://papermc.io/downloads) and replace your Vanilla
   server JAR with your freshly downloaded Paper JAR.
3. Rename the downloaded file to match the name specified in
   the [start command](/paper/getting-started#running-the-server).
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

### From Spigot/CraftBukkit

Spigot and CraftBukkit modify the Vanilla world directory structure, making a direct migration
fundamentally impossible. If you wish to migrate from Spigot/CraftBukkit anyway, you will
first need to **migrate from Spigot/CraftBukkit to Vanilla**, after which you can safely follow
the [Vanilla Migration Guide](#from-vanilla). For instructions on how to do this, please
refer to the Spigot documentation.

## Migrating from Paper

### To Vanilla

Because Paper shares a similar world structure to Vanilla, all you need to do is move around some files.
The following list shows which files you will need to move where. **Before you move around any files,
make sure your server is fully stopped**.

:::note

These steps assume a `level-name` (as set in `server.properties`) of `world`. If this is not the
case for you, replace `world` with your `level-name` for all steps below.

:::

The following files will need to be moved **from** `world/dimensions/minecraft/overworld/data/minecraft/`
**into** `world/data/minecraft/`:

- `game_rules.dat`
- `scheduled_events.dat`
- `wandering_trader.dat`
- `weather.dat`
- `world_gen_settings.dat`

After you have moved these files, you can now replace the Paper server JAR with a Vanilla server JAR
and start your Vanilla server!

### To Fabric/Forge

Because both Fabric and Forge use the same directory structure for world storage as Vanilla, follow
the [Vanilla Migration Guide](#to-vanilla) for this process. Note that neither Fabric nor Forge will
support Paper plugins! You will be required to find replacement mods.

## Other Migration

:::caution

The guides below display outdated information no longer relevant for modern Paper servers. They are
kept for historical purposes and people still using older versions. Please note that you will
**not receive support for using outdated versions.**

:::

### To Vanilla (pre 26.1)

Because Paper stores worlds slightly differently than Vanilla, manual work is required to migrate.
If these steps are not taken, your nether and end will look like they have been reset. Don't worry!
Even if this has happened, you haven't lost any data. The Vanilla server just doesn't know where to
find it.

Here is a chart to show the difference between how Vanilla and Paper store worlds.

| Server Software | Overworld | Nether                | End                   |
|-----------------|-----------|-----------------------|-----------------------|
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

### To/From CraftBukkit or Spigot

Paper does **not** support migration from or to either CraftBukkit or Spigot!
While you may find success, **do not** reach out for
support with issues you encounter and note that data loss is possible.

Historically, migrating from Spigot to Paper was possible due to a shared directory structure
(`1.21.11` and older), however since `26.1`, Paper's world directory structure has been
altered to more closely match Vanilla, which made migrating from or to Spigot/CraftBukkit no longer possible.
