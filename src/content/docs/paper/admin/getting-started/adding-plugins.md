---
title: Plugin Installation Guide
description: Comprehensive guide for finding, installing, and managing plugins on your Paper server.
slug: paper/adding-plugins
---

Plugins are powerful extensions that enhance your Paper server's functionality beyond basic configuration. This guide covers everything you need to know about plugin management.

:::danger[Security Warning]
Plugins have **full system access** to your server and host machine. Always:
- Download plugins from trusted sources only
- Verify plugin authenticity
- Check user reviews and ratings
- Review plugin permissions carefully
:::

## Finding Plugins

### Official Sources

1. **Hangar** ([papermc.io/hangar](https://papermc.io/hangar))
   - Official Paper plugin repository
   - Verified and trusted plugins
   - Direct Paper compatibility

2. **Alternative Sources**
   - [SpigotMC](https://www.spigotmc.org/resources/)
   - [BukkitDev](https://dev.bukkit.org/bukkit-plugins)
   - [PaperMC Forums](https://forums.papermc.io/forums/paper-plugin-releases/)
   - [GitHub](https://github.com)

:::tip[Plugin Compatibility]
- Paper is fully compatible with Spigot and Bukkit plugins
- No special Paper-specific version required
- Enhanced performance with Paper optimizations
:::

### Finding the Right Plugin

1. **Search Strategies**
   - Use specific search terms (e.g., "Minecraft economy plugin")
   - Check plugin ratings and reviews
   - Verify update frequency
   - Review documentation quality

2. **Plugin Evaluation**
   - Check last update date
   - Review user feedback
   - Verify compatibility with your Paper version
   - Check for known issues

## Plugin Installation

### Preparation

1. **Backup Your Server**
   - Create a complete server backup
   - Document current plugin versions
   - Note any custom configurations

2. **Download Verification**
   - Ensure file ends with `.jar`
   - Verify file integrity
   - Check for required dependencies

### Installation Steps

1. **File Placement**
   - Locate your server's `plugins` folder
   - Place the `.jar` file directly in the `plugins` folder
   - Do not use subdirectories

2. **Server Restart**
   - Stop the server cleanly
   - Start the server
   - Monitor startup logs

3. **Verification**
   - Run `/plugins` command
   - Check for green plugin status
   - Verify no errors in console

:::note[Installation Methods]
- **Local Server**: Direct file copy
- **Remote Server**: Use SFTP or hosting panel
- **Shared Hosting**: Follow provider's instructions
:::

## Plugin Management

### Updating Plugins

1. **Update Process**
   - Backup current plugin configuration
   - Download new version
   - Replace old `.jar` file
   - Restart server

2. **Version Control**
   - Keep track of plugin versions
   - Document update history
   - Test updates in development environment

### Plugin Configuration

1. **Initial Setup**
   - Review default configuration
   - Make necessary changes
   - Test functionality

2. **Configuration Files**
   - Located in `plugins/<plugin-name>/`
   - Backup before changes
   - Document custom settings

## Troubleshooting

### Common Issues

#### Missing Dependencies

```log
[Server thread/WARN] Unknown/missing dependency plugins: [Vault]
```

**Solution:**
1. Identify required plugins
2. Install dependencies first
3. Verify correct versions

#### Invalid Plugin File

```log
[Server thread/WARN] Invalid plugin.yml
```

**Causes:**
- Corrupted download
- Wrong file type
- Network issues

**Solutions:**
1. Re-download plugin
2. Verify file integrity
3. Check file extension

#### Duplicate Plugins

```log
[Server thread/WARN] Ambiguous plugin name `Essentials'
```

**Solution:**
1. Remove duplicate versions
2. Keep only latest version
3. Clean `plugins` folder

### Advanced Troubleshooting

1. **Log Analysis**
   - Check `logs/latest.log`
   - Look for error messages
   - Review startup sequence

2. **Plugin Isolation**
   - Test plugins individually
   - Check for conflicts
   - Monitor performance impact

3. **Support Resources**
   - Plugin documentation
   - Paper Discord (`#paper-help`)
   - Plugin issue trackers

## Best Practices

### Security

1. **Plugin Sources**
   - Use official repositories
   - Verify checksums
   - Check for security audits

2. **Permissions**
   - Review plugin permissions
   - Implement least privilege
   - Regular security audits

### Performance

1. **Resource Management**
   - Monitor plugin impact
   - Optimize configurations
   - Regular performance reviews

2. **Maintenance**
   - Regular updates
   - Configuration backups
   - Performance monitoring

:::tip[Pro Tip]
Always test new plugins in a development environment before deploying to production.
:::
