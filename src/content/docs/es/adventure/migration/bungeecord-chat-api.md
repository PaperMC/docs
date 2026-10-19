---
title: Migrar desde la API de chat de BungeeCord
slug: es/adventure/migration/bungeecord-chat-api
description: Migración de la API de chat de BungeeCord a la API de Adventure.
---

La API de texto de Adventure y la API de chat de BungeeCord se diseñaron con metodologías muy
distintas. Esta página repasa algunas diferencias importantes.

## Audiencias

Te recomendamos encarecidamente leer primero sobre las [audiencias](/es/adventure/audiences). A diferencia de BungeeCord,
que limita las funciones a tipos de usuario específicos, Adventure solo permite realizar
las operaciones aplicables a cada audiencia.

## Decoración y estilos

La API de chat de BungeeCord almacena todas las decoraciones en `BaseComponent`. Adventure separa
los estilos en su propia clase `Style`.

BungeeCord permite combinar los estilos de un componente con otro. Adventure ofrece
métodos equivalentes para combinar estilos, o permite reemplazar los estilos de un
componente por los de otro.

## Colores del chat

La jerarquía de colores y estilos del chat de Adventure difiere de la API `ChatColor`
de BungeeCord. Probablemente sea aquí donde se aprecie el contraste más marcado entre la API de Adventure y BungeeCord/Bukkit.

### Alternativa a `ChatColor`

Los equivalentes de `ChatColor` en Adventure se dividen en tres tipos:

* Los tipos de formato (como `BOLD` o `ITALIC`) pertenecen a `TextDecoration` y se pueden establecer
  en un componente o estilo mediante el método `decoration`. Las decoraciones también usan un valor de tres estados
  para indicar si están activadas, desactivadas o sin definir (en cuyo caso el componente hereda
  el ajuste de su componente padre).
* Los colores con nombre (también llamados códigos de color antiguos de Mojang) ahora pertenecen a la clase
  `NamedTextColor`.
* Los colores RGB se crean mediante los métodos `TextColor.color()` (equivalentes al método
  `ChatColor.of()` de la API `ChatColor` de BungeeCord 1.16).

### No se pueden construir cadenas antiguas

La API `ChatColor` de BungeeCord proviene de la API de Bukkit. A su vez, la API `ChatColor` de Bukkit
se remonta a los primeros días de Minecraft (Beta 1.0), cuando la forma habitual y aceptada de enviar
mensajes con formato al cliente consistía en concatenar cadenas especiales que le indicaban qué formato aplicar. Un mensaje
de chat con formato se enviaba al cliente de esta manera:

```java
player.sendMessage(ChatColor.GREEN + "¡Hola a todos! " + ChatColor.BOLD + "Este mensaje está en verde y negrita" + ChatColor.RESET + ChatColor.GREEN + "!");
```

Esta forma de enviar mensajes ha perdurado hasta hoy, incluso después de que Mojang introdujera componentes de chat enriquecido
en Minecraft 1.7.2. Bukkit conservó este comportamiento por compatibilidad con versiones anteriores, y BungeeCord incorporó el
cambio para ser compatible con la clase `ChatColor` de Bukkit.

En Adventure, no puedes concatenar códigos de formato especiales. El equivalente de `ChatColor` en Adventure,
`TextColor`, devuelve texto descriptivo sobre el color cuando se llama a `toString()`. La
alternativa recomendada es convertir todos los mensajes antiguos en componentes.

### `ChatColor.stripColor()`

`ChatColor.stripColor()` no existe en Adventure. Una alternativa sería usar
`PlainTextComponentSerializer.plainText().serialize(LegacyComponentSerializer.legacySection().deserialize(input))`.

### `ChatColor.translateAlternateColorCodes()`

`ChatColor.translateAlternateColorCodes()` no existe en Adventure. En su lugar, al deserializar una
cadena antigua debes usar `LegacyComponentSerializer.legacy(altChar).deserialize(input)`.

## Diferencias en `ComponentBuilder`

`ComponentBuilder` de BungeeCord trata cada componente de forma independiente y permite
transferir manualmente los estilos de un componente anterior. Adventure dispone de varios
constructores de componentes. El equivalente más cercano a `ComponentBuilder` de BungeeCord es
añadir componentes a un componente vacío de nivel superior usando `Component.text()`
como base. Para reproducir el comportamiento de `ComponentBuilder`, puedes hacer lo siguiente:

* Usa la clase `Style` para almacenar estilos comunes y los métodos `mergeStyle` y `style`
  para combinar y reemplazar estilos en un componente.
* Usa el constructor `TextComponent` de Adventure para crear un componente a la vez y
  luego añádelo a un constructor de componentes de texto vacío de nivel superior.

Por ejemplo, este componente de BungeeCord:

```java
new ComponentBuilder("hola")
  .color(ChatColor.GOLD)
  .append(" mundo", FormatRetention.NONE)
  .build()
```

se convierte en este equivalente de Adventure:

```java
Component.text()
  .append(Component.text("hola", NamedTextColor.GOLD))
  .append(Component.text(" mundo"))
  .build()
```

Del mismo modo,

```java
new ComponentBuilder("hola")
  .color(ChatColor.GOLD)
  .bold(true)
  .append(" mundo")
  .build()
```

se convierte en

```java
final Style style = Style.style(NamedTextColor.GOLD, TextDecoration.BOLD);
Component.text()
  .append(Component.text("hola", style))
  .append(Component.text(" mundo", style))
  .build()
```

## Inmutabilidad

En la API de chat de BungeeCord, todos los componentes son mutables. En cambio, los componentes de texto
de Adventure son inmutables: cualquier intento de modificar un componente crea uno nuevo,
que es una copia del original con el cambio solicitado.

## Serializadores

La API de chat de BungeeCord incluye tres serializadores. Los tres tienen equivalentes en Adventure:

* El método de deserialización `TextComponent.fromLegacyText()` equivale al método
  `deserialize` del serializador de texto [antiguo](/es/adventure/serializer/legacy). Del mismo modo, el método de serialización
  `BaseComponent.toLegacyText()` equivale al método `serialize` del serializador de texto antiguo.
* El método de serialización `TextComponent.toPlainText()` equivale al método
  `serialize` del serializador de texto [sin formato](/es/adventure/serializer/plain). Se puede crear un componente
  a partir de una cadena de texto sin formato mediante `Component.text(string)`.
* El equivalente de Adventure a `ComponentSerializer` es el serializador de texto [Gson](/es/adventure/serializer/gson).

## Compatibilidad con versiones anteriores

`BungeeCordComponentSerializer` permite convertir componentes de Adventure ([Component](/es/adventure/text))
a la API nativa de componentes de chat de BungeeCord y viceversa. Se puede usar cuando no hay
compatibilidad nativa con la plataforma. El serializador está disponible en el artefacto `adventure-platform-text-serializer-bungeecord`.
