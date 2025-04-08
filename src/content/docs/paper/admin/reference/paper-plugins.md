---
title: Paper plugins
description: A guide to the ins and outs of Paper plugins.
slug: paper/reference/paper-plugins
---

This documentation page serves to explain all the new semantics and possible confusions that Paper plugins may introduce.

:::note

Developers can get more information on Paper plugins [here](/paper/dev/getting-started/paper-plugins).

:::

## What are they?

Paper plugins are plugins which are loaded by Paper's new plugin loading framework. Paper plugins are used by developers to
take advantage of modern systems Mojang provides, for example, datapacks.

![Plugin List](./assets/plugin-list.png)

## What is the difference?

When enabled, Paper plugins are **identical** to Bukkit plugins. This allows plugins to still fully communicate and support each other, meaning that even if a
plugin is a Bukkit or Paper plugin, they are both able to depend on each other just fine.

Paper plugins only support being loaded by Paper's Plugin Loader and may use new API unavailable to Bukkit plugins.

### How do I add Paper plugins?

Paper plugins are added the same as Bukkit plugins, therefore, you can follow [this guide](/paper/adding-plugins).

### Cyclic plugin loading

With the introduction of Paper plugins, Paper introduces a new plugin loader that fixes some odd issues.
However, as a result, this now causes [cyclic loading](/paper/dev/getting-started/paper-plugins#cyclic-plugin-loading) between plugins to no longer be supported.

If Paper detects a loop, your server will be shut down with an error.

:::danger[Legacy]

If your server **requires** this circular loading, you can enable this by adding the [`-Dpaper.useLegacyPluginLoading=true`](/paper/reference/system-properties#paperuselegacypluginloading) startup flag.
Please note that this may not be supported in the future.

:::
