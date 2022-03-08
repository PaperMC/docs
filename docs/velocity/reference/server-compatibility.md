---
slug: /velocity/server-compatibility
---

# Server Compatibility

Velocity is compatible with many Minecraft server implementations. The expectation is that if the
server acts like vanilla, Velocity will work, and we make special provisions for modded setups where
we can.

## Compatible game versions

As of this writing, Velocity is compatible with Minecraft 1.7.2 through 1.18.1.

## Vanilla setups

Velocity is best-tested with implementations derived from the vanilla server by Mojang that do not
add content to the game itself.

### Vanilla servers

The Mojang vanilla software is in a complicated position. It is useful as we often produce protocol
updates using the Mojang server for testing, but in production setups, the lack of player info
forwarding support can induce subtle client problems.

If you plan to run a vanilla server, **the Velocity team strongly recommends that you use Fabric
with the FabricProxy-Lite mod**. Fabric and FabricProxy-Lite do not by themselves change the vanilla
experience, and your server will remain compatible with vanilla clients. If you are unable (or
unwilling) to run Fabric, [VanillaCord](https://github.com/ME1312/VanillaCord) allows you to use
legacy BungeeCord forwarding.

### Spigot

Spigot is not well-tested with Velocity. However, it is based on vanilla and as it is the base for
Paper, it is relatively well-supported.

Spigot does not support Velocity's modern forwarding, but does support legacy BungeeCord forwarding.

### Paper

The Velocity project recommends using Paper for running a public server. Velocity works with all
versions of Paper from 1.7.10 to the latest version.

You can use Velocity's modern forwarding if you run Paper 1.13.2 or higher. If you use Paper 1.12.2
or lower, you must use legacy BungeeCord-style forwarding.

### SpongeVanilla

SpongeVanilla is compatible with legacy BungeeCord-style forwarding. Our Sponge support largely
focuses on Forge compatibility, see below for more information.

## Modded setups

### Fabric

Velocity works with Fabric out of the box, but you should add support for player info forwarding
using a mod like [FabricProxy-Lite](https://modrinth.com/mod/fabricproxy-lite) (which supports
Velocity modern forwarding).

In addition, if you intend to run mods that add new content on top of vanilla, you should install
[CrossStitch](https://modrinth.com/mod/crossstitch), which improves support for certain Minecraft
features that are extended by mods, such as custom argument types. This mod is officially maintained
by the Velocity project.

### Minecraft Forge (1.13 and above)

**Minecraft Forge for Minecraft 1.13 and later is not compatible with Velocity** due to changes made
in the handshake protocol that are difficult for proxies to adapt to. Support is currently a work in
progress, but there is no set time for support to be available.

### Minecraft Forge (1.7.2-1.12.2)

Minecraft Forge for Minecraft 1.7.2-1.12.2 is fully compatible with Velocity, as we make special
provisions to synchronize client state with each server. However, we **strongly** recommend the use
of SpongeForge, as it allows you to use legacy BungeeCord player info forwarding and generally
improves proxy support in general.

Velocity does not support Forge-Bukkit hybrids - they have caused several issues, and the design of
the Bukkit API precludes any notion of sane mod support.

## Proxy-behind-proxy (BungeeCord/Waterfall, Velocity, ...)

These setups are _completely unsupported_. You are best advised to avoid them, as they can cause
lots of issues. Most proxy-behind-proxy setups are either illogical in the first place or can be
handled more gracefully by better, more scalable and performant solutions.

## Other Implementations

This is, naturally, not an exhaustive list. Alternative implementations of the Minecraft protocol
may or may not work. We encourage you to experiment and to contribute back with your results.
