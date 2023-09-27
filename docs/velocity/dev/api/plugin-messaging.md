---
slug: /dev/plugin-messaging
description: How to handle and send plugin messages on Velocity.
---

# Plugin Messaging

First introduced in [2012](https://web.archive.org/web/20220711204310/https://dinnerbone.com/blog/2012/01/13/minecraft-plugin-channels-messaging/),
Plugin messaging is a way for Velocity plugins to communicate with clients and backend servers. 

## Compatibility with BungeeCord

When your servers are behind a proxy, it will allow your Bukkit plugins to communicate with the proxy server.
By default, your Velocity server will respond to the `bungeecord:main` channel unless you have disabled 
`bungee-plugin-message-channel` in the Velocity configuration. Let's take a look at how plugin messaging works, 
and more importantly, how your Velocity server is already prepared to handle it.

## Sending Plugin Messages

Firstly, our Velocity server will need to register that it will be sending on any given plugin channel. 
You should to do this alongside your other event listener registrations:

```java
@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
    proxyServer.getChannelRegistrar().register(MinecraftChannelIdentifier.from("bungeecord:main"));
}
```

Then, you can send messages on the `bungeecord:main` channel.
Plugin messages are formatted as byte arrays and can be sent using the `sendPluginMessage` method on a `Player` object.

Let's take a look at an example of sending a plugin message to the `bungeecord:main` channel to send our player to another server.

```java
@Subscribe
public void onPlayerChat(PlayerChatEvent event) {
    Player player = event.getPlayer();

    ByteArrayDataOutput out = ByteStreams.newDataOutput();
    out.writeUTF("Connect");
    out.writeUTF("hub2");
    player.sendPluginMessage(MinecraftChannelIdentifier.from("bungeecord:main"), out.toByteArray());
}
```

## Receiving Plugin Messages

Now that we've sent a plugin message, we'll need to receive it on the other end.
This is done by registering a listener for the PluginMessageEvent.

```java
@Subscribe
public void onPluginMessage(PluginMessageEvent event) {
    if (!event.getIdentifier().getId().equals("identifier")) {
        return;
    }

    ByteArrayDataInput in = ByteStreams.newDataInput(event.getData());
    String subChannel = in.readUTF();

    if (subChannel.equals("Connect")) {
        String server = in.readUTF();
        // Do something with the server name
    }
}
```

:::tip[The "bungeecord" specification]

See [here](/paper/dev/plugin-messaging#bungeecord-plugin-message-types) for a list of all the plugin messages that BungeeCord / Velocity supports.

:::
