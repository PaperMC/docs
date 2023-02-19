---
slug: /reference/paper-plugins
---

# Paper Plugins

This documentation page serves to explain all the new semantics and possible confusions that Paper plugins may introduce.

*As a developer, you can get more information [here](docs/paper/dev/getting-started/paper-plugins.md)*

## What are they?

Paper plugins are plugins which are loaded by Paper's new plugin loading framework. Paper plugins are used by developers to
take advantage of modern systems Mojang provides, for example, datapacks.

![Plugin List](assets/plugin-list.png)

## What is the difference?

When enabled, Paper plugins are **identical** to Bukkit plugins. This allows plugins to still fully communicate and support each other, meaning that even if a
plugin is a Bukkit or Paper plugin, they are both able to depend on each other just fine.

Paper plugins only support being loaded by Paper's Plugin Loader and may use new API unavailable to Bukkit plugins.

### How do I add Paper plugins?

Paper plugins are added the same as Bukkit plugins, therefore, you can follow [this guide](docs/paper/admin/getting-started/adding-plugins.md)

### Cyclic Dependency Detection

With the introduction of Paper plugins, Paper introduces a new plugin loader that fixes some odd issues.
However, as a result, this now causes [cyclic dependencies](#cyclic-dependency-detection) between plugins to no longer be supported. 

![Cyclic Dependency](assets/cyclic-dependency.png)

Cyclic dependencies are when a plugins dependencies cause a loop which eventually will cycle back to the original plugin.

If Paper detects a cyclic dependency, your server will be shut down with an error similar to this:
```
Circular dependencies detected!
You have a plugin that is depending on a plugin which refers back to that plugin. Your server will shut down until these are resolved, or the strategy is changed.
Circular dependencies:
MyPlugin depends on MyPluginDependency depends on MyPlugin...
```

It is up to plugin developers to resolve these circular dependency issues, however, you are able to use the legacy plugin loader if you 
absolutely are unable to resolve this dependency loops.


:::danger Legacy

If your server **requires** these circular dependencies, you can enable this by adding the **-Dpaper.useLegacyPluginLoading=true** startup flag.
Please note that this may not be supported in the future.
:::