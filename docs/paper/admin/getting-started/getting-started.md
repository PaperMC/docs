---
slug: /getting-started
description: How to get started with downloading and setting up a Paper server.
---

# Getting Started

## Requirements

:::tip

With the release of Minecraft 1.18, Paper now requires **Java 17** to run. If you don't already have
Java 17, [it's easy to download and install](/misc/java-install).

:::

| Paper Version  | Recommended Java Version |
|----------------|--------------------------|
| 1.8 to 1.11    | Java 8                   |
| 1.12 to 1.16.4 | Java 11                  |
| 1.16.5         | Java 16                  |
| 1.17.1-1.18.1+ | Java 17                  |

## Migrating to Paper

### From Vanilla

Migrating from Vanilla is easy, but there are some differences, namely in world saves. Paper (and
CraftBukkit and Spigot) separate out each dimension of a world (nether, the end, etc.) into separate
world folders.

Paper will handle this conversion for you automatically. No additional consideration is required.

### From Craftbukkit or Spigot

Paper is a drop in replacement for both CraftBukkit and Spigot, you don't need to make any changes.

## Downloading Paper

Paper provides runnable server jars directly from our
[website's downloads page](https://papermc.io/downloads).

Click on the build number to download a file.

## Running The Server

To run the server, simply start it up like any other Java application.

Open your terminal, navigate to the saved location, and then run
`java -Xms2G -Xmx2G -jar paper.jar --nogui`. Ensure you replace `paper.jar` with the name of the jar
you have downloaded.

The amount of RAM can be set by changing the numbers in the `-Xms` and `-Xmx` arguments. `--nogui`
disables Vanilla's GUI, so you don't get double interfaces when using the command line.

For more advanced Java tuning, see [Aikar's Flags](../how-to/aikars-flags.md).

To configure your server, see the [Global Configuration](../reference/configuration/global-configuration.mdx) and
[Per World Configuration](../reference/configuration/world-configuration.mdx) pages.

## Updating The Server

Updating Paper is simple! See our [Update Tutorial](../how-to/update.md) for more information.
