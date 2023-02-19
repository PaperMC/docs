---
slug: /reference/paper-plugins
---

# Paper Plugins

This documentation page serves to explain all the new semantics and possible confusions that Paper plugins may introduce. 

## What are they?

Paper plugins are plugins which are loaded by paper's new plugin loading framework. Paper plugins are used by developers in order to properly
take advantage of modern systems Mojang provides, for example, datapacks. 

![Plugin List](assets/plugin-list.png)

## What is the difference?

When loaded, Paper plugins are **identical** to Bukkit plugins. This allows plugins to still fully communicate and support each other, meaning that even if a
plugin is a Bukkit or Paper plugin, they are both able to depend on each other just fine.

## How do I add Paper plugins?

Paper plugins are added the same as Bukkit plugins, where you must add the plugin into your ``plugins`` directory. 