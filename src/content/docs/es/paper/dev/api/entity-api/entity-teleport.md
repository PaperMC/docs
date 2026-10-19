---
title: Teletransportación
description: La API de teletransportación de entidades y cómo usarla.
slug: es/paper/dev/entity-teleport
version: 1.21.10
---
Las entidades se pueden teletransportar instantáneamente a posiciones específicas, de forma sincrónica y asincrónica con la API [`teleport`](jd:paper:org.bukkit.entity.Entity#teleport(org.bukkit.Location)) y [`teleportAsync`](jd:paper:org.bukkit.entity.Entity#teleportAsync(org.bukkit.Location)).
:::tip[Actuación]
Si espera teletransportarse a fragmentos descargados, se recomienda utilizar la API `teleportAsync`, ya que evita realizar cargas de fragmentos sincrónicas, lo que ejerce mucha presión sobre el subproceso principal del servidor, lo que perjudica el rendimiento general.
:::

```java
boolean success = entity.teleport(location); // carga los chunks de forma síncrona y teletransporta la entidad

entity.teleportAsync(location).thenAccept(success -> { // carga los chunks de forma asíncrona y teletransporta la entidad
    // Este código se ejecuta cuando se completa el teletransporte.
    // El Future se completa en el hilo principal, así que aquí puedes usar la API sin problemas.

    if (success) {
        // ¡La entidad se teletransportó correctamente!
    }
});
```

:::danger
**NUNCA** debes llamar a `.get()`/`.join()` en el `teleportAsync` `Future` en el hilo principal, ya que **** bloqueará tu servidor si el fragmento al que te estás teletransportando no está cargado.
:::
## Mira

La API [`lookAt`](jd:paper:org.bukkit.entity.Player#lookAt(org.bukkit.entity.Entity,io.papermc.paper.entity.LookAnchor,io.papermc.paper.entity.LookAnchor)) te permite hacer que un jugador mire una determinada posición o entidad.
```java
player.lookAt(
    position,
    LookAnchor.EYES // los ojos del jugador mirarán hacia la posición
);

player.lookAt(
    entity,
    LookAnchor.EYES // los ojos del jugador mirarán hacia la entidad
    LookAnchor.FEET // el jugador mirará hacia los pies de la entidad
);
```
## Banderas de teletransporte

Las banderas de teletransporte ofrecen una forma de teletransportar entidades y al mismo tiempo pueden personalizar el comportamiento. Esto te permite hacer cosas como teletransportar jugadores usando banderas relativas y poder retener pasajeros.

Todas las banderas de teletransporte disponibles se pueden encontrar en la clase [](jd:paper:io.papermc.paper.entity.TeleportFlag).

### Teletransportación relativa

Teletransporta a un jugador relativamente, evitando que la velocidad se reinicie en los ejes X, Y y Z.
```java
player.teleport(
    location,
    TeleportFlag.Relative.VELOCITY_X,
    TeleportFlag.Relative.VELOCITY_Y,
    TeleportFlag.Relative.VELOCITY_Z
);
```
### Retener pasajeros
:::caution[Advertencia]
Desde 1.21.10, esta bandera no hace nada, ya que se ha convertido en el comportamiento predeterminado al teletransportar entidades.
:::
Teletransporta una entidad con la bandera [`RETAIN_PASSENGERS`](jd:paper:io.papermc.paper.entity.TeleportFlag$EntityState#RETAIN_PASSENGERS), permitiendo que sus pasajeros sean transferidos con la entidad.
```java
entity.teleport(location, TeleportFlag.EntityState.RETAIN_PASSENGERS);
```
