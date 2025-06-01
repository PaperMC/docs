---
title: Migrating from text 3.x
slug: adventure/migration/text-3.x
description: Moving from text 3.x to Adventure.
---

Adventure is an evolution of the text 3.x API. If you've worked with
the text API before, the switch to Adventure should be relatively quick.
For the most part, you'll just need to depend on the Adventure API
and the relevant [Platform](/adventure/platform) you support and replace references
to classes in `net.kyori.text` to `net.kyori.adventure.text`, though see
below for major breaking changes.

## A word of caution

However, before you continue, it is strongly recommended you read about
[Audiences](/adventure/audiences). Unlike text, Adventure defines a standard interface for
sending content (including chat messages) to viewers. In addition, Adventure
defines interfaces for other game play mechanics that can be arbitrarily sent
to players.

## Breaking changes from text 3.x

### Factory methods renamed
In text 3.x, components could be constructed using the `<type>Component.of()` methods.
In Adventure, we've changed to using `Component.<type>(/*...*/)` style methods to allow
for easier static imports.

Similarly, `Style.of(/*...*/)` is changed to `Style.style(/*...*/)`.

### `.builder()`
Builders are now created by calling the aforementioned factory methods with no parameters.
For example, `TextComponent.builder()` becomes `Component.text()`.

Note that the equivalent of `TextComponent.builder("hello")` is `Component.text().content("hello")`.

### `.append()` with a String argument
Component builders in 3.x had a shorthand for appending a new text component: `builder.append("wow")`.
In Adventure you have to write it in full, `builder.append(Component.text("wow"))` in this case.

### `LegacyComponentSerializer`

In text 3.x, you would deserialize a component that used a color code prefix that
differed from the section symbol normally used by using `LegacyComponentSerializer.legacy().deserialize(string, altChar)`.
In Adventure, the API to use is `LegacyComponentSerializer.legacy(altChar).deserialize(string)`.

To make a linking serializer you have to use the builder.
Change `LegacyComponentSerializer.legacyLinking(style)`
to `LegacyComponentSerializer.builder().extractUrl(style).build()`.

### `TextColor` renamed to `NamedTextColor`

In order to accommodate the new RGB colors introduced in 1.16, all the named text colors
were moved to the `NamedTextColor` class. References to the old `TextColor` class
should be updated to refer to `NamedTextColor`.

## Serializer

If you have a need to interoperate with clients using the old text 3.x API, you
can use the `adventure-text-serializer-legacy-text3` artifact, which includes a
`LegacyText3ComponentSerializer` that can convert from Adventure to text 3.x
components and back. Note that RGB colors will be downsampled.
