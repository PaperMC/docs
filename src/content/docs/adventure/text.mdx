---
title: Text (Chat Components)
description: Everything you need to know about Components.
---

Components represent Minecraft chat components

## Creating components

```java
// Creates a line of text saying "You're a Bunny! Press <key> to jump!", with some coloring and styling.
final TextComponent textComponent = Component.text("You're a ")
  .color(TextColor.color(0x443344))
  .append(Component.text("Bunny", NamedTextColor.LIGHT_PURPLE))
  .append(Component.text("! Press "))
  .append(
    Component.keybind("key.jump")
      .color(NamedTextColor.LIGHT_PURPLE)
      .decoration(TextDecoration.BOLD, true)
  )
  .append(Component.text(" to jump!"));
// now you can send `textComponent` to something, such as a client
```

You can also use a builder, which is mutable, and creates one final
component with the children.

```java
// Creates a line of text saying "You're a Bunny! Press <key> to jump!", with some coloring and styling.
final TextComponent textComponent2 = Component.text()
  .content("You're a ")
  .color(TextColor.color(0x443344))
  .append(Component.text().content("Bunny").color(NamedTextColor.LIGHT_PURPLE))
  .append(Component.text("! Press "))
  .append(
    Component.keybind().keybind("key.jump")
      .color(NamedTextColor.LIGHT_PURPLE)
      .decoration(TextDecoration.BOLD, true)
      .build()
  )
  .append(Component.text(" to jump!"))
  .build();
// now you can send `textComponent2` to something, such as a client
```

## Styling components

Styles are a superset of TextColor and TextDecoration and can be applied to text components.
TextColor represents any color in the RGB spectrum.
You can also use NamedTextColor to choose from the default color palette.
The following TextDecorations are available:

* *Italic*
* **Bold**
* Strikethrough
* Underlined
* Obfuscated

## Events

There are currently two types of events available for text components.
Hover events allow you to show another component, item or entity when a user hovers their mouse over the text.
When a user clicks on the text component, a click event is fired which can perform one of the following actions:

* Open a URL
* Open a file
* Run a command
* Suggest a command
* Change a book's page
* Copy a string to clipboard

## Serializing and deserializing components

Serialization to JSON, legacy, and plain representations is also
supported.

Components can be serialized with [Text Serializers](/adventure/serializer).

## Using components within your application

The way you use components within your application will of course vary
depending on what you're aiming to achieve.

However, the most common task is likely to be sending a component to
some sort of Minecraft client. The method for doing this will depend on
the platform your program is running on, however it is likely to involve
serializing the component to Minecraft's JSON format, and then sending
the JSON through another method provided by the platform.

The text library is platform-agnostic and therefore doesn't provide any
way to send components to clients. Some platforms implement [Adventure natively](/adventure/platform/native), so `Components`
can be directly used with their API. For other platforms (Spigot/Bukkit, BungeeCord, and SpongeAPI 7),
we provide compatibility bridges as [Platforms](/adventure/platform) which can be distributed with your own plugins.
