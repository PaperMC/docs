---
slug: /dev/components
---

# Components

:::note

This documentation page applies to both the Paper and Velocity projects

:::

Since Minecraft 1.17, the game has utilized components to represent text to be displayed
by clients. Components offer a number of benefits over plain text strings which are enumerated below.
Paper and Velocity natively implements the Adventure API to add component support wherever possible.

## Differences

Previously, text was a linear structure with the only formatting options being
confusing symbols like `§c` and `§k` to control basic colors and styles of text.
Components are a tree-like structure which inherit style and colors from their parents.
The docs mentioned above contain examples of this. 

Components have several types which do different things than just display raw text, like
translating text to the client's language based on a key, or showing a client-specific keybind
to a player.

All these component types support more style options like any RGB color, interaction events
(click and hover). The other component types and these style options have poor or missing
representations in the legacy string format.

## Usage

Representing text as Components is now the supported way of representing text for Paper and Velocity. They are used
for almost all aspects of text being displayed to clients. Text like item names, lore, boss bars, team prefixes and
suffixes, custom names, and much more all support Components in respective APIs.
[Mojang has stated](https://bugs.mojang.com/browse/MC-190605?focusedId=993040&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-993040)
that client support for the legacy format with `§` will be removed in the future.


:::tip

In the Paper API, there are lots of deprecated methods and types that deal with this legacy format. This is to
signal that a better alternative in Components is available and should be migrated to going forward.

:::

### Components

Components can be interacted with as objects. There are different interfaces for each type along with
builders for all the types. These objects are immutable so when constructing more complex components, it's
recommended to use builders to avoid creating new Component instances with every change.

```java
final Component component = Component.text("Hello world!", NamedTextColor.RED);

// the adventure component library is built with static imports in mind to make code more consise.
final Component component = text()
    .content("Hello")
    .color(color(0x13f832))
    .append(text(" world!, GREEN))
    .build();
```

:::info

For complete documentation on the adventure Component API Paper and Velocity use, please look at the
[adventure documentation](https://docs.advntr.dev).

:::

### MiniMessage

Paper and Velocity include the MiniMessage library which is a string representation of components. If you prefer working with
strings rather than objects, MiniMessage is vastly superior to the legacy string format. It can utilize the tree
structure for style inheritance and can represent the more complex component types while legacy cannot.

```java
final Component component = MiniMessage.miniMessage().deserialize("""
    <#438df2><b>This is the parent component; its style is applied to all children.
    <u><!b>This is the first child which is rendered after the parent</!b></u><key:key.inventory></b></#438df2>
    """);
```

We recommend using this format for user-facing input such as commands or configuration values.

:::info

MiniMessage is a part of adventure, and you can find its documentation on [adventure's documentation](https://docs.advntr.dev/minimessage/index.html).

:::

### JSON Format

Components can be serialized and deserialized from a standard JSON format. This format is used
in vanilla in various commands which accept component arguments like `/tellraw`. Below is a simple example
of this format.

```json
{
  "text": "This is the parent component; its style is applied to all children.\n",
  "color": "#438df2",
  "bold": true,
  "extra": [
    {
      "text": "This is first child which is rendered after the parent",
      "underlined": true,
      "bold": false // This overrides the parent's "bold" value just for this component
    },
    {
      "keybind": "key.inventory" // This is a keybind component which will display the client's keybind for that action
    }
  ]
}
```

:::info
The JSON Format is fully documented on the [Minecraft Wiki](https://minecraft.fandom.com/wiki/Raw_JSON_text_format). There are
online tools to make generating this format much easier like [JSON Text Generator](https://minecraft.tools/en/json_text.php).
:::
