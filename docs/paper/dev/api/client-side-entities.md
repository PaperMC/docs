---
slug: /dev/client-side-entities
description: How to create entities that are only visible for a single player.
---

# Client-side entities

Client-side entities are frequently used to display different holograms for each player.

## Why create actual entities on the server?

Creating real entities brings multiple benefits, such as being able to use Bukkit events to detect interactions
with the entities, avoiding entity ID conflicts, support for setting the velocity of the entity out of the box
and most importantly no breaks across updates.

:::note

This is often achieved by manually sending packets to the player which can easily break between Minecraft versions.

For example when additional entity metadata gets added, arbitrary metadata indices no longer align between the
custom packet code and the client.

:::

## Spawning an entity

First we create the entity using the consumer methods to be able to configure it _before_ it is added to the world.
The important method here is `setVisibleByDefault`, which prevents all players around the entity from seeing it once
it is actually added to the world.

```java
TextDisplay display = location.getWorld().spawn(location, TextDisplay.class, entity -> {
    entity.setVisibleByDefault(false); // Hide the entity by default for every player
    entity.setPersistent(false); // Prevent the entity being saved when the chunk is unloaded

    // Customize the entity as usual
    entity.text(Component.text("Some awesome content"));
    entity.setBillboard(Display.Billboard.VERTICAL);
    // ...
});
```

:::warning

Even with persistence disabled on these entities, they will only be automatically removed if the chunk gets unloaded.

If they are located in chunks that never unload (except on server shutdown) like the spawn chunks, they can accumulate
if not properly cleaned up when the player leaves the server or goes out of range.

:::

## Showing the entity

We now have the entity in our world, but it's still hidden, so we must show it to every player that is
supposed to see it, be it one player or a group of players.

```java
player.showEntity(plugin, display);
```

## Modifying the entity

When you want to change the position of the entity (or change its displayed text for the current example) you can
simply use the API methods.

```java
display.text(Component.text("Some other content"));
display.teleport(newLocation);
```

## Removing the entity

As stated above, the entity must be removed when it is no longer relevant for a player, at minimum removing it
when the player disconnects from the server to prevent leaking entities.

```java
display.remove();
```
