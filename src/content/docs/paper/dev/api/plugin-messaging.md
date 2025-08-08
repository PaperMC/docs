---
title: Plugin messaging
description: How to communicate with clients or proxies.
slug: paper/dev/plugin-messaging
---

First introduced in [2012](https://web.archive.org/web/20220711204310/https://dinnerbone.com/blog/2012/01/13/minecraft-plugin-channels-messaging/),
Plugin messaging is a way for plugins to communicate with clients. When your servers are behind a proxy,
it will allow your plugins to communicate with the proxy server.

## BungeeCord channel

The BungeeCord channel is used for communication between your Paper server and a BungeeCord (or a BungeeCord-compatible) proxy.

Originally, the channel supported by the BungeeCord proxy was called `BungeeCord`. In versions 1.13 and above,
the channel was renamed to `bungeecord:main` to create a key structure for plugin messaging channels.

Paper handles this change internally and automatically changes any messages sent on the `BungeeCord` channel
to the `bungeecord:main` channel. This means that your plugins should continue to use the `BungeeCord` channel.

## Sending plugin messages

First, we're going to take a look at your Paper server. Your plugin will need to register that it
will be sending on any given plugin channel. You should to do this alongside your other event listener registrations.

```java title="PluginMessagingSample.java"
public final class PluginMessagingSample extends JavaPlugin {

    @Override
    public void onEnable() {
        getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        // Blah blah blah...
    }

}
```

Now that we're registered, we can send messages on the `BungeeCord` channel.

Plugin messages are formatted as byte arrays and can be sent using the [`sendPluginMessage`](jd:paper:org.bukkit.plugin.messaging.PluginMessageRecipient#sendPluginMessage(org.bukkit.plugin.Plugin,java.lang.String,byte[]))
method on a [`Player`](jd:paper:org.bukkit.entity.Player) object.
Let's take a look at an example of sending a plugin message to the `BungeeCord` channel to send our player to another server.

```java title="PluginMessagingSample.java"
public final class PluginMessagingSample extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(this, this);
        getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
    }

    @EventHandler
    public void onPlayerJump(PlayerJumpEvent event) {
        Player player = event.getPlayer();

        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("Connect");
        out.writeUTF("hub2");
        player.sendPluginMessage(this, "BungeeCord", out.toByteArray());
    }

}
```

:::tip

These channels rely on the Minecraft protocol, and are sent as a special type of packet called a
[Plugin Message](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Plugin_channels). They piggyback on player connections, so if there is no
player connected to the server, it will not be able to send or receive plugin messages.

:::

### What did we just do?

We sent a plugin message on the `BungeeCord` channel! The message we sent was a byte array that contained two strings converted to bytes: `Connect` and `hub2`.

Our proxy server received the message through the player who triggered the [`PlayerJumpEvent`](jd:paper:com.destroystokyo.paper.event.player.PlayerJumpEvent) on our Java server.
Then, it recognized the channel as its own and, in alignment with BungeeCord's protocol, sent our player to the `hub2` server.

For BungeeCord, we can think of this message as a case-sensitive command with arguments.
Here, our command is `Connect` and our only argument is `hub2`, but some "commands" may have multiple arguments.
For other channels introduced by client side mods, refer to their documentation to best understand how to format your messages.

### Plugin message types

Although we sent a `Connect` message to the proxy, there are a few other cases that BungeeCord-compatible proxies will act on.
These are the following:

| Message Type      | Description                                            | Arguments                                                        | Response                                          |
|:------------------|:-------------------------------------------------------|:-----------------------------------------------------------------|:--------------------------------------------------|
| `Connect`         | Connects the player to the specified server.           | `server name`                                                    | N/A                                               |
| `ConnectOther`    | Connects another player to the specified server.       | `player name`, `server name`                                     | N/A                                               |
| `IP`              | Returns the IP of the player.                          | N/A                                                              | `IP`, `port`                                      |
| `IPOther`         | Returns the IP of the specified player.                | `player name`                                                    | `player name`, `IP`, `port`                       |
| `PlayerCount`     | Returns the number of players on the specified server. | `server name`                                                    | `server name`, `player count`                     |
| `PlayerList`      | Returns a list of players on the specified server.     | `server name`                                                    | `server name`, `CSV player names`                 |
| `GetServers`      | Returns a list of all servers.                         | N/A                                                              | `CSV server names`                                |
| `Message`         | Sends a message to the specified player.               | `player name`, `message`                                         | N/A                                               |
| `MessageRaw`      | Sends a raw chat component to the specified player.    | `player name`, `JSON chat component`                             | N/A                                               |
| `GetServer`       | Returns the server the player is connected to.         | N/A                                                              | `server name`                                     |
| `GetPlayerServer` | Returns the server name of the specified player.       | `player name`                                                    | `player name`, `server name`                      |
| `UUID`            | Returns the UUID of the player.                        | N/A                                                              | `UUID`                                            |
| `UUIDOther`       | Returns the UUID of the specified player.              | `player name`                                                    | `player name`, `UUID`                             |
| `ServerIp`        | Returns the IP of the specified server.                | `server name`                                                    | `server name`, `IP`, `port`                       |
| `KickPlayer`      | Kicks the specified player.                            | `player name`, `reason`                                          | N/A                                               |
| `KickPlayerRaw`   | Kicks the specified player.                            | `player name`, `JSON chat component`                             | N/A                                               |
| `Forward`         | Forwards a plugin message to another server.           | `server`, `subchannel`, `size of plugin message`, `message`      | `subchannel`, `size of plugin message`, `message` |
| `ForwardToPlayer` | Forwards a plugin message to another player.           | `player name`, `subchannel`, `size of plugin message`, `message` | `subchannel`, `size of plugin message`, `message` |

#### `PlayerCount`

```java title="MyPlugin.java"
public class MyPlugin extends JavaPlugin implements PluginMessageListener {

    @Override
    public void onEnable() {
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        this.getServer().getMessenger().registerIncomingPluginChannel(this, "BungeeCord", this);

        Player player = ...;
        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("PlayerCount");
        out.writeUTF("lobby");
        player.sendPluginMessage(this, "BungeeCord", out.toByteArray());
        // The response will be handled in onPluginMessageReceived
    }

    @Override
    public void onPluginMessageReceived(String channel, Player player, byte[] message) {
        if (!channel.equals("BungeeCord")) {
            return;
        }
        ByteArrayDataInput in = ByteStreams.newDataInput(message);
        String subchannel = in.readUTF();
        if (subchannel.equals("PlayerCount")) {
            // This is our response to the PlayerCount request
            String server = in.readUTF();
            int playerCount = in.readInt();
        }
    }
}
```

#### `Forward`

```java title="MyPlugin.java"
public class MyPlugin extends JavaPlugin implements PluginMessageListener {

    @Override
    public void onEnable() {
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        this.getServer().getMessenger().registerIncomingPluginChannel(this, "BungeeCord", this);

        Player player = ...;
        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("Forward");
        out.writeUTF("ALL"); // This is the target server. "ALL" will message all servers apart from the one sending the message
        out.writeUTF("SecretInternalChannel"); // This is the channel.

        ByteArrayOutputStream msgbytes = new ByteArrayOutputStream();
        DataOutputStream msgout = new DataOutputStream(msgbytes);
        msgout.writeUTF("Paper is the meaning of life"); // You can do anything you want with msgout
        msgout.writeShort(42); // Writing a random short

        out.writeShort(msgbytes.toByteArray().length); // This is the length.
        out.write(msgbytes.toByteArray()); // This is the message.

        player.sendPluginMessage(this, "BungeeCord", out.toByteArray());
        // The response will be handled in onPluginMessageReceived
    }

    @Override
    public void onPluginMessageReceived(String channel, Player player, byte[] message) {
        if (!channel.equals("BungeeCord")) {
            return;
        }
        ByteArrayDataInput in = ByteStreams.newDataInput(message);
        String subchannel = in.readUTF();
        if (subchannel.equals("SecretInternalChannel")) {
            short len = in.readShort();
            byte[] msgbytes = new byte[len];
            in.readFully(msgbytes);

            DataInputStream msgIn = new DataInputStream(new ByteArrayInputStream(msgbytes));
            String secretMessage = msgIn.readUTF(); // Read the data in the same way you wrote it
            short meaningofLife = msgIn.readShort();
        }
    }
}
```

This message is used to forward a plugin message to another server. This is useful for server-to-server communication within a proxy network.
For example, if a certain player is banned on one server, you can forward a message to all other servers to ban them there too.

:::caution[Example of banning a player on all servers]

This is not a recommended way to ban players, because there may not be anyone online on the target servers,
but it is an example of how this can be used.

:::

#### `MessageRaw`

The `MessageRaw` message type is used to send a raw chat component to a player. The target player is specified
by the second parameter - Player name or "ALL" for all players. This is also useful for sending messages to
players who are on a different server within the proxied network.

```java title="MyPlugin.java"
public class MyPlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");

        Player player = ...;
        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("MessageRaw");
        out.writeUTF("ALL");
        out.writeUTF(GsonComponentSerializer.gson().serialize(
                Component.text("Click Me!").clickEvent(ClickEvent.openUrl("https://papermc.io"))
        ));
        player.sendPluginMessage(this, "BungeeCord", out.toByteArray());
    }
}
```

This will send the player a clickable message saying "Click Me!" that opens `https://papermc.io` upon clicking.
