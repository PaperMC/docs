---
title: Plugin messaging
description: How to handle and send plugin messages on Velocity.
slug: velocity/dev/plugin-messaging
---

First introduced in [2012](https://web.archive.org/web/20220711204310/https://dinnerbone.com/blog/2012/01/13/minecraft-plugin-channels-messaging/),
plugin messaging is a way for Velocity plugins to communicate with clients and backend servers.

Velocity manages connections in both directions, for both the client and backend server.
This means Velocity plugins need to consider 4 main cases:

```d2
style.fill: transparent
direction: right

player -> Velocity: "1 (Incoming)"
Velocity -> backend: "2 (Outgoing)"
backend -> Velocity: "3 (Incoming)"
Velocity -> player: "4 (Outgoing)"
```

:::caution

When listening to `PluginMessageEvent`, ensure the result is
[`ForwardResult.handled()`](jd:velocity:com.velocitypowered.api.event.connection.PluginMessageEvent$ForwardResult#handled())
if you do not intend the client to participate.

If the result is forwarded, players can impersonate the proxy to your backend servers.

Additionally, ensure the result is set correctly after actually handling correct messages, to prevent them from being leaked to the other party.

This can be achieved with unconditionally setting the result between checking the identifier and checking the source, as shown in the examples.

:::

Additionally, BungeeCord channel compatibility is included, which may remove the need for a companion Velocity plugin in certain cases.

## Case 1: Receiving a plugin message from a player

This is for when you need to handle or inspect the contents of a plugin message sent by a player.
It will require registering with the ChannelRegistrar for the event to be fired.

An example use case could be logging messages from a mod that reports the enabled features.

```d2
style.fill: transparent
direction: right

"Forward from player" {
  player -> Velocity
  Velocity -> backend
}

"Handle from player" {
  player -> Velocity
  Velocity -> backend {
    style.stroke: transparent
  }
}
```


```java
public static final MinecraftChannelIdentifier IDENTIFIER = MinecraftChannelIdentifier.from("custom:main");

@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
    proxyServer.getChannelRegistrar().register(IDENTIFIER);
}

@Subscribe
public void onPluginMessageFromPlayer(PluginMessageEvent event) {
    // Check if the identifier matches first, no matter the source.
    if (!IDENTIFIER.equals(event.getIdentifier())) {
        return;
    }

    // mark PluginMessage as handled, indicating that the contents
    // should not be forwarding to their original destination.
    event.setResult(PluginMessageEvent.ForwardResult.handled());

    // Alternatively:

    // mark PluginMessage as forwarded, indicating that the contents
    // should be passed through, as if Velocity is not present.
    //event.setResult(PluginMessageEvent.ForwardResult.forward());

    // only attempt parsing the data if the source is a player
    if (!(event.getSource() instanceof Player player)) {
        return;
    }

    ByteArrayDataInput in = ByteStreams.newDataInput(event.getData());
    // handle packet data
}
```

## Case 2: Sending a plugin message to a backend server

This is for when you need to send a plugin message to a backend server.

There are two methods to send a plugin message to the backend, depending on what you need to achieve.

:::caution

On your backend server, only listen for plugin messages if you are sure only a trusted proxy can send them to your server.

Otherwise, a player can pretend to be your proxy, and spoof them.

:::

```d2
style.fill: transparent
direction: right

"Send to backend" {
  player -> Velocity {
    style.stroke: transparent
  }
  Velocity -> backend
}
```


### Using any connected player

This is useful if you just want to communicate something relevant to the entire server,
or otherwise can be derived from its content.

An example use case could be telling the server to shut down.

```java
public boolean sendPluginMessageToBackend(RegisteredServer server, ChannelIdentifier identifier, byte[] data) {
    // On success, returns true
    return server.sendPluginMessage(identifier, data);
}
```

### Using a specific player's connection

This is useful if you want to communicate something about a specific player to their current backend server.
You may want additional checks to ensure it will be handled correctly on the backend the player is on.

An example use case could be telling the backend server to give the player a specific item.

```java
public boolean sendPluginMessageToBackendUsingPlayer(Player player, ChannelIdentifier identifier, byte[] data) {
    Optional<ServerConnection> connection = player.getCurrentServer();
    if (connection.isPresent()) {
        // On success, returns true
        return connection.get().sendPluginMessage(identifier, data);
    }
    return false;
}
```

## Case 3: Receiving a plugin message from a backend server

This is for when you need to receive plugin messages from your backend server.
It will require registering with the [`ChannelRegistrar`](jd:velocity:com.velocitypowered.api.proxy.messages.ChannelRegistrar)
for the event to be fired.

An example use case could be handing a request to transfer the player to another server.

```d2
style.fill: transparent
direction: left

"Forward from backend" {
  backend -> Velocity
  Velocity -> player
}

"Handle from backend" {
  backend -> Velocity
  Velocity -> player {
    style.stroke: transparent
  }
}
```

```java
public static final MinecraftChannelIdentifier IDENTIFIER = MinecraftChannelIdentifier.from("custom:main");

@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
    proxyServer.getChannelRegistrar().register(IDENTIFIER);
}

@Subscribe
public void onPluginMessageFromBackend(PluginMessageEvent event) {
    // Check if the identifier matches first, no matter the source.
    // this allows setting all messages to IDENTIFIER as handled,
    // preventing any client-originating messages from being forwarded.
    if (!IDENTIFIER.equals(event.getIdentifier())) {
        return;
    }

    // mark PluginMessage as handled, indicating that the contents
    // should not be forwarding to their original destination.
    event.setResult(PluginMessageEvent.ForwardResult.handled());

    // Alternatively:

    // mark PluginMessage as forwarded, indicating that the contents
    // should be passed through, as if Velocity is not present.
    //
    // this should be used with extreme caution,
    // as any client can freely send whatever it wants, pretending to be the proxy
    //event.setResult(PluginMessageEvent.ForwardResult.forward());

    // only attempt parsing the data if the source is a backend server
    if (!(event.getSource() instanceof ServerConnection backend)) {
        return;
    }

    ByteArrayDataInput in = ByteStreams.newDataInput(event.getData());
    // handle packet data
}
```

## Case 4: Sending a plugin message to a player

This is for when you need to send a plugin message to a player.

:::tip

This is only really useful for when you are making client-side mods. Otherwise, the player likely will just ignore the message.

:::

```d2
style.fill: transparent
direction: left

"Send to player" {
  backend -> Velocity {
    style.stroke: transparent
  }
  Velocity -> player
}
```

```java
public boolean sendPluginMessageToPlayer(Player player, ChannelIdentifier identifier, byte[] data) {
    // On success, returns true
    return player.sendPluginMessage(identifier, data);
}
```

## BungeeCord channel compatibility

This allows your backend servers to communicate with Velocity
in a way compatible with BungeeCord.

By default, your Velocity server will respond to the `bungeecord:main` channel, if `bungee-plugin-message-channel` is enabled in [the configuration](/velocity/configuration#advanced-section).

:::tip[The "bungeecord" specification]

See [here](/paper/dev/plugin-messaging#plugin-message-types) for a list of all the built-in plugin messages that BungeeCord / Velocity supports.

:::
