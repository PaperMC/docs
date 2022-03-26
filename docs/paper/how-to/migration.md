---
slug: /paper/migration
title: Migration
---

It's easy to migrate your server to or from most other Minecraft Java Edition based server
implementations.

## Migrating to Paper

:::tip

Always make sure to back up your server before migrating! If something goes wrong, you can always
restore to your previous setup.

:::

### From CraftBukkit or Spigot

Because Paper is a fork (modified version) of Spigot, which is a fork of CraftBukkit, migrating to
Paper from Spigot is very simple. Just follow these three easy steps:

1. Stop your server if it is running, and create a full backup.
2. Download Paper from [our downloads page](https://papermc.io/downloads).
3. Replace the CraftBukkit/Spigot jar with a freshly downloaded Paper jar.
4. Start your new server.

Paper retains full compatibility with all Spigot plugins, allowing a seamless transition.

:::tip

Your new Paper server will still use `bukkit.yml` and `spigot.yml`, only adding new configuration
options in `paper.yml`.

:::

If you have any issues migrating from CraftBukkit or Spigot, do not hesitate to reach out for
support on [our Discord server](https://discord.gg/papermc).

### From Vanilla

Because it is based on CraftBukkit, Paper stores worlds slightly differently than vanilla. While
Vanilla stores the nether and end both within the `world` folder, CraftBukkit separates this out and
stores them in `world_nether` and `world_the_end` respectively. When you migrate to Paper, your
world will be automatically converted.

1. Stop your Vanilla server, and create a full backup.
2. Downloads Paper from [our downloads page](https://papermc.io/downloads) and replace your Vanilla
   jar.
3. Start your new Paper server.

You have now successfully migrated to Paper. If you encounter any issues, do not hesitate to reach
out for support on our [Discord server](https://discord.gg/papermc) in the `#paper-help` channel.

### From Fabric/Forge

Because both Fabric and Forge use the Vanilla directory structure, they can both follow the
[Vanilla guide](#from-vanilla), with one caveat. If your Fabric or Forge server used mods that added
new blocks, items, or other data to the game, Paper will be unable to load these features.

Additionally, note that Paper does not support Fabric or Forge mods.

## Migrating From Paper

### To Vanilla

Because Paper stores worlds slightly differently than Vanilla, manual work is required to migrate.
If these steps are not taken, your nether and end will look like they have been reset. Don't worry!
Even if this has happened, you haven't lost any data. The Vanilla server just doesn't know where to
look.

Here is a chart to show the difference between how Vanilla and Paper store worlds.

| Server Software | Overworld | Nether                | End                   |
| --------------- | --------- | --------------------- | --------------------- |
| Vanilla         | `/world`  | `/world/DIM-1`        | `/world/DIM1`         |
| Paper           | `/world`  | `/world_nether/DIM-1` | `/world_the_end/DIM1` |

Follow these steps to migrate from Paper to Vanilla:

:::note

These steps assume a `level-name` (set in `server.properties`) of `world`. If this is not the case
for you, replace `world` with your `level-name` for all steps below.

:::

1. Stop your Paper server, if it is running.
2. Take a **full backup** of your server. This is the most important step to prevent data loss!
3. If you have already started your server with Vanilla, go into the `world` folder and delete the
   `DIM-1` and `DIM1` folders. This step is only necessary should you have started your server with
   Vanilla.
4. Copy the `/world_nether/DIM-1` into the `/world` folder.
5. Copy the `/world_the_end/DIM1` into the `/world` folder.
6. Delete both the `/world_nether` and `/world_the_end` folders.
7. Replace your Paper jar with a Vanilla server jar.
8. Start your Vanilla server.

### To CraftBukkit or Spigot

Paper does **not** support migration to either CraftBukkit or Spigot! While you may find success
(both CraftBukkit and Spigot use the same directory structure as Paper), **do not** reach out for
support with issues you encounter and note that data loss is possible.

### To Fabric/Forge

Because both Fabric and Forge use the same directory structure for world storage as Vanilla, follow
the [Vanilla guide](#to-vanilla) for this process. Note that neither Fabric nor Forge will support
Paper plugins! You will be required to find replacement mods.
