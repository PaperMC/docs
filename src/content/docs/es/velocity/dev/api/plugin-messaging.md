---
title: Mensajería de plugins
description: Cómo gestionar y enviar mensajes de plugins en Velocity.
slug: es/velocity/dev/plugin-messaging
---

Introducida en [2012](https://web.archive.org/web/20220711204310/https://dinnerbone.com/blog/2012/01/13/minecraft-plugin-channels-messaging/),
la mensajería de plugins permite que los plugins de Velocity se comuniquen con los clientes y los servidores backend.

Velocity gestiona conexiones en ambas direcciones, tanto con el cliente como con el servidor backend.
Esto significa que los plugins de Velocity deben contemplar cuatro casos principales:

```d2
style.fill: transparent
direction: right

"Jugador" -> Velocity: "1 (Entrante)"
Velocity -> "Servidor backend": "2 (Saliente)"
"Servidor backend" -> Velocity: "3 (Entrante)"
Velocity -> "Jugador": "4 (Saliente)"
```

:::caution

Al escuchar `PluginMessageEvent`, asegúrate de que el resultado sea
[`ForwardResult.handled()`](jd:velocity:com.velocitypowered.api.event.connection.PluginMessageEvent$ForwardResult#handled())
si no quieres que participe el cliente.

Si se reenvía el resultado, los jugadores pueden suplantar el proxy ante tus servidores backend.

Además, asegúrate de establecer correctamente el resultado después de gestionar los mensajes válidos para evitar que se filtren a la otra parte.

Esto se puede lograr estableciendo el resultado de forma incondicional entre la comprobación del identificador y la del origen, como se muestra en los ejemplos.

:::

Además, se incluye compatibilidad con el canal de BungeeCord, lo que en algunos casos puede eliminar la necesidad de un plugin complementario para Velocity.

## Caso 1: Recibir un mensaje de plugin de un jugador

Este caso se aplica cuando necesitas gestionar o inspeccionar el contenido de un mensaje de plugin enviado por un jugador.
Debes registrarte en ChannelRegistrar para que se dispare el evento.

Un ejemplo de uso sería registrar mensajes de un mod que informa de las funciones habilitadas.

```d2
style.fill: transparent
direction: right

"Reenviar desde el jugador" {
  "Jugador" -> Velocity
  Velocity -> "Servidor backend"
}

"Gestionar el mensaje del jugador" {
  "Jugador" -> Velocity
  Velocity -> "Servidor backend" {
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
  // Comprueba primero si coincide el identificador, sin importar el origen.
  if (!IDENTIFIER.equals(event.getIdentifier())) {
    return;
  }

  // Marca el mensaje de plugin como gestionado para indicar que su contenido
  // no debe reenviarse a su destino original.
  event.setResult(PluginMessageEvent.ForwardResult.handled());

  // Como alternativa:

  // Marca el mensaje de plugin como reenviado para indicar que su contenido
  // debe pasar sin cambios, como si Velocity no estuviera presente.
  //event.setResult(PluginMessageEvent.ForwardResult.forward());

  // Intenta analizar los datos solo si el origen es un jugador.
  if (!(event.getSource() instanceof Player player)) {
    return;
  }

  ByteArrayDataInput in = ByteStreams.newDataInput(event.getData());
  // Gestiona los datos del paquete.
}
```

## Caso 2: Enviar un mensaje de plugin a un servidor backend

Este caso se aplica cuando necesitas enviar un mensaje de plugin a un servidor backend.

Hay dos métodos para enviar un mensaje de plugin al backend, según lo que necesites conseguir.

:::caution

En el servidor backend, escucha mensajes de plugins solo si tienes la certeza de que únicamente un proxy confiable puede enviarlos.

De lo contrario, un jugador podría hacerse pasar por tu proxy y falsificarlos.

:::

```d2
style.fill: transparent
direction: right

"Enviar al servidor backend" {
  "Jugador" -> Velocity {
    style.stroke: transparent
  }
  Velocity -> "Servidor backend"
}
```


### Usar cualquier jugador conectado

Esto resulta útil si quieres comunicar algo relevante a todo el servidor
o si el mensaje puede derivarse de su contenido.

Un ejemplo de uso sería indicarle al servidor que se apague.

```java
public boolean sendPluginMessageToBackend(RegisteredServer server, ChannelIdentifier identifier, byte[] data) {
  // Devuelve true si la operación se realiza correctamente.
  return server.sendPluginMessage(identifier, data);
}
```

### Usar la conexión de un jugador específico

Esto resulta útil si quieres comunicar algo sobre un jugador específico a su servidor backend actual.
Quizá quieras añadir comprobaciones para asegurarte de que el backend al que está conectado el jugador gestione el mensaje correctamente.

Un ejemplo de uso sería pedirle al servidor backend que le entregue un objeto específico al jugador.

```java
public boolean sendPluginMessageToBackendUsingPlayer(Player player, ChannelIdentifier identifier, byte[] data) {
  Optional<ServerConnection> connection = player.getCurrentServer();
  if (connection.isPresent()) {
    // Devuelve true si la operación se realiza correctamente.
    return connection.get().sendPluginMessage(identifier, data);
  }
  return false;
}
```

## Caso 3: Recibir un mensaje de plugin de un servidor backend

Este caso se aplica cuando necesitas recibir mensajes de plugins de tu servidor backend.
Debes registrarte en [](jd:velocity:com.velocitypowered.api.proxy.messages.ChannelRegistrar)
para que se dispare el evento.

Un ejemplo de uso sería procesar una solicitud para trasladar al jugador a otro servidor.

```d2
style.fill: transparent
direction: left

"Reenviar desde el servidor backend" {
  "Servidor backend" -> Velocity
  Velocity -> "Jugador"
}

"Gestionar el mensaje del servidor backend" {
  "Servidor backend" -> Velocity
  Velocity -> "Jugador" {
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
  // Comprueba primero si coincide el identificador, sin importar el origen.
  // Así se pueden marcar como gestionados todos los mensajes con IDENTIFIER
  // e impedir que se reenvíen los mensajes enviados por clientes.
  if (!IDENTIFIER.equals(event.getIdentifier())) {
    return;
  }

  // Marca el mensaje de plugin como gestionado para indicar que su contenido
  // no debe reenviarse a su destino original.
  event.setResult(PluginMessageEvent.ForwardResult.handled());

  // Como alternativa:

  // Marca el mensaje de plugin como reenviado para indicar que su contenido
  // debe pasar sin cambios, como si Velocity no estuviera presente.
  //
  // Usa esta opción con muchísima cautela: cualquier cliente puede enviar lo que quiera
  // y hacerse pasar por el proxy.
  //event.setResult(PluginMessageEvent.ForwardResult.forward());

  // Intenta analizar los datos solo si el origen es un servidor backend.
  if (!(event.getSource() instanceof ServerConnection backend)) {
    return;
  }

  ByteArrayDataInput in = ByteStreams.newDataInput(event.getData());
  // Gestiona los datos del paquete.
}
```

## Caso 4: Enviar un mensaje de plugin a un jugador

Este caso se aplica cuando necesitas enviar un mensaje de plugin a un jugador.

:::tip

Esto solo resulta útil si estás creando mods del lado del cliente. De lo contrario, es probable que el jugador simplemente ignore el mensaje.

:::

```d2
style.fill: transparent
direction: left

"Enviar al jugador" {
  "Servidor backend" -> Velocity {
    style.stroke: transparent
  }
  Velocity -> "Jugador"
}
```

```java
public boolean sendPluginMessageToPlayer(Player player, ChannelIdentifier identifier, byte[] data) {
  // Devuelve true si la operación se realiza correctamente.
  return player.sendPluginMessage(identifier, data);
}
```

## Compatibilidad con el canal de BungeeCord

Esto permite que tus servidores backend se comuniquen con Velocity
de forma compatible con BungeeCord.

De forma predeterminada, el servidor Velocity responderá al canal `bungeecord:main` si `bungee-plugin-message-channel` está habilitado en [la configuración](/es/velocity/configuration#sección-advanced).

:::tip[La especificación «bungeecord»]

Consulta [la lista de mensajes de plugin integrados](/es/paper/dev/plugin-messaging#plugin-message-types) que admiten BungeeCord y Velocity.

:::
