---
slug: /dev/plugin-yml
---

# Bukkit Plugin YML

The plugin.yml file is the main configuration file for your plugin. 
It contains information about your plugin, such as its name, version, and description. 
It also contains information about the plugin's dependencies, permissions, and commands.

The plugin.yml file is located in the `resources` directory of your project.
```
example-plugin
├── build.gradle.kts
├── settings.gradle.kts
└── src
    └── main
        ├── java
        └── resources
            └── plugin.yml
```

## Example

Here is an example of a plugin.yml file:

```yaml
name: ExamplePlugin
version: 1.0.0
main: io.papermc.testplugin.ExamplePlugin
description: An example plugin
author: PaperMC
website: https://papermc.io
api-version: 1.19
```

## Fields

:::note

The fields in this section are not in any particular order. 
If they have an asterisk (\*) next to them, that means they are required.

:::

### name*

The name of your plugin. This is what will be displayed in the plugin list and log messages. 
This will be overridden in the logs if the prefix is set.
- `name: ExamplePlugin`

### version*

The current version of the plugin. This is shown in plugin info messages and server logs.
- `version: 1.0.0`

### main*

The main class of your plugin. This is the class that extends `JavaPlugin` and is the entry point to your plugin.
- `main: io.papermc.testplugin.ExamplePlugin`

This is the package path and class name of your main class.

### description

A short description of your plugin and what it does. This will be shown in the plugin info commands.
- `description: An example plugin`

### author / authors

The author(s) of the plugin. This can be a single author or a list of authors.
- `author: PaperMC`
- `authors: [PaperMC, SpigotMC, Bukkit]`
These will be shown in the plugin info commands.

### contributors

The contributors to the plugin that aren't the managing author(s).
- `contributors: [PaperMC, SpigotMC, Bukkit]`
These will be shown in the plugin info commands.

### website

The website of the plugin. This is useful for linking to a GitHub repository or a plugin page.
- `website: https://papermc.io`
This will be shown in the plugin info commands.

### api-version

The version of the Paper API that your plugin is using. This doesn't include the minor version.
Servers with a version lower than the version specified here will refuse to load the plugin.
The valid versions are 1.13 - 1.19.
- `api-version: 1.19`

:::info

If this is not specified, the plugin will be loaded as a legacy plugin and a warning will be printed to the console.

:::

### load

This tells the server when to load the plugin. This can be `STARTUP` or `POSTWORLD`. Will default to `POSTWORLD` if not specified.
- `load: STARTUP`

### prefix

The prefix of the plugin. This is what will be displayed in the log instead of the plugin name.
- `prefix: EpicPaperMCHypePlugin`

### libraries

:::warning

The use of this feature is *currently* against maven central's TOS. However, this feature is very likely to stay.

:::

This is a list of libraries that your plugin depends on. These libraries will be downloaded from the Maven central repository and added to the classpath.
This removes the need to shade and relocate the libraries.

```yaml
libraries:
  - com.google.guava:guava:30.1.1-jre
  - com.google.code.gson:gson:2.8.6
```

### permissions

This is a list of permissions that your plugin uses. This is useful for plugins that use permissions to restrict access to certain features.
```yaml
permissions :
    permission.node:
        description: "This is a permission node"
        default: op
        children:
            permission.node.child: true
    another.permission.node:
        description: "This is another permission node"
        default: not op
```

The description is the description of the permission node. This is what will be displayed in the permissions list.
The default is the default value of the permission node. This can be `op`/`not op`, or `true`/`false`. This defaults to the value of `default-permission` if not specified. (Which defaults to `op` if not specified)
Each permission node can have children. When set to `true` it will inherit the parent permission.

### default-permission

The default value that permissions that don't have a `default` specified will have. This can be `op`/`not op`, or `true`/`false`.
- `default-permission: true`

## Commands

This is a list of commands that your plugin uses. This is useful for plugins that use commands to provide features.
```yaml
commands:
    command:
        description: "This is a command"
        usage: "/command <arg>"
        aliases: [cmd, command]
        permission: permission.node
        permission-message: "You do not have permission to use this command"
```

- The __description__ is the description of the command. This gives a brief description of what the command does.
- The __usage__ is the usage of the command. This is what will be displayed when the player uses `/help <command>`.
- The __aliases__ are a list of aliases that the command can be used with. This is useful for shortening the command.
- __permission__ is the permission node that the player needs to use the command. Note: Players will only see commands they have permission to use.
- __permission-message__ is the message that will be displayed when the player does not have permission to use the command.

## Dependencies:

:::warning[Dependency Loops]

If a plugin is specified as a dependency, it will be loaded before your plugin.
Be careful as these can cause plugin load issues if cyclical dependencies appear. A Cyclical dependency can be illustrated as follows:

PluginA -> PluginB -> PluginA -> PluginB... etc.

Where PluginA and PluginB are plugins that depend on each other.

:::

### depend

A list of plugins that your plugin depends on to __load__. They are specified by their plugin name.

:::info

If the plugin is not found, your plugin will not load.

:::

- `depend: [Vault, WorldEdit]`

### softdepend

A list of plugins that your plugin depends on to have __full functionality__. They are specified by their plugin name.

- `softdepend: [Vault, WorldEdit]`

### loadbefore

A list of plugins that your plugin should be loaded __before__. They are specified by their plugin name.
This is useful if you want to load your plugin before another plugin for the other plugin to use your plugin's API.

- `loadbefore: [Vault, FactionsUUID]`

### provides

This can be used to tell the server that this plugin will provide the functionality of some library or other plugin (like an alias system).
Plugins that (soft)depend on the other plugin will treat your plugin as if the other plugin exists when resolving dependencies or using `PluginManager#getPlugin(String)`.
- `provides: [SomeOtherPlugin]`
