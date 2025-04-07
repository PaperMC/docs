---
title: Adding plugins
description: Plugins are the most powerful way to extend the functionality of Paper beyond the configuration files.
slug: paper/adding-plugins
---

Plugins are the most powerful way to extend the functionality of Paper beyond the configuration
files. Functionality added by plugins can range from making milk restore hunger or dead bushes grow,
to adding entirely new and original game modes or items.

:::danger[Malicious Plugins]

Ensure you fully trust the source of any plugin before installing it. Plugins are given **full and
unrestricted** access to not only your server but also the machine that it runs on. Because of this,
it is imperative that plugins only be installed from trusted sources. Be careful!

:::

## Finding plugins

Before installing a plugin, you'll need to find what you want to install. The best place to find plugins is [Hangar](https://hangar.papermc.io), Paper's plugin repository, but you can also find many plugins
on [SpigotMC](https://www.spigotmc.org/resources/),
[BukkitDev](https://dev.bukkit.org/bukkit-plugins), or the
[PaperMC Forums](https://forums.papermc.io/forums/paper-plugin-releases/), while other plugins may
release on [GitHub](https://github.com). One of the best ways to find plugins isn't to browse any of
these sites directly but to search for plugins using a search engine. Searching for the function you
desire followed by `Minecraft plugin` will often yield good results.

:::tip[Spigot and Bukkit Plugins]

Paper is compatible with both Spigot and Bukkit plugins. It's okay if a plugin does not explicitly
mention Paper compatibility. It'll still work.

:::

## Installing plugins

1. Once you've found the plugin you'd like to install, download it. Ensure the file you have
   downloaded ends in `.jar`. Some plugins also distribute as `.zip` files, in which case you will
   need to extract the file and locate the `.jar` for your platform, often labeled `bukkit` or
   `paper`.
2. Once you have the plugin downloaded locally, locate the `plugins` folder from the root directory
   of your Paper server.
3. Drag and drop the plugin file (`.jar`) into the `plugins` folder. If you are using a shared
   hosting service, you may need to use their web panel or SFTP to upload the plugin; however, the
   procedure will be the same.
4. Restart your server. The plugin should load.
5. Check your work. Once the server has finished loading, run the `/plugins` command in-game or type
   `plugins` into the console. You should see your freshly installed plugin listed in green. If it
   is not listed or is colored red, continue to [troubleshooting](#troubleshooting). A plugin listed
   in red means that it is not currently enabled. For a freshly installed plugin, this often means
   that the plugin failed to load.

## Troubleshooting

### Check your logs

The first step to troubleshooting installing plugins is to check the log of your server. Your
server's most recent logs will be stored to the `logs/latest.log` file. You may need to scroll near
the beginning of this file to see when plugins were loaded.

#### Missing dependencies

If you see something like this:

```log
[00:00:00] [Server thread/WARN] Could not load 'plugins/MyAwesomePlugin-1.0.0.jar' in folder 'plugins'
[00:00:00] [Server thread/WARN] org.bukkit.plugin.UnknownDependencyException: Unknown/missing dependency plugins: [Vault]. Please download and install these plugins to run 'MyAwesomePlugin'.
```

This means that the plugin you tried to install is missing a dependency. A dependency, in this case,
is another plugin that you must install for the first to function. While you will get a big scary
error, the important line to look at is:

```log
[00:00:00] [Server thread/WARN] Unknown/missing dependency plugins: [Vault]. Please download and install these plugins to run 'MyAwesomePlugin'.
```

This is telling you that in order to load `MyAwesomePlugin`, you must first install `Vault`.

#### Invalid `plugin.yml`

If you see something closer to this:

```log
[00:00:00] [Server thread/WARN] Could not load 'plugins/MyAwesomePlugin-1.0.0.jar' in folder 'plugins'
[00:00:00] [Server thread/WARN] org.bukkit.plugin.InvalidDescriptionException: Invalid plugin.yml
```

This means that what you have downloaded isn't a valid Paper plugin. This is generally caused by one
of the following:

1. The plugin you downloaded isn't a plugin at all, but instead a mod for Forge, Fabric, or similar.
   These will not run on Paper.
2. The plugin failed to download completely. Especially when using tools such as `curl` or `wget`,
   you can easily download error pages rather than the plugin you intended. This may also be caused
   by a network issue. Attempt to download the plugin again. If you are using FTP (not SFTP or a web
   panel) to upload your plugin to a shared hosting service, ensure your FTP client is in `binary`
   and not `ASCII` mode. Consult the documentation for your FTP client for details.

#### Ambiguous plugin name

If you see something like this:

```log
[00:00:00] [Server thread/WARN] Ambiguous plugin name `Essentials' for files `plugins/EssentialsX-2.19.4.jar' and `plugins/Essentialsx-2.20.0-dev.jar' in `plugins'
```

This means you have two plugins with the same name, which is not supported. In this case, two
versions of EssentialsX are installed. Both the release `2.19.4`, and a development build of
`2.20.0`. Ensure you only have one version of each plugin installed at one time. Delete the older
version of the duplicate plugin, and restart your server.

To prevent accidentally installing two versions of one plugin while updating, you can use
the `update` folder as described in the [Update Guide](/paper/updating#step-2-update-plugins).

#### Something else

If you see an error, but it isn't similar to one of the above, attempt to read it yourself. While
the full error may be large and scary, you likely only have to read the first one or two lines to
understand what is going on. If you're not sure, do not hesitate to reach out for support on our
[Discord](https://discord.gg/papermc) in the `#paper-help` channel.

### If nothing is logged

If nothing is logged, your server is likely not attempting to load any plugins. The conditions
needed for the server to load a plugin are as follows:

1. The file is at the root of the `plugins` folder, relative to its working directory. This is
   usually the same folder as the server JAR file. **Subdirectories of the `plugins` folder will not
   be checked.** All plugins must be in the root folder.
2. The file ends in `.jar`. If your plugin does not end in `.jar`, what you have downloaded may not
   be a plugin. Note that some plugins distribute multiple JARs as `.zip` files. If this is the
   case, you have to extract them before installing the plugin.

If both of these are true, and you still see no logs, please reach out for support on our
[Discord](https://discord.gg/papermc) server in the `#paper-help` channel. We will be happy to
assist you.
