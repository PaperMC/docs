---
title: Player list/Tab list
description: Setting the player list with Adventure.
---

Adventure only supports changing the header (above the players) and footer (below the players) of the tab list.

![Image showing a tab list from a multiplayer server with the header and footer encased, shown through the vanilla Minecraft client](./assets/tablist.png)

**Usage**

With any `Audience` use `Audience.sendPlayerListHeader(Component)`, `Audience.sendPlayerListFooter(Component)`
and/or `Audience.sendPlayerListHeaderAndFooter(Component, Component)`.

Whether sending a header or footer by itself will display another existing header or footer will vary depending on which platform
you are working on. Servers will most likely support keeping headers or footers when sending them separately, while proxies are
more likely to only let you send everything at once.

**Examples**

```java
public void onPlayerJoin(final Audience player) {
    final Component header = Component.text("My Cool Server", NamedTextColor.BLUE);
    final Component footer = Component.text("It is: today!");
    player.sendPlayerListHeaderAndFooter(header, footer);
}
```

Depending on your platform this next example might display an existing header as well

```java
public void onDayChange(final Audience server) {
    final Component footer = Component.text("It is: tomorrow!");
    server.sendPlayerListFooter(footer);
}
```
