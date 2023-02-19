---
slug: /reference/paper-plugins
---

# Paper Plugins

This documentation page serves to explain all the new semantics and possible confusions that Paper plugins may introduce.

*As a developer, you can get more information [here](docs/paper/dev/getting-started/paper-plugins.md)*

## What are they?

Paper plugins are plugins which are loaded by Paper's new plugin loading framework. Paper plugins are used by developers in order to properly
take advantage of modern systems Mojang provides, for example, datapacks.

![Plugin List](assets/plugin-list.png)

## What is the difference?

When enabled, Paper plugins are **identical** to Bukkit plugins. This allows plugins to still fully communicate and support each other, meaning that even if a
plugin is a Bukkit or Paper plugin, they are both able to depend on each other just fine.

Paper plugins simply note that they may only support being loaded by Paper's Plugin Loader, and may use new modern API that 
Bukkit plugins are not able to utilize.

## How do I add Paper plugins?

Paper plugins are added the same as Bukkit plugins, therefor, you can follow [this guide](docs/paper/admin/getting-started/adding-plugins.md)