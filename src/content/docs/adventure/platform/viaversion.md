---
title: ViaVersion
slug: adventure/platform/viaversion
description: Using Adventure with ViaVersion.
---

:::danger

Adventure platform implementation for ViaVersion is no longer maintained.
The Adventure team no longer provides support for using these libraries.

We recommend that users of these libraries update to modern platforms that [natively support Adventure](/adventure/platform/native) (e.g., Velocity, Paper, Sponge API 8+).

:::

On supported platforms (Sponge 7 and Bukkit), Adventure is able to enhance its functionality
by using the [ViaVersion](https://hangar.papermc.io/ViaVersion/ViaVersion) API
to send packets directly to the client. This allows, for instance, for a plugin on a Minecraft
1.7 server to send RGB chat messages and titles to clients on newer versions of Minecraft.

If you include the Sponge or Bukkit platforms, no further action is required: ViaVersion will
be detected and support for it will be enabled.
