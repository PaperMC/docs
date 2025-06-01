---
title: Platforms
description: Documentation regarding various implementations of the Adventure API.
tableOfContents: false
sidebar:
  label: Overview
---

Adventure integrates with many of the Minecraft platforms out there. Some platforms support
Adventure natively, but other legacy platforms have their own types and need an adapter to handle Adventure types. To enable you to use Adventure with these platforms, Adventure provides a number of platform-specific adapters to
allow you to obtain `Audience` instances from native user types.

Contents:
* [Native support](/adventure/platform/native)
* [Bukkit](/adventure/platform/bukkit)
  * [Usage](/adventure/platform/bukkit#usage)
  * [Component serializers](/adventure/platform/bukkit#component-serializers)
* [BungeeCord](/adventure/platform/bungeecord)
  * [Usage](/adventure/platform/bungeecord#usage)
  * [Component serializers](/adventure/platform/bungeecord#component-serializers)
* [SpongeAPI](/adventure/platform/spongeapi)
  * [Usage](/adventure/platform/spongeapi#usage)
* [Modded (Fabric and NeoForge shared API)](/adventure/platform/modded)
  * [Dependency](/adventure/platform/modded#dependency)
  * [Basic use](/adventure/platform/modded#basic-use)
  * [Working with native types](/adventure/platform/modded#working-with-native-types)
* [Fabric](/adventure/platform/fabric)
  * [Dependency](/adventure/platform/fabric#dependency)
  * [Basic use](/adventure/platform/fabric#basic-use)
  * [Server](/adventure/platform/fabric#server)
  * [Client](/adventure/platform/fabric#dependency)
  * [Working with native types](/adventure/platform/fabric#working-with-native-types)
* [NeoForge](/adventure/platform/neoforge)
  * [Dependency](/adventure/platform/neoforge#dependency)
  * [Basic use](/adventure/platform/neoforge#basic-use)
  * [Server](/adventure/platform/neoforge#server)
  * [Commands](/adventure/platform/neoforge#commands)
  * [Client](/adventure/platform/neoforge#dependency)
* [ViaVersion](/adventure/platform/viaversion)
* [Implementing platforms](/adventure/platform/implementing)
  * [Services](/adventure/platform/implementing#services)
  * [Conventional behaviors](/adventure/platform/implementing#conventional-behaviors)


:::note

**Why is adventure-platform not sending any messages or not working correctly?**

Firstly, please ensure you are on the latest stable version. It can be found on [Maven Central](https://central.sonatype.com/search?q=g%3Anet.kyori+adventure-platform*).

Next, make sure that the feature you are using exists on the client version that is receiving the action.
For example, hex color codes won't work on clients older than 1.16, so hex colors will be down-sampled.

If it's still not working, it is useful to enable debug mode by setting the system property `net.kyori.adventure.debug` to `true` and
looking at the output. This will show what facets are being selected which will help point towards why it is not working for you.
If you still cannot figure out the issue by yourself, you can always ask in the
[`#adventure-platform-help`](https://discord.com/channels/289587909051416579/1342379165663363112) channel in the PaperMC Discord!

:::
