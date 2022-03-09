---
slug: /velocity/faq
---

# Frequently Asked Questions

Over the years, we've been asked many of the same questions by users. This FAQ attempts to answer as
many of these questions from the user perspective.

## What version of Java does Velocity require?

Velocity 3.0.0 requires Java 11 or above.

## Where can I find Velocity plugins?

A good source for finding plugins compatible with Velocity would be our
[forums](https://forums.velocitypowered.com/c/plugins/plugin-releases/6).

## Does Velocity support plugins developed for BungeeCord or Waterfall?

No. Many of the things Velocity can do could not be done if we decided to support BungeeCord
plugins.

However, certain plugins may have Velocity ports available or alternatives are available. In
addition, plugins that support BungeeCord but only require that they are installed on the server
(nothing on the proxy) typically use the BungeeCord plugin messaging channel, which is supported
natively by the latest versions of Velocity.

## Help, I can't connect to my server!

There are a few common causes for why you can't connect to the server.

### Basic Troubleshooting

As a first step, you should verify:

- that your servers are started and are responsive to console input
- that the proxy is started
- that the server and proxy are bound to the appropriate port and IP

### Improper Player Information Forwarding Errors

```
Can't connect to server lobby: If you wish to use IP forwarding, please enable it in your Bungeecord config as well!
```

```
Can't connect to server lobby: Your server did not send a forwarding request to the proxy. Is it set up correctly?
```

These errors are result of improper configuration. See
[Player Information Forwarding](forwarding.md) to learn how to properly set up player information
forwarding.

### Improper Modern Player Information Forwarding

```
Can't connect to server lobby: This server requires you to connect with Velocity.
```

This error is a result of enabling Velocity modern forwarding on your backend server but not
enabling it in Velocity. To fix this error, ensure that you have set up the correct player
information forwarding method on the proxy. See [Player Information Forwarding](forwarding.md) for
more information.

### Invalid Payload Register

```
[server connection] player1 -> hub has connected
[connected player] player1 (/localhost:58943): kicked from server hub: Invalid payload REGISTER!
```

This error typically occurs on Spigot-based servers when someone connects with a modded client. You
can fix this issue if you use Paper (or a fork of Paper) 1.12.2 or above by adding the startup flag
`-Dpaper.disableChannelLimit=true` to the server's startup flags and restarting the server.

### Argument type identifier XXX unknown

```
Argument type identifier <namespace>:<name> unknown.
```

If you receive this message, there are two possibilities. If you run a modded server and are using
Fabric 1.16+ and above, update to at least Velocity 1.1.2 and install
[CrossStitch](https://www.curseforge.com/minecraft/mc-mods/crossstitch). (If you are running any
other kind of modded server and have it working with Velocity, let us know!)

If you receive this message but run a vanilla server,
[please report a bug to the Velocity issue tracker](https://github.com/PaperMC/Velocity/issues/new).

### Read time out while switching to a Forge server

Particularly for some very large mod packs, there is an elevated risk of the connection between the
player and the proxy dropping. There is not much we can do on the proxy end to alleviate this. We
suggest either reducing the number of mods your server uses, or raise the `read-timeout` setting in
`velocity.toml` and add the `-Dfml.readTimeout` startup flag to your Forge server and setting it to
the value (in seconds) you chose for the proxy. For instance, if you determine that 120 seconds is
the best read timeout to use, use `-Dfml.readTimeout=120` and set `read-timeout = 120000` in
`velocity.toml`.

### My forced hosts are not working!

First, double-check that you properly set up DNS records pointing to your proxy for the forced hosts
you have selected. Forced hosts are _not_ compatible with SRV records, so if you are relying on SRV
records to direct the player to the proxy, you will need to find a way to get the proxy running on
the default Minecraft port, 25565.
