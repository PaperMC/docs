---
title: Server Migration Guide
description: Comprehensive guide for migrating your Minecraft server to or from Paper, including detailed steps and important considerations.
slug: paper/migration
---

This guide provides detailed instructions for migrating your Minecraft server to or from Paper. Follow these steps carefully to ensure a smooth transition.

:::caution[Critical: Backup Your Data]
Before beginning any migration process, create a complete backup of your server data:
- World folders
- Player data
- Plugin configurations
- Server configuration files

See our [Backup Guide](/paper/updating#step-1-backup) for detailed instructions.
:::

## Migrating to Paper

### From CraftBukkit/Spigot

Paper is designed as a drop-in replacement for CraftBukkit and Spigot, offering improved performance while maintaining full compatibility.

#### Migration Steps

1. **Preparation**
   - Stop your current server
   - Create a complete backup
   - Note down any custom configurations

2. **Server Update**
   - Download Paper from [our downloads page](https://papermc.io/downloads)
   - Rename the downloaded file to match your startup script
   - Replace the existing server JAR with Paper

3. **Configuration**
   - Paper maintains compatibility with:
     - `bukkit.yml`
     - `spigot.yml`
   - New configuration options available in:
     - `config/paper-global.yml`
     - `config/paper-world-defaults.yml`

4. **Post-Migration**
   - Start the server
   - Verify plugin functionality
   - Check world integrity
   - Monitor server performance

:::note[Compatibility]
- All Spigot plugins remain compatible
- No world conversion required
- Improved performance out of the box
:::

### From Vanilla

When migrating from Vanilla, Paper automatically handles world structure conversion.

#### Migration Steps

1. **Preparation**
   - Stop the Vanilla server
   - Create a complete backup
   - Note current server settings

2. **Server Update**
   - Download Paper from [our downloads page](https://papermc.io/downloads)
   - Replace the Vanilla server JAR
   - Rename the JAR to match your startup script

3. **World Conversion**
   - Paper automatically converts world structure
   - Dimensions are separated into individual folders
   - All world data is preserved

4. **Post-Migration**
   - Start the server
   - Verify world integrity
   - Check player data
   - Configure Paper-specific settings

### From Fabric/Forge

:::warning[Important Limitations]
- Paper does not support Fabric or Forge mods
- Custom blocks/items from mods will not be preserved
- You'll need to find plugin replacements for mod functionality
:::

#### Migration Steps

1. **Preparation**
   - Stop the modded server
   - Create a complete backup
   - Document all mod features

2. **Server Update**
   - Follow the [Vanilla Migration Steps](#from-vanilla)
   - Remove all mod files
   - Find plugin replacements for mod features

3. **Post-Migration**
   - Start the server
   - Verify world integrity
   - Test plugin replacements
   - Monitor server performance

## Migrating from Paper

### To Vanilla

Paper uses a different world structure than Vanilla. Follow these steps carefully to ensure proper conversion.

#### World Structure Comparison

| Server Type | Overworld | Nether                | End                   |
|-------------|-----------|-----------------------|-----------------------|
| Vanilla     | `/world`  | `/world/DIM-1`        | `/world/DIM1`         |
| Paper       | `/world`  | `/world_nether/DIM-1` | `/world_the_end/DIM1` |

#### Migration Steps

1. **Preparation**
   - Stop the Paper server
   - Create a complete backup
   - Note current server settings

2. **World Conversion**
   - If Vanilla server was started, delete `DIM-1` and `DIM1` from `/world`
   - Copy `/world_nether/DIM-1` to `/world`
   - Copy `/world_the_end/DIM1` to `/world`
   - Delete `/world_nether` and `/world_the_end` folders

3. **Server Update**
   - Replace Paper JAR with Vanilla server JAR
   - Update server configuration
   - Start the Vanilla server

:::note[Custom Level Names]
If your `level-name` in `server.properties` is not `world`, replace all instances of `world` in the paths above with your custom level name.
:::

### To CraftBukkit/Spigot

:::danger[Not Recommended]
Paper does not officially support migration to CraftBukkit or Spigot. While the directory structure is similar:
- Data loss is possible
- No support will be provided
- Performance will be reduced
:::

### To Fabric/Forge

#### Migration Steps

1. **Preparation**
   - Follow the [Vanilla Migration Steps](#to-vanilla)
   - Document all Paper plugins
   - Find mod replacements for plugin features

2. **Server Update**
   - Install Fabric/Forge
   - Add required mods
   - Configure mod settings

3. **Post-Migration**
   - Start the server
   - Verify world integrity
   - Test mod functionality
   - Monitor server performance

## Troubleshooting

If you encounter issues during migration:
1. Check our [Troubleshooting Guide](/paper/basic-troubleshooting)
2. Join our [Discord](https://discord.gg/papermc) (`#paper-help` channel)
3. Review server logs for errors
4. Verify backup integrity

:::tip[Pro Tip]
Always test migrations in a development environment first, especially when dealing with large or complex servers.
:::
