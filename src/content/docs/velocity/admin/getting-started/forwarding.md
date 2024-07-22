---
title: Configuring player information forwarding
description: How to configure information forwarding on Velocity.
slug: velocity/player-information-forwarding
---

Velocity supports forwarding information about your players to your servers, such as IP addresses,
UUIDs and skins. Velocity supports three forwarding formats:

- **Velocity modern forwarding** is a custom forwarding format (modern forwarding) that is more
  secure.
- **BungeeCord forwarding** (also known as _legacy forwarding_) which has better compatibility but
  is less secure.
- **BungeeGuard**, which is the same as BungeeCord forwarding but includes a secret key. It is
  better than BungeeCord forwarding alone, but it is less ideal than Velocity modern forwarding.

:::note

It is now possible to configure forwarding individually for each server.
In general, if you are supporting clients using Minecraft 1.13 and newer only, use Velocity modern forwarding.
For older versions, consider using BungeeGuard for added security; else you must use BungeeCord forwarding.
<p>Example:</p>

   ```toml
   lobby = "127.0.0.1:30066"
   ```
   Becomes:

   ```toml
   lobby = { address = "127.0.0.1:30066", forwarding-mode = "MODERN" }
   ```

:::

## Configuring modern forwarding

`modern` forwarding is a Velocity-native format. It forwards all player information in an efficient
binary format and employs a MAC code to make it much more difficult to trick the server into
impersonating your Velocity proxy. However, it is only available for Minecraft 1.13 or higher.

:::caution

Modern forwarding is incompatible with Minecraft versions below 1.13 and the
ProtocolSupport plugin. If you use any of these, you will need to use legacy BungeeCord-compatible
forwarding instead.

:::

To use modern forwarding with any supported server implementation, set the `player-info-forwarding-mode`
setting in `velocity.toml` to `modern`. Then, you need to ensure your server is properly configured
to use Velocity forwarding.

### Configuring modern forwarding for Paper

Paper 1.14+ and above, along with Paper 1.13.1/1.13.2 build 377 and above support Velocity modern
forwarding natively.

First, you need to disable the `online-mode` setting in the [`server.properties`](/paper/reference/server-properties#online_mode) file. This prevents
the server from authenticating players, which the proxy will do instead.

You also need to disable BungeeCord forwarding if you had it enabled beforehand. Make sure
`settings.bungeecord` is set to `false` in your `spigot.yml`.

In `config/paper-global.yml`, set `proxies.velocity.enabled` to true and
`proxies.velocity.secret`, to match the secret in your `forwarding.secret` file. You must also set
`proxies.velocity.online-mode` to the `online-mode` setting in your `velocity.toml`. Once
you're done editing `paper-global.yml`, reboot your server.

:::note

If you are using Paper 1.18.2 or lower, you will find these options as `settings.velocity-support.enabled`,
`settings.velocity-support.secret` and `settings.velocity-support.online-mode` in the `paper.yml` file.

:::

## Configuring modern forwarding for Fabric

A mod called [FabricProxy-Lite](https://modrinth.com/mod/fabricproxy-lite) allows you to use
Velocity modern forwarding with a modded server using Fabric.

## Configuring modern forwarding for Forge

A mod called [ProxyCompatibleForge](https://modrinth.com/mod/proxy-compatible-forge) allows you to use
Velocity modern forwarding with a modded server using Forge 1.14 or higher.

## Configuring legacy BungeeCord-compatible forwarding

:::danger

Legacy forwarding is **fundamentally insecure**. If you must use it, you should understand
[how to secure your server properly](/velocity/security). That page reviews all the possible
options to secure your server so that nothing aside from the proxy can connect to your server.

:::

`legacy` forwarding is the player information forwarding protocol that is used by BungeeCord when
enabling IP forwarding from BungeeCord. Due to this, it is ubiquitous and well-supported by most
server implementations. It has excellent compatibility (supporting versions as old as 1.7.2,
released in 2013) and will work with Forge if you also install SpongeForge/BungeeForge on your modded server and
configure it correctly. However, it is not secure.

If you must use BungeeCord-compatible forwarding, simply set your `player-info-forwarding-mode` setting
in `velocity.toml` to `legacy`. You will also need to make sure your server can accept the forwarded
player data sent by Velocity.

To add some security, particularly for proxies hosted on shared hosting, Velocity optionally
supports the [BungeeGuard](https://www.spigotmc.org/resources/bungeeguard.79601/) plugin. To use it,
set the `player-info-forwarding-mode` setting in `velocity.toml` to `bungeeguard`, then add the value in
the `forwarding.secret` file to the token section in the BungeeGuard configuration.

### Configuring legacy forwarding for Spigot / Paper

To make Spigot or Paper understand the data forwarded from Velocity, set `settings.bungeecord` to
`true` in your `spigot.yml` and then reboot your server.

### Configuring legacy forwarding for Sponge

To configure Sponge to understand the data forwarded from Velocity, you will need to stop the server
first, set `modules.bungeecord` to `true` and `bungeecord.ip-forwarding` to `true` in your
`config/sponge/global.conf` file, and then restart your Sponge server.

### Configuring legacy forwarding for Forge

To configure Forge to understand the data forwarded from Velocity, you will need to stop the server
first, download your correct [BungeeForge](https://github.com/caunt/BungeeForge/releases) version and place the mod into the mods folder, and then restart your Forge server.

### Configuring legacy forwarding for Fabric

:::caution

There are no longer any actively supported mods that support legacy forwarding. Please use Velocity
modern forwarding instead.

:::
