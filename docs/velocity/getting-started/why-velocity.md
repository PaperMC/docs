---
slug: /velocity/why-velocity
---

# What Does Velocity Do For Me?

We believe that Velocity is one of the best proxies for _Minecraft_ around, and there's not much
that can top it. However, we do diverge from more established, mainstream solutions in some
important ways. That can make Velocity a bit hard to sell. We are frequently asked "why?" so often.
This page is our answer to that question.

## Strong experience

The founder and primary developer of Velocity (Tux) has been active in developing proxy software for
_Minecraft: Java Edition_ since 2013. They created the RedisBungee plugin, contributed to BungeeCord
from 2014 to 2017, and also founded the Waterfall project and led it from 2016 to 2017. In fact, the
current maintainer of Waterfall helped encourage them to start a brand new proxy from the ground up!

## Leading performance

Velocity powers several highly-populated Minecraft networks, while using fewer resources than the
competition. The recipe to the sauce is simple.

### No entity ID rewriting

When a Minecraft client connects to another Minecraft server, the server will send back an ID that
uniquely identifies a specific player connection. This ID is used in packets that target the player
that the server may send. But what happens when they're actually connecting a proxy that has the
ability to change what server the player is connected to?

Other proxy solutions try to solve this problem by rewriting entity IDs that reference the current
player, changing it from the entity ID assigned by the server the player is currently connected to,
to the entity ID that the player got when they connected to the first server they connected to
through the proxy. This approach is often complicated, leads to bugs, reduces performance, breaks
mods, and ultimately cannot be a complete solution.

However, the Minecraft client actually supports changing its entity ID with a special packet
sequence. Velocity takes advantage of this and forces the client to change its entity ID. This
approach improves performance, improves mod compatibility, and reduces issues caused by incomplete
entity ID rewrites.

### Going deep

Velocity goes deeper than optimizing the handling of the Minecraft protocol. Smart handling of the
protocol produces incredible performance gains but for more performance, we need to go much deeper.

One way in which we drastically improve performance and throughput is by improving the speed of
compressing packets to be sent to the client. On supported platforms (Linux x86_64 and aarch64),
Velocity is able to replace the zlib library ( which implements the compression algorithm used by
the Minecraft protocol) with [libdeflate](https://github.com/ebiggers/libdeflate) which is twice as
fast as zlib while delivering a similar compression ratio.

Velocity also employs several tricks to get the JIT (just-in-time) compiler on our side. Those
tricks require deep understanding of how Java works, but we put in the work to apply those tricks
which translate to increased performance.

### Internal stability policies

Finally, Velocity does not attempt to maintain a stable internal API between minor and major
releases. This allows Velocity to be more flexible and still deliver performance improvements and
new features with each release. For instance, Velocity 1.1.0 delivered massive performance
improvements and added many significant new features by breaking parts of the internal API while
still keeping full compatibility with older plugins. Compare to BungeeCord which is often very
conservative about API breaks and when it does so, provides little notice of the break, and even
when doing a break, does not take the opportunity to seriously improve the API being broken (for
instance, adding RGB support to `ChatColor`).

### Control is in your hands

We take pride in tuning Velocity to be the most performant proxy, but in case the speed provided
out-of-the-box is not good enough, you can easily tweak several performance-related settings in
`velocity.toml`.

## Improved security

Velocity also features more security features, some of which are unique to Velocity. We proactively
foreclose as many denial-of-service attacks as soon as possible and feature a unique player info
forwarding system for Minecraft 1.13+ that requires the server and proxy to know a pre-arranged key.

## Standards and mod support

Unlike certain platforms which only provide lip service to the modding community (and can be at time
hostile to them), Velocity embraces the richness of the platform Minecraft provides. As just a small
example, we have a Fabric mod that
[helps bridge the gap between Velocity itself and mods that extend the Minecraft protocol](https://www.curseforge.com/minecraft/mc-mods/crossstitch)
and feature full Forge support for 1.7 through 1.12.2, with support for newer versions in
development. Velocity also supports emerging standard libraries in the community such as Kyori's
[Adventure](https://github.com/KyoriPowered/adventure) library. We collaborate with the Minecraft
modding community.
