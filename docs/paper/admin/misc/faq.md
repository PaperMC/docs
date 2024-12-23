---
slug: /faq
description: Questions frequently asked by our community, answered by us!
---

# Frequently Asked Questions

## Unsupported Java detected, what do I do?!

Unsupported, early-access, or internal versions of Java are often missing features, have known issues or be straight up broken.
As such, we cannot provide support for servers running such versions.
You should install a supported version of Java as explained [here](/misc/java-install).

If you still wish to continue, knowing that you are on your own and will receive NO support, you can disable the check with a system property, as explained [here](/paper/reference/system-properties#paperignorejavaversion).

## What is a Paper plugin?

A Paper plugin is a plugin that is compiled against the Paper API.<br>
Developers can find more info on how to get started writing Paper plugins [here](/paper/dev/getting-started).<br>
Server Admins can learn how to find and install Paper plugins [here](/paper/adding-plugins).

## What is a Spigot plugin?

A Spigot plugin is a plugin that is compiled against the Spigot API.
Most Spigot plugins are compatible with your Paper, but plugins that use Spigot API introduced after Minecraft 1.21.4 may not work correctly.

## What is a Bukkit plugin?

The term Bukkit plugin is a bit missleading. The Bukkit project died in 2014. The Bukkit API lives on in our fork of it, called Paper API.
When people say Bukkit plugin, they most likely refer to a [Paper plugin](#what-is-a-paper-plugin).

## What is a (Paper) lifecycle plugin? (formally known as experimental Paper plugins)

Lifecycle plugins are special kinds of Paper plugins that use advanced features of the Paper API to hook into the server's lifecycle.
They have been confusingly refered to as (experimental) Paper plugins or Paper manifest plugins before.<br>
Server Admins can find more information [here](/paper/reference/lifecycle-plugins).<br>
Plugin developers can learn how to write lifecycle plugins [here](/paper/dev/advanced/lifecycle-plugins).
