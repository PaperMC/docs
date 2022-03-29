# Installing Plugins

This guide explains how to install most basic plugins on your server.
You must already have a running CraftBukkit server set up and have
knowledge of how to use the Minecraft server console. If you do not have
a server set up please go to [Setting up a server](README.md) and follow the
instructions there. This guide does not cover setting up an SQL database
or editing properties files, please consult the forums to see if you
need this. Always read the plugin instructions if there are any.

## Installing Most Plugins

1.  Download a plugin of your choice.
2.  Place the .jar and any other files in your plugins directory.
3.  Run the server and wait for it to fully load.
4.  Type **stop** in your Minecraft server console to bring the server
    to a clean stop.
5.  Run the server.
6.  All done! Your plugin should be installed and ready to be used.

### Notes

:::info
    You can find plugins at [BukkitDev](https://dev.bukkit.org/bukkit-plugins).
:::

:::info
    Make sure to download the right version for the plugin
:::

:::info
    The file you downloaded may be an archive (.zip, .rar, .7z) and will need to be extracted using an archive manager such as [7zip](http://www.7-zip.org).
:::

:::info
    Your plugins directory will be a folder called "plugins" in the folder where you created your CraftBukkit server..
:::

:::info
    After you have started your server it may have generated a configuration file, check with the plugin's forum or wiki page for any properties you can configure.
:::

:::info
    Make sure to check your log and console for errors created from your newly installed plugin, this may indicate it requires additional setting up (MySQL, permissions) check with the forum post or the BukkitDev page to see if this is the case.
:::

## Updating Plugins

1.  Create a directory called "update" in your plugins directory.
2.  Download the plugin that you wish to update.
3.  Place ONLY the .JAR file into the update directory.
4.  Restart your CraftBukkit server.
5.  All done! Your plugin should have been updated.

### Notes

:::info
    Ensure the name of the .jar in the update directory is the same as the name of the .jar in the plugins directory for the same plugin.
:::

:::info
    The **reload** command will also unload all the plugins, copy the files from the update directory into the plugins directory (replacing any files with the same name) then load all the plugins again.
:::

:::info
   This method is safer than replacing the file yourself while the server is running and will not disconnect all your players if it was to be done manually.
:::