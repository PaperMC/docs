---
title: Migrating from the BungeeCord Chat API
description: Move from the BungeeCord Chat API to the Adventure API.
---

Adventure's text API and the BungeeCord Chat API are designed along very different
lines. This page goes over some notable differences.

## Audiences

It is strongly recommended you read about [Audiences](/adventure/audiences) first. Unlike BungeeCord,
which limits functionality to specific user types, Adventure allows only the specific
operations that apply to an audience to be taken.

## Decoration and styling

The BungeeCord Chat API stores all decorations in the `BaseComponent`. Adventure separates
out styles into their own `Style` class.

BungeeCord allows you to merge the styles from one component into another. Adventure provides
equivalent methods that merge styles together, or allows you to replace the styles on one
component with another.

## Chat colors

Adventure's chat color and styling hierarchy differs from that of BungeeCord's `ChatColor`
API. This is probably where the most stark contrast between the Adventure API and BungeeCord/Bukkit
will manifest.

### Replacement for `ChatColor`

Adventure's equivalents for `ChatColor` are split over three types:

* Formatting types (such as `BOLD` or `ITALIC`) are in `TextDecoration`, and can be set
  on a component or a style with the `decoration` method. Decorations also use a tristate to
  specify if they are enabled, disabled, or not set (in which case the component inherits the
  setting from its parent component).
* Named colors (also called the legacy Mojang color codes) now exist in the `NamedTextColor`
  class.
* RGB colors are constructed using the `TextColor.color()` methods (this is equivalent to the
  `ChatColor.of()` method in the BungeeCord `ChatColor` 1.16 API.

### Legacy strings can't be constructed

The BungeeCord `ChatColor` API's heritage is in the Bukkit API. The Bukkit `ChatColor` API in turn
dates from the early days of Minecraft (Beta 1.0), when the normal and accepted way of sending formatted
messages to the client was to concatenate magical strings that told the client what to format. A formatted
chat message would be sent to the client like this:

```java
player.sendMessage(ChatColor.GREEN + "Hi everyone, " + ChatColor.BOLD + "this message is in green and bold" + ChatColor.RESET + ChatColor.GREEN + "!");
```

This style of sending messages has persisted to this day, even as Mojang introduced rich chat components
into Minecraft 1.7.2. Bukkit preserved this backwards-compatible behavior, and BungeeCord introduced the
change as a result of being compatible with the Bukkit `ChatColor` class.

In Adventure, you can't concatenate magical formatting codes. The equivalent of `ChatColor` in Adventure,
`TextColor`, instead returns descriptive text describing the color when its `toString()` is called. The
recommended replacement is to convert all legacy messages to components.

### `ChatColor.stripColor()`

`ChatColor.stripColor()` does not exist in Adventure. An equivalent would be to use
`PlainTextComponentSerializer.plainText().serialize(LegacyComponentSerializer.legacySection().deserialize(input))`.

### `ChatColor.translateAlternateColorCodes()`

`ChatColor.translateAlternateColorCodes()` does not exist in Adventure. Instead you should use
`LegacyComponentSerializer.legacy(altChar).deserialize(input)` when deserializing a legacy
string.

## Differences in `ComponentBuilder`

The BungeeCord `ComponentBuilder` treats each component independently and allows you
to manually carry over styles from a prior component. In Adventure, there are multiple
component builders. The closest equivalent for a BungeeCord `ComponentBuilder` is
to append components to a top-level empty component using `Component.text()`
as a base. To replicate the behavior of `ComponentBuilder`, consider doing the
following:

* Use the `Style` class to store common styles and the `mergeStyle` and `style`
  methods to merge and replace styles on a component.
* Use the Adventure `TextComponent` builder to create one component at a time and
  then append to a top-level text component builder that is empty.

As an example, this BungeeCord component:

```java
new ComponentBuilder("hello")
  .color(ChatColor.GOLD)
  .append(" world", FormatRetention.NONE)
  .build()
```

becomes this Adventure equivalent:

```java
Component.text()
  .append(Component.text("hello", NamedTextColor.GOLD)
  .append(Component.text(" world"))
  .build()
```

Likewise,

```java
new ComponentBuilder("hello")
  .color(ChatColor.GOLD)
  .bold(true)
  .append(" world")
  .build()
```

becomes

```java
Style style = Style.style(NamedTextColor.GOLD, TextDecoration.BOLD);
Component.text()
  .append(Component.text("hello", style)
  .append(Component.text(" world", style))
  .build()
```

## Immutability

In the BungeeCord Chat API, all components are mutable. Adventure text components,
however, are immutable - any attempt to change a component results in a new component
being created that is a copy of the original component with the change you requested.

## Serializers

The BungeeCord Chat API includes three serializers. All three have equivalents in Adventure:

* The `TextComponent.fromLegacyText()` deserialization method is equivalent to the
  `deserialize` method of the [Legacy](/adventure/serializer/legacy] text serializer. Likewise, the
  `BaseComponent.toLegacyText()` serialization method is equivalent to the `serialize`
  method on the legacy text serializer.
* The `TextComponent.toPlainText()` serialization method is equivalent to the
  `serialize` method of the [Plain](/adventure/serializer/plain) text serializer. A component can be
  created from a plain-text string using `Component.text(string)`
* The Adventure equivalent of `ComponentSerializer` is the [Gson](/adventure/serializer/gson) text
  serializer.

## Backwards compatibility

The `BungeeCordComponentSerializer` allows you to convert between Adventure [Components](/adventure/text)
and the native BungeeCord chat component API and back. This can be used when native platform support is
unavailable. The serializer is available in the `adventure-platform-text-serializer-bungeecord` artifact.
