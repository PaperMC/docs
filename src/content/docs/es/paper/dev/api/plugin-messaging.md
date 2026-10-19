---
title: Mensajes de plugin
description: Cómo enviar mensajes de plugin a clientes y proxies.
slug: es/paper/dev/plugin-messaging
---
La mensajería de plugins se introdujo en [2012](https://web.archive.org/web/20220711204310/https://dinnerbone.com/blog/2012/01/13/minecraft-plugin-channels-messaging/). Permite que los plugins se comuniquen con los clientes y, si el servidor está detrás de un proxy, también con este.

## Canal BungeeCord

El canal BungeeCord permite la comunicación entre un servidor Paper y un proxy BungeeCord o compatible con BungeeCord.

El canal del proxy BungeeCord se llamaba originalmente `BungeeCord`. A partir de Minecraft 1.13, pasó a llamarse `bungeecord:main` para ajustarse al formato de identificadores de los canales de mensajes de plugins.

Paper adapta este cambio internamente y convierte al canal `bungeecord:main` los mensajes enviados mediante `BungeeCord`. Por eso, tus plugins deben seguir usando el canal `BungeeCord`.

## Enviar mensajes de plugin

Primero, registra en el servidor Paper los canales por los que el plugin enviará o recibirá mensajes. Hazlo junto con el resto de registros de listeners de eventos.
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        // Bla, bla, bla...
    }

}
```
Una vez registrado el canal, puedes enviar mensajes por `BungeeCord`.

Los mensajes de plugin son matrices de bytes. Para enviarlos, usa [`sendPluginMessage`](jd:paper:org.bukkit.plugin.messaging.PluginMessageRecipient#sendPluginMessage(org.bukkit.plugin.Plugin,java.lang.String,byte[])) en un objeto [](jd:paper:org.bukkit.entity.Player). En este ejemplo, el mensaje enviado por el canal `BungeeCord` conecta al jugador con otro servidor.
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        this.getServer().getPluginManager().registerEvents(this, this);
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
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
Estos canales forman parte del protocolo de Minecraft y se envían en un tipo especial de paquete llamado [mensaje de plugin](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Plugin_channels). Los mensajes usan la conexión del jugador; por tanto, si no hay jugadores conectados al servidor, no se pueden enviar ni recibir.
:::
### ¿Qué acabamos de hacer?

El mensaje enviado por el canal `BungeeCord` es una matriz de bytes con dos cadenas: `Connect` y `hub2`.

El jugador activó [](jd:paper:com.destroystokyo.paper.event.player.PlayerJumpEvent) en el servidor Paper y, a través de su conexión, el proxy recibió el mensaje. Al reconocer el canal, el proxy siguió el protocolo de BungeeCord y conectó al jugador con `hub2`.

En BungeeCord, el mensaje funciona como un comando con argumentos y distingue entre mayúsculas y minúsculas. En este caso, `Connect` es el comando y `hub2`, su único argumento; otros comandos pueden tener varios. Para conocer los canales que introducen los mods del cliente, consulta su documentación y el formato de sus mensajes.

### Tipos de mensajes de plugin

Aunque enviamos un mensaje `Connect` al proxy, hay algunos otros casos en los que actuarán los servidores proxy compatibles con BungeeCord. Estos son los siguientes:

| Tipo de mensaje | Descripción | Argumentos | Respuesta |
|:------------------|:--------------------------------------------------------------|:-----------------------------------------------------------------|:--------------------------------------------------|
| `Connect` | Conecta al jugador con el servidor indicado. | `server name` | N/A |
| `ConnectOther` | Conecta a otro jugador con el servidor indicado. | `player name`, `server name` | N/A |
| `IP` | Devuelve la dirección IP del jugador. | N/A | `IP`, `port` |
| `IPOther` | Devuelve la dirección IP del jugador indicado. | `player name` | `player name`, `IP`, `port` |
| `PlayerCount` | Devuelve el número de jugadores del servidor indicado. | `server name` | `server name`, `player count` |
| `PlayerList` | Devuelve la lista de jugadores del servidor indicado. | `server name` | `server name`, `CSV player names` |
| `GetServers` | Devuelve la lista de servidores. | N/A | `CSV server names` |
| `Message` | Envía un mensaje al jugador indicado. | `player name`, `message` | N/A |
| `MessageRaw` | Envía un componente de chat sin formato al jugador indicado. | `player name`, `JSON chat component` | N/A |
| `GetServer` | Devuelve el servidor al que está conectado el jugador. | N/A | `server name` |
| `GetPlayerServer` | Devuelve el servidor al que está conectado el jugador indicado. | `player name` | `player name`, `server name` |
| `UUID` | Devuelve el UUID del jugador. | N/A | `UUID` |
| `UUIDOther` | Devuelve el UUID del jugador indicado. | `player name` | `player name`, `UUID` |
| `ServerIp` | Devuelve la dirección IP del servidor indicado. | `server name` | `server name`, `IP`, `port` |
| `KickPlayer` | Expulsa al jugador indicado. | `player name`, `reason` | N/A |
| `KickPlayerRaw` | Expulsa al jugador indicado. | `player name`, `JSON chat component` | N/A |
| `Forward` | Reenvía un mensaje de complemento a otro servidor.           | `server`, `subchannel`, `size of plugin message`, `message` | `subchannel`, `size of plugin message`, `message` |
| `ForwardToPlayer` | Reenvía un mensaje de complemento a otro jugador.           | `player name`, `subchannel`, `size of plugin message`, `message` | `subchannel`, `size of plugin message`, `message` |

#### `PlayerCount`
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin implements PluginMessageListener {

    @Override
    public void onEnable() {
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        this.getServer().getMessenger().registerIncomingPluginChannel(this, "BungeeCord", this);

        Player player = ...;
        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("PlayerCount");
        out.writeUTF("lobby");
        player.sendPluginMessage(this, "BungeeCord", out.toByteArray());
        // La respuesta se procesará en onPluginMessageReceived.
    }

    @Override
    public void onPluginMessageReceived(String channel, Player player, byte[] message) {
        if (!channel.equals("BungeeCord")) {
            return;
        }
        ByteArrayDataInput in = ByteStreams.newDataInput(message);
        String subchannel = in.readUTF();
        if (subchannel.equals("PlayerCount")) {
            // Esta es la respuesta a la solicitud PlayerCount.
            String server = in.readUTF();
            int playerCount = in.readInt();
        }
    }
}
```
#### `Forward`
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin implements PluginMessageListener {

    @Override
    public void onEnable() {
        this.getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
        this.getServer().getMessenger().registerIncomingPluginChannel(this, "BungeeCord", this);

        Player player = ...;
        ByteArrayDataOutput out = ByteStreams.newDataOutput();
        out.writeUTF("Forward");
        out.writeUTF("ALL"); // Este es el servidor de destino. "ALL" enviará el mensaje a todos los servidores salvo al que lo envía.
        out.writeUTF("SecretInternalChannel"); // Este es el canal.

        ByteArrayOutputStream msgBytes = new ByteArrayOutputStream();
        DataOutputStream msgout = new DataOutputStream(msgBytes);
        msgout.writeUTF("Paper is the meaning of life"); // Puedes hacer lo que quieras con msgout
        msgout.writeShort(42); // Writing a random short

        out.writeShort(msgBytes.toByteArray().length); // Esta es la longitud.
        out.write(msgBytes.toByteArray()); // Este es el mensaje.

        player.sendPluginMessage(this, "BungeeCord", out.toByteArray());
        // La respuesta se procesará en onPluginMessageReceived.
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
            byte[] msgBytes = new byte[len];
            in.readFully(msgBytes);

            DataInputStream msgIn = new DataInputStream(new ByteArrayInputStream(msgBytes));
            String secretMessage = msgIn.readUTF(); // Lee los datos del mismo modo en que los escribiste
            short meaningOfLife = msgIn.readShort();
        }
    }
}
```
Este mensaje se utiliza para reenviar un mensaje de complemento a otro servidor. Esto es útil para la comunicación de servidor a servidor dentro de una red proxy. Por ejemplo, si un determinado jugador está baneado en un servidor, puedes reenviar un mensaje a todos los demás servidores para banearlo allí también.
:::caution[Ejemplo de banear a un jugador en todos los servidores]
Esta no es una forma recomendada de prohibir jugadores, porque puede que no haya nadie conectado en los servidores de destino, pero es un ejemplo de cómo se puede utilizar.
:::
#### `MessageRaw`

El tipo de mensaje `MessageRaw` se utiliza para enviar un componente de chat sin formato a un jugador. El jugador objetivo se especifica mediante el segundo parámetro: Nombre del jugador o "TODOS" para todos los jugadores. Esto también es útil para enviar mensajes a jugadores que se encuentran en un servidor diferente dentro de la red proxy.
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

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
Esto enviará al jugador un mensaje en el que se puede hacer clic que dice "¡Haz clic en mí!" que abre `https://papermc.io` al hacer clic.
