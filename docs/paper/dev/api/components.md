---
slug: /dev/components
---

# Components

Since 1.7, Minecraft has utilized components to represent text to be displayed
by clients. Components offer a number of benefits over plain text strings which are enumerated below.
Paper natively implements the Adventure API to add component support wherever possible.

:::info

For complete documentation on the Component system Paper uses, please look at the
[adventure documentation](https://docs.advntr.dev).

:::

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

## Uses

Components are used all over the API, almost everywhere text is displayed, like chat,
boss bars, action bars, item names and lore, player list text, and more. As you look
through the API, you will see quite a few methods which take a `String` parameter that
are now deprecated in favor of methods which take a `Component`. These deprecations exist
because of [Mojang's planned dropping](https://bugs.mojang.com/browse/MC-190605?focusedId=993040&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-993040)
of support for the legacy formatting with `§`.
