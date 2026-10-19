---
title: Serializadores de texto
slug: es/adventure/serializer
description: Todo lo que necesitas saber sobre los serializadores de texto y componentes.
sidebar:
  label: Resumen
---

Los serializadores son la forma más básica de convertir datos de Adventure a otros formatos.
Algunos convierten a formatos estándar, mientras que otros
convierten a formatos propios de Adventure.

- [JSON](/es/adventure/serializer/json)
- [Gson](/es/adventure/serializer/gson)
- [Formato antiguo](/es/adventure/serializer/legacy)
- [Texto sin formato](/es/adventure/serializer/plain)
- [MiniMessage](/es/adventure/minimessage)

Los componentes se pueden convertir mediante cualquiera de estos serializadores:

```java
// Crear un componente de texto
final TextComponent textComponent = Component.text()
  .content("Hola ")
  .color(NamedTextColor.GOLD)
  .append(Component.text("mundo", NamedTextColor.AQUA, TextDecoration.BOLD))
  .append(Component.text("!", NamedTextColor.RED))
  .build();

// Convertir textComponent al formato JSON que Minecraft usa para la serialización.
final String json = JSONComponentSerializer.json().serialize(textComponent);

// Convertir textComponent a una cadena antigua: "&6Hola &b&lmundo&c!"
final String legacy = LegacyComponentSerializer.legacyAmpersand().serialize(textComponent);

// Convertir textComponent a una cadena sin formato: "Hola mundo"
final String plain = PlainTextComponentSerializer.plainText().serialize(textComponent);
```

Por supuesto, también es posible hacer lo mismo a la inversa para deserializar.

```java
// Convertir el JSON usado por Minecraft para la serialización en un Component.
final Component component = JSONComponentSerializer.json().deserialize(json);

// Convertir una cadena antigua (con códigos de formato) en un TextComponent.
final Component component = LegacyComponentSerializer.legacyAmpersand().deserialize("&6Hola &b&lmundo&c!");

// Convertir una cadena sin formato en un TextComponent.
final Component component = PlainTextComponentSerializer.plainText().deserialize("Hola mundo");
```

## Codificadores de texto

Los codificadores de texto son similares a los serializadores, pero solo ofrecen
operaciones unidireccionales: permiten serializar, pero no deserializar.

- [ANSI](/es/adventure/serializer/ansi)
