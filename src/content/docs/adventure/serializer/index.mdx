---
title: Text Serializers
description: Everything to know about text/component serializers.
---

The lowest-level way to convert between Adventure's data and other formats
are serializers. Some serializers convert to standard formats, while others
convert to Adventure's own formats.

- [JSON](/adventure/serializer/json)
- [Gson](/adventure/serializer/gson)
- [Legacy](/adventure/serializer/legacy)
- [Plain](/adventure/serializer/plain)
- [MiniMessage](/adventure/minimessage)

Components can be converted using any of these serializers:

```java
// Creates a text component
final TextComponent textComponent = Component.text()
  .content("Hello ")
  .color(NamedTextColor.GOLD)
  .append(Component.text("world", NamedTextColor.AQUA, TextDecoration.BOLD))
  .append(Component.text("!", NamedTextColor.RED))
  .build();

// Converts textComponent to the JSON form used for serialization by Minecraft.
final String json = JSONComponentSerializer.json().serialize(textComponent);

// Converts textComponent to a legacy string - "&6Hello &b&lworld&c!"
final String legacy = LegacyComponentSerializer.legacyAmpersand().serialize(textComponent);

// Converts textComponent to a plain string - "Hello world!"
final String plain = PlainTextComponentSerializer.plainText().serialize(textComponent);
```

The same is of course also possible in reverse for deserialization.

```java
// Converts JSON in the form used for serialization by Minecraft to a Component
final Component component = JSONComponentSerializer.json().deserialize(json);

// Converts a legacy string (using formatting codes) to a TextComponent
final Component component = LegacyComponentSerializer.legacyAmpersand().deserialize("&6Hello &b&lworld&c!");

// Converts a plain string to a TextComponent
final Component component = PlainTextComponentSerializer.plainText().deserialize("Hello world!");
```

## Text Encoders

Text encoders are similar to serializers, but they only provide one-way
operations, allowing for serialization but not deserialization.

- [ANSI](/adventure/serializer/ansi)
