---
title: Introduction
slug: paper/dev/component-api/introduction
description: An introduction to how components work.
---

:::note

This documentation page applies to both the Paper and Velocity projects.

:::

Since Minecraft 1.7, the game has utilized components to represent text to be displayed
by clients. Components offer a number of benefits over plain text strings which are enumerated below.
Paper and Velocity natively implements the Adventure API to add component support wherever possible.

## Why you should use Components

Previously, text was a linear structure with the only formatting options being
confusing symbols like `§c` and `§k` to control basic colors and styles of text.
Components are a tree-like structure that inherits style and colors from their parents.

Components have several types which do different things than just display raw text, like
translating text to the client's language based on a key, or showing a client-specific keybind
to a player.

All these component types support more style options like any RGB color, interaction events
(click and hover). The other component types and these style options have poor or missing
representations in the legacy string format.

## Usage

Representing text as components is now the supported way of representing text for Paper and Velocity. They are used
for almost all aspects of text being displayed to clients. Text like item names, lore, bossbars, team prefixes and
suffixes, custom names, and much more all support components in respective APIs.
[Mojang has stated](https://bugs-legacy.mojang.com/browse/MC-190605?focusedId=993040&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-993040)
that client support for the legacy format with `§` will be removed in the future.


:::tip

In the Paper API, there are lots of deprecated methods and types that deal with this legacy format. This is to
signal that a better alternative in components is available and should be migrated to going forward.

:::

## Creating components

Components can be interacted with as objects. There are different interfaces for each type along with
builders for all the types. These objects are immutable so when constructing more complex components, it's
recommended to use builders to avoid creating new Component instances with every change.

```java
// This is a sub-optimal construction of the
// component as each change creates a new component
final Component component = Component.text("Hello")
    .color(TextColor.color(0x13f832))
    .append(Component.text(" world!", NamedTextColor.GREEN));

/* This is an optimal use of the builder to create
   the same component. Also note that Adventure
   Components are designed for use with static method imports
   to make code less verbose */
final Component component = text()
    .content("Hello").color(color(0x13f832))
    .append(text(" world!", GREEN))
    .build();
```

:::note[In-Depth Documentation]

For complete documentation on the Adventure Component API Paper and Velocity use, please look at the
[Adventure documentation](/adventure).

:::

## MiniMessage

Paper and Velocity include the MiniMessage library, which is a string representation of components. If you prefer working with
strings rather than objects, MiniMessage is vastly superior to the legacy string format. It can utilize the tree
structure for style inheritance and can represent the more complex component types while legacy cannot.

```java
final Component component = MiniMessage.miniMessage().deserialize(
    "<#438df2><b>This is the parent component; its style is " +
    "applied to all children.\n<u><!b>This is the first child, " +
    "which is rendered after the parent</!b></u><key:key.inventory></b></#438df2>"
);


// if the syntax above is too verbose for you, create a helper method!

public final class Components {
    public static Component mm(String miniMessageString) { // mm, short for MiniMessage
        return MiniMessage.miniMessage().deserialize(miniMessageString);
    }
}

// ...

import static io.papermc.docs.util.Components.mm; // replace with your own package

final Component component = mm("<blue>Hello <red>World!");
```

We recommend using this format for user-facing input such as commands or configuration values.

:::note[In-Depth Documentation]

MiniMessage is a part of Adventure, and you can find its documentation on [Adventure's documentation](/adventure/minimessage/).

:::

:::tip

MiniMessage has a [web viewer](https://webui.advntr.dev/), which is useful for constructing more complicated components and seeing the results in real time.

:::

## JSON format

Components can be serialized and deserialized from a standard JSON format. This format is used
in Vanilla in various commands which accept component arguments like `/tellraw`. Below is a simple example
of this format.

```json
{
  "text": "This is the parent component; its style is applied to all children.\n",
  "color": "#438df2",
  "bold": true,
  "extra": [
    {
      "text": "This is this first child, which is rendered after the parent",
      "underlined": true,
      // This overrides the parent's "bold" value just for this component
      "bold": false
    },
    {
      // This is a keybind component which will display the client's keybind for that action
      "keybind": "key.inventory"
    }
  ]
}
```

:::note[In-Depth Documentation]

The JSON format is fully documented on the [Minecraft Wiki](https://minecraft.wiki/w/Text_component_format).

:::

:::tip

There are online tools to make generating this format much easier like [JSON Text Generator](https://minecraft.tools/en/json_text.php).

:::

## Serializers

Paper and Velocity come bundled with different serializers for converting between
[`Component`](https://jd.advntr.dev/api/latest/net/kyori/adventure/text/Component.html)s and other forms of serialized text.

### [`GsonComponentSerializer`](https://jd.advntr.dev/text-serializer-gson/latest)

Converts between `Component`
and JSON-formatted strings with convenience methods to directly deal with Gson's
[`JsonElement`](https://javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/JsonElement.html).
This conversion is lossless and is the preferred form of serialization for components that do not have to be edited by users regularly.

### [`MiniMessage`](https://jd.advntr.dev/text-minimessage/latest)

Converts between `Component`
and a MiniMessage-formatted string. This conversion is lossless and is the preferred form of
serialization for components that have to be edited by users. There is also extensive customization you can add to the
serializer, which is [documented here](/adventure/minimessage/api/#getting-started).

### [`PlainTextComponentSerializer`](https://jd.advntr.dev/text-serializer-plain/latest)

Serializes a `Component` into a plain text string. This is very lossy as all style information as well as most other
types of components will lose information. There may be special handling for
[`TranslatableComponent`](https://jd.advntr.dev/api/latest/net/kyori/adventure/text/TranslatableComponent.html)s to be serialized
into a default language, but generally this shouldn't be used except in certain circumstances, like logging to a text file.

### [`LegacyComponentSerializer`](https://jd.advntr.dev/text-serializer-legacy/latest)

:::caution

This is not recommended for use as the legacy format may be removed in the future.

:::

Converts between `Component` and the legacy string format.
This conversion is very lossy as component types and events do not have a legacy string representation.

A more useful use case is converting legacy text to MiniMessage format in a migration process.
```java
final String legacyString = ChatColor.RED + "This is a legacy " + ChatColor.GOLD + "string";

// runs the legacy string through two serializers to convert legacy -> MiniMessage
final String miniMessageString = MiniMessage.miniMessage().serialize(
    LegacyComponentSerializer.legacySection().deserialize(legacyString)
);
```

:::note

There are 2 built-in legacy serializers, one dealing with `§` symbols and the other for
`&` symbols. They have their own instances available through
[`LegacyComponentSerializer#legacySection()`](https://jd.advntr.dev/text-serializer-legacy/latest/net/kyori/adventure/text/serializer/legacy/LegacyComponentSerializer.html#legacySection())
and [`LegacyComponentSerializer#legacyAmpersand()`](https://jd.advntr.dev/text-serializer-legacy/latest/net/kyori/adventure/text/serializer/legacy/LegacyComponentSerializer.html#legacyAmpersand()).

:::
