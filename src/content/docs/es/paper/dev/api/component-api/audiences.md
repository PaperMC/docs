---
title: Audiencias
description: Cómo utilizar las audiencias de Adventure.
slug: es/paper/dev/component-api/audiences
---
Las audiencias envuelven una colección de destinatarios que pueden recibir mensajes. Se pueden utilizar para enviar mensajes a jugadores individuales, grupos de jugadores o incluso a todo el servidor (incluida la consola).

## ¿Quién es un `Audience`?

Todos los `CommandSender` son audiencias únicas. Esto incluye jugadores, la consola y los bloques de comando. `Server`, `Team` y `World` son audiencias de reenvío. Esto significa que están compuestos por múltiples audiencias. Por ejemplo, el servidor está formado por todos los jugadores online y la consola.

Esto significa que todos los métodos [](jd:adventure:net.kyori.adventure.audience.Audience) están disponibles en [](jd:paper:org.bukkit.command.CommandSender), [](jd:paper:org.bukkit.Server), [](jd:paper:org.bukkit.scoreboard.Team) y [](jd:paper:org.bukkit.World).

## `ForwardingAudience`

El [](jd:adventure:net.kyori.adventure.audience.ForwardingAudience) envuelve una colección de [](jd:adventure:net.kyori.adventure.audience.Audience) instancias y reenvía mensajes a todas ellas. Esto es útil para enviar mensajes a múltiples audiencias (jugadores) a la vez.
```java
// Server es un ForwardingAudience que incluye a todos los jugadores conectados y a la consola.
ForwardingAudience audience = Bukkit.getServer();

// Para crear una audiencia a partir de una colección de jugadores, usa:
Audience audience = Audience.audience(Audience...);
// Si pasas una sola Audience, se devolverá tal cual. Si pasas una colección de Audience, se
// envolverá en un ForwardingAudience.
```
## ¿Qué hacen los `Audience`?

Las audiencias se utilizan para interactuar con los jugadores. Se pueden utilizar para enviar mensajes, reproducir sonidos, mostrar barras de jefe y más. Se utilizan principalmente para enviar otras partes de la API a los jugadores. Por ejemplo, puedes enviar un [](jd:adventure:net.kyori.adventure.text.Component) a un jugador usando [](jd:adventure:net.kyori.adventure.audience.Audience#sendMessage(net.kyori.adventure.text.Component)).

## Consejos

Las audiencias también pueden proporcionar información arbitraria, como el nombre para mostrar o el UUID. Esto se hace utilizando el sistema de puntero.
```java
// Obtén el UUID de un miembro de la audiencia, si está disponible.
Optional<UUID> uuid = audience.get(Identity.UUID);

// Obtén el nombre para mostrar o, si no está disponible, devuelve un valor predeterminado.
Component name = audience.getOrDefault(Identity.DISPLAY_NAME, Component.text("<sin nombre para mostrar>"));
```
