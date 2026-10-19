---
title: Audiencias
slug: es/adventure/audiences
description: Guía sobre las audiencias de Adventure.
---

En esencia, una audiencia es un grupo de cero o más destinatarios de cierto contenido.
El concepto de audiencia es la diferencia más clara entre Adventure y otras plataformas de Minecraft.

Como API, `Audience` está diseñada como una interfaz universal para cualquier jugador,
emisor de comandos, consola u otro destinatario que pueda recibir texto, títulos, barras de jefe
y otros medios de Minecraft. Esto permite ampliar las audiencias para que incluyan a más de
un destinatario individual: una «audiencia» podría ser un equipo, servidor,
mundo o todos los jugadores que cumplan una condición (por ejemplo, tener cierto
permiso). La interfaz universal también reduce el código repetitivo al degradar
con elegancia las funciones que no sean aplicables. Por ejemplo, no tiene mucho sentido
enviar una barra de jefe a un emisor de comandos, y no se pueden enviar títulos a clientes de Minecraft 1.7.

Normalmente obtendrás instancias de audiencia desde una de las [Plataformas](/es/adventure/platform).
La propia API de Adventure incluye dos implementaciones de audiencia: una que no
admite ninguna acción (y, por tanto, no hace nada), `Audience.empty()`, y otra que
reenvía cada acción a todos los miembros de la audiencia, mediante `Audience.audience()` y métodos relacionados,
junto con `ForwardingAudience`, que implementa por ti la lógica de reenvío.

La mayoría de los usuarios empleará esta API principalmente para mostrar contenido creado por otras partes
de la API.

## Audiencias de reenvío

Una [](jd:adventure:net.kyori.adventure.audience.ForwardingAudience) reenvía a otras audiencias
todas las acciones que recibe. Su único método abstracto es `audiences()`,
así que basta con implementarlo para convertir uno de tus tipos en una audiencia:

```java title=GameTeam.java
public class GameTeam implements ForwardingAudience {
  private final List<GamePlayer> players = new ArrayList<>();

  // ...

  @Override
  public Iterable<? extends Audience> audiences() {
    return this.players;
  }
}
```

Ahora puedes enviar al equipo completo todo lo que se pueda enviar a una audiencia:

```java
final GameTeam team = /* ... */;
team.sendMessage(Component.text("¡La partida empieza en 10 segundos!"));
team.playSound(Sound.sound(Key.key("block.note_block.pling"), Sound.Source.MASTER, 1F, 1F));
```

`audiences()` se llama cada vez que se reenvía una acción, así que los miembros que se añadan
o eliminen de la colección subyacente se tendrán en cuenta automáticamente.

Si no necesitas un tipo propio,
[`Audience.audience(Iterable<? extends Audience>)`](jd:adventure:net.kyori.adventure.audience.Audience#audience(java.lang.Iterable)),
[`Audience.audience(Audience...)`](jd:adventure:net.kyori.adventure.audience.Audience#audience(net.kyori.adventure.audience.Audience...)),
y el colector [`Audience.toAudience()`](jd:adventure:net.kyori.adventure.audience.Audience#toAudience())
pueden crear por ti una `ForwardingAudience`.

Una audiencia de reenvío formada por varios miembros no tiene punteros propios, así que
`get(Identity.UUID)` en el `GameTeam` anterior devolvería un `Optional` vacío.

### Envolver una sola audiencia

Para envolver exactamente una audiencia, implementa en su lugar
[](jd:adventure:net.kyori.adventure.audience.ForwardingAudience$Single). Reenvía tanto los punteros como las acciones:

```java title=GamePlayer.java
public class GamePlayer implements ForwardingAudience.Single {
  private final Audience audience;
  private int score;

  public GamePlayer(final Audience audience) {
    this.audience = audience;
  }

  @Override
  public Audience audience() {
    return this.audience;
  }
}
```

Esto resulta especialmente útil en proyectos compatibles con más de una plataforma. Si el código común
solo trabaja con `GamePlayer`, cada módulo de plataforma puede proporcionar la audiencia de
su propio tipo de jugador. Consulta [Plataformas](/es/adventure/platform) para obtener más información.

### Cambiar qué se reenvía

Muchos métodos de `Audience` son sobrecargas de conveniencia que terminan llamando a un conjunto reducido
de métodos. `sendMessage(ComponentLike)` llama a `sendMessage(Component)` y
`showTitle(Title)` llama a `sendTitlePart` una vez por cada parte del título.
`ForwardingAudience` solo sobrescribe ese conjunto reducido, así que basta con sobrescribir esos métodos
para cambiar el comportamiento de la audiencia:

```java title=GameTeam.java
public class GameTeam implements ForwardingAudience {
  private static final Component PREFIX = Component.text("[Team] ");

  // ...

  @Override
  public void sendMessage(final Component message) {
    // También se aplica a sendMessage(ComponentLike)
    ForwardingAudience.super.sendMessage(PREFIX.append(message));
  }
}
```

## Punteros

Las audiencias también pueden proporcionar información arbitraria, como el nombre visible o el UUID.
Esto se hace mediante el sistema de punteros.

Ejemplos:

```java
// Obtener el UUID de un miembro de la audiencia; devuelve un Optional<UUID>
audience.get(Identity.UUID);

// Obtener el nombre visible o, si no está definido, un valor predeterminado
audience.getOrDefault(Identity.DISPLAY_NAME, Component.text("sin nombre visible"));
```
