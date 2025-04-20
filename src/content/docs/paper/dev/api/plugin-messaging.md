---
title: Plugin Messaging
description: A comprehensive guide to plugin messaging in Paper, including BungeeCord communication, security considerations, and best practices.
slug: paper/dev/plugin-messaging
---

Plugin messaging is a powerful feature that allows communication between:
- Servers and clients
- Servers and proxy servers (BungeeCord/Waterfall)
- Servers within a proxy network

:::note[History]
First introduced in [2012](https://web.archive.org/web/20220711204310/https://dinnerbone.com/blog/2012/01/13/minecraft-plugin-channels-messaging/),
plugin messaging has become a standard way for plugins to communicate across the Minecraft ecosystem.
:::

## Channel Overview

### BungeeCord Channel

The BungeeCord channel is the primary method for communication between Paper servers and BungeeCord (or compatible) proxies.

#### Channel Names
- Original: `BungeeCord`
- Modern (1.13+): `bungeecord:main`

:::tip[Compatibility]
Paper automatically handles the channel name change internally. Your plugins should continue using the `BungeeCord` channel for maximum compatibility.
:::

## Implementation Guide

### Channel Registration

Before sending or receiving messages, you must register your plugin's channels:

```java title="PluginMessagingSample.java"
public final class PluginMessagingSample extends JavaPlugin {

    @Override
    public void onEnable() {
        // Register outgoing channel for sending messages
        getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        
        // Register incoming channel for receiving messages
        getServer().getMessenger().registerIncomingPluginChannel(this, "BungeeCord", this);
    }

    @Override
    public void onDisable() {
        // Always unregister channels when your plugin disables
        getServer().getMessenger().unregisterOutgoingPluginChannel(this);
        getServer().getMessenger().unregisterIncomingPluginChannel(this);
    }
}
```

### Sending Messages

Plugin messages are sent as byte arrays using the `sendPluginMessage` method:

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

:::tip[Protocol Details]
Plugin messages are sent as special packets called [Plugin Messages](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Plugin_channels).
They require an active player connection to function.
:::

## Message Types and Protocols

### BungeeCord Message Types

| Message Type      | Description                                            | Arguments                                                        | Response                                          | Security Level |
|:------------------|:-------------------------------------------------------|:-----------------------------------------------------------------|:--------------------------------------------------|:---------------|
| `Connect`         | Connects player to specified server                    | `server name`                                                    | N/A                                               | Low            |
| `ConnectOther`    | Connects another player to server                      | `player name`, `server name`                                     | N/A                                               | High           |
| `IP`              | Returns player's IP                                    | N/A                                                              | `IP`, `port`                                      | Medium         |
| `IPOther`         | Returns specified player's IP                          | `player name`                                                    | `player name`, `IP`, `port`                       | High           |
| `PlayerCount`     | Returns server player count                            | `server name`                                                    | `server name`, `player count`                     | Low            |
| `PlayerList`      | Returns server player list                             | `server name`                                                    | `server name`, `CSV player names`                 | Low            |
| `GetServers`      | Returns all servers list                               | N/A                                                              | `CSV server names`                                | Low            |
| `Message`         | Sends message to player                                | `player name`, `message`                                         | N/A                                               | Medium         |
| `MessageRaw`      | Sends raw chat component to player                     | `player name`, `JSON chat component`                             | N/A                                               | Medium         |
| `GetServer`       | Returns current server name                            | N/A                                                              | `server name`                                     | Low            |
| `GetPlayerServer` | Returns player's current server                        | `player name`                                                    | `player name`, `server name`                      | Medium         |
| `UUID`            | Returns player's UUID                                  | N/A                                                              | `UUID`                                            | Low            |
| `UUIDOther`       | Returns specified player's UUID                        | `player name`                                                    | `player name`, `UUID`                             | Medium         |
| `ServerIp`        | Returns server's IP                                    | `server name`                                                    | `server name`, `IP`, `port`                       | Medium         |
| `KickPlayer`      | Kicks specified player                                 | `player name`, `reason`                                          | N/A                                               | High           |
| `KickPlayerRaw`   | Kicks player with JSON message                         | `player name`, `JSON chat component`                             | N/A                                               | High           |
| `Forward`         | Forwards message to server                             | `server`, `subchannel`, `size`, `message`                        | `subchannel`, `size`, `message`                   | High           |
| `ForwardToPlayer` | Forwards message to player                             | `player name`, `subchannel`, `size`, `message`                   | `subchannel`, `size`, `message`                   | High           |

### Implementation Examples

#### Player Count Request

```java title="MyPlugin.java"
public class MyPlugin extends JavaPlugin implements PluginMessageListener {

    @Override
    public void onEnable() {
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        this.getServer().getMessenger().registerIncomingPluginChannel(this, "BungeeCord", this);
    }

    public void requestPlayerCount(Player player, String serverName) {
        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("PlayerCount");
        out.writeUTF(serverName);
        player.sendPluginMessage(this, "BungeeCord", out.toByteArray());
    }

    @Override
    public void onPluginMessageReceived(String channel, Player player, byte[] message) {
        if (!channel.equals("BungeeCord")) {
            return;
        }
        
        ByteArrayDataInput in = ByteStreams.newDataInput(message);
        String subchannel = in.readUTF();
        
        if (subchannel.equals("PlayerCount")) {
            String server = in.readUTF();
            int playerCount = in.readInt();
            // Handle player count response
        }
    }
}
```

#### Server-to-Server Communication

```java title="MyPlugin.java"
public class MyPlugin extends JavaPlugin implements PluginMessageListener {

    @Override
    public void onEnable() {
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        this.getServer().getMessenger().registerIncomingPluginChannel(this, "BungeeCord", this);
    }

    public void forwardMessage(Player player, String targetServer, String subchannel, byte[] data) {
        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("Forward");
        out.writeUTF(targetServer);
        out.writeUTF(subchannel);
        out.writeShort(data.length);
        out.write(data);
        player.sendPluginMessage(this, "BungeeCord", out.toByteArray());
    }

    @Override
    public void onPluginMessageReceived(String channel, Player player, byte[] message) {
        if (!channel.equals("BungeeCord")) {
            return;
        }
        
        ByteArrayDataInput in = ByteStreams.newDataInput(message);
        String subchannel = in.readUTF();
        
        if (subchannel.equals("MyCustomChannel")) {
            short len = in.readShort();
            byte[] msgbytes = new byte[len];
            in.readFully(msgbytes);
            // Handle forwarded message
        }
    }
}
```

## Best Practices

### Security Considerations

1. **Channel Registration**
   - Register only necessary channels
   - Unregister channels on plugin disable
   - Validate channel names

2. **Message Handling**
   - Validate message sources
   - Sanitize input data
   - Implement rate limiting
   - Use secure channels for sensitive data

3. **Error Handling**
   - Handle connection failures
   - Implement timeouts
   - Log error conditions
   - Graceful degradation

### Performance Optimization

1. **Message Size**
   - Minimize message payload
   - Compress large messages
   - Batch related messages

2. **Connection Management**
   - Reuse player connections
   - Implement connection pooling
   - Monitor connection health

3. **Resource Management**
   - Clean up resources
   - Implement proper error handling
   - Monitor memory usage

### Common Patterns

#### Message Validation

```java
private boolean isValidMessage(String channel, byte[] message) {
    if (message == null || message.length == 0) {
        return false;
    }
    
    try {
        ByteArrayDataInput in = ByteStreams.newDataInput(message);
        String subchannel = in.readUTF();
        return isValidSubchannel(subchannel);
    } catch (Exception e) {
        return false;
    }
}
```

#### Rate Limiting

```java
private final Map<UUID, Long> lastMessageTime = new HashMap<>();
private static final long MESSAGE_COOLDOWN = 1000; // 1 second

private boolean canSendMessage(Player player) {
    long now = System.currentTimeMillis();
    Long lastTime = lastMessageTime.get(player.getUniqueId());
    
    if (lastTime != null && (now - lastTime) < MESSAGE_COOLDOWN) {
        return false;
    }
    
    lastMessageTime.put(player.getUniqueId(), now);
    return true;
}
```

## Debugging Tips

1. **Message Tracing**
   - Log outgoing messages
   - Log incoming messages
   - Monitor message flow

2. **Common Issues**
   - Channel not registered
   - Invalid message format
   - Connection issues
   - Permission problems

3. **Testing Tools**
   - Use proxy debugging tools
   - Monitor network traffic
   - Test with different players

:::tip[Pro Tips]
- Always validate message data
- Implement proper error handling
- Use secure channels for sensitive data
- Monitor message performance
- Document message protocols
:::

:::caution[Security Warning]
Plugin messaging can be a security risk if not properly implemented. Always:
- Validate all incoming messages
- Sanitize all outgoing messages
- Use secure channels for sensitive data
- Implement proper access controls
:::
