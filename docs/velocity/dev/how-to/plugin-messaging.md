---
slug: /dev/plugin-messaging
---

# Plugin Messaging

Plugin messaging is a way for Paper plugins to communicate with clients, and when your servers are behind a proxy, it will allow your Paper plugins to communicate with the proxy server.

By default, your Velocity server will respond to the `bungeecord:main` channel unless you have disabled `bungee-plugin-message-channel` in the Velocity configuration. Let's take a look at how plugin messaging works, and more importantly - how your Velocity server is already prepared to handle it.

## Sending Plugin Messages

First, we're actually going take a look at your Java server. Your Java server plugin will need to register that it will be sending on any given plugin channel. You'll should to do this alongside your other event listener registrations.

```java
public final class PluginMessagingSample extends JavaPlugin {

    @Override
    public void onEnable() {
        getServer().getMessenger().registerOutgoingPluginChannel(this, "bungeecord:main");
    }

}
```

Now that we're registered, we can send messages on the `bungeecord:main` channel. 

:::tip The "bungeecord" and "bungeecord:main" channel

By now, you may have noticed that we're using `bungeecord:main` instead of `velocity:main`. Many plugins are already setup for use in BungeeCord (or Waterfall) environments (communicating over a channel called `BungeeCord`), and to ease your transition to using Velocity, Velocity will respond on these channels as well. If your plugins are already using BungeeCord plugin messaging, you won't need to change anything!

:::

Plugin messages are formatted as byte arrays, and can be sent using the `sendPluginMessage` method on a `Player` object. Let's take a look at an example of sending a plugin message to the `bungeecord:main` channel to send our player to another server.

```java
public final class PluginMessagingSample extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(this, this);

        getServer().getMessenger().registerOutgoingPluginChannel(this, "bungeecord:main");
    }

    @EventHandler
    public void onPlayerJump(PlayerJumpEvent event) {
        Player player = event.getPlayer();

        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("Connect");
        out.writeUTF("hub2");
        player.sendPluginMessage(this, "bungeecord:main", out.toByteArray());
    }
  
}
```

### What did we just do?

We sent a plugin message on the `bungeecord:main` channel! The message we sent was a byte array that contained two strings converted to bytes: `Connect` and `hub2`. 

Our Velocity proxy received the message through the player who triggered the `PlayerJumpEvent` on our Java server. Then, Velocity recognized the channel as it's own, and in alignment with BungeeCord's format sent our player to `hub2`.

For BungeeCord, we can think of this message as a case sensitive command with arguments. Here, our command is `Connect` and our only argument is `hub2` but some "commands" may have multiple arguments. For other channels introduced by client side mods, refer to their documentation to best understand how to format your messages.

### BungeeCord Plugin Message Types

Although we sent a `Connect` message to the proxy there are a few other cases that Velocity will act on. You can find a list of them in the [BungeeCord documentation](https://www.spigotmc.org/wiki/bukkit-bungee-plugin-messaging-channel/#bungeecord-subchannel-specificationd).
