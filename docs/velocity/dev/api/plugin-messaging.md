---
slug: /dev/plugin-messaging
description: How to handle and send plugin messages on Velocity.
---

# Plugin Messaging

First introduced in [2012](https://web.archive.org/web/20220711204310/https://dinnerbone.com/blog/2012/01/13/minecraft-plugin-channels-messaging/),
Plugin messaging is a way for Velocity plugins to communicate with clients and backend servers. 

Velocity manages connections in both directions, for both the client and backend server.
This means Velocity plugins need to consider 4 main cases:

```mermaid
flowchart LR
    player -->|"1 (Incoming)"| Velocity -->|"2 (Outgoing)"| backend
    backend -->|"3 (Incoming)"| Velocity -->|"4 (Outgoing)"| player
```

Additionally, BungeeCord channel compatibility is included, which may remove the need for a companion Velocity plugin in certain cases.

## Case 1: Receiving a plugin message from a player

This is for when you need to handle or inspect the contents of a plugin message sent by a player. It will require registering with the [ChannelRegistrar](https://jd.papermc.io/velocity/3.0.0/com/velocitypowered/api/proxy/messages/ChannelRegistrar.html) for the event to be fired. 

An example use case could be logging messages from a mod that reports the enabled features.

```java
public static final MinecraftChannelIdentifier IDENTIFIER = MinecraftChannelIdentifier.from("custom:main");

@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
    proxyServer.getChannelRegistrar().register(IDENTIFIER);
}

@Subscribe
public void onPluginMessageFromPlayer(PluginMessageEvent event) {
    if (!(event.getSource() instanceof Player)) {
        return;
    }
    Player player = (Player) event.getSource();
    // Ensure the identifier is what you expect before trying to handle the data
    if (event.getIdentifier() != IDENTIFIER) {
        return;
    }
    
    ByteArrayDataInput in = ByteStreams.newDataInput(event.getData());
    // handle packet data
}
```

## Case 2: Sending a plugin message to a backend server

This is for when you need to send a plugin message to a backend server.

There are two methods to send a plugin message to the backend, depending on what you need to achieve

:::warning

On your backend server, only listen for plugin messages if you are sure only a trusted proxy can send them to your server.

Otherwise, a player can pretend to be your proxy, and spoof them.

:::

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

This is for when you need to receive plugin messages from your backend server. It will require registering with the [ChannelRegistrar](https://jd.papermc.io/velocity/3.0.0/com/velocitypowered/api/proxy/messages/ChannelRegistrar.html) for the event to be fired.

An example use case could be handing a request to transfer the player to another server.

```java
public static final MinecraftChannelIdentifier IDENTIFIER = MinecraftChannelIdentifier.from("custom:main");

@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
    proxyServer.getChannelRegistrar().register(IDENTIFIER);
}

@Subscribe
public void onPluginMessageFromBackend(PluginMessageEvent event) {
    if (!(event.getSource() instanceof ServerConnection)) {
        return;
    }
    ServerConnection backend = (ServerConnection) event.getSource();
    // Ensure the identifier is what you expect before trying to handle the data
    if (event.getIdentifier() != IDENTIFIER) {
        return;
    }

    ByteArrayDataInput in = ByteStreams.newDataInput(event.getData());
    // handle packet data
}
```
## Case 4: Sending a plugin message to a player

This is for when you need to send a plugin message to a player.

An example use case could be instructing a client side mod to disable certain features.

```java
public boolean sendPluginMessageToPlayer(Player player, ChannelIdentifier identifier, byte[] data) {
    // On success, returns true
    return player.sendPluginMessage(identifier, data);
}
```

## BungeeCord Channel Compatability

This allows your backend servers to communicate with Velocity
in a way compatible with BungeeCord

By default, your Velocity server will respond to the `bungeecord:main` channel if `bungee-plugin-message-channel` is enabled in [the configuration](/velocity/configuration#advanced-section).

:::tip[The "bungeecord" specification]

See [here](/paper/dev/plugin-messaging#bungeecord-plugin-message-types) for a list of all the built-in plugin messages that BungeeCord / Velocity supports.

:::
