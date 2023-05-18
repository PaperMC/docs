---
slug: /dev/roadmap
---

# API Future

Paper offers a rich API that has a wide range of features that can help you unlock the full potential of your server. 
However, in order to make room for new features and improvements, some of the older APIs will be phased out. This page 
is intended to document any future API changes that are planned or possible deprecations that may be coming up. 

## Future Plans


## Experimental API

### Teleport Flags

Teleport flags offer a way to teleport players using relative flags and being able to do things like retain passengers.
This API is currently finalized and will be marked as stable in a future release.

#### Player Teleportation
Teleport a player relatively, preventing velocity from being reset in the X, Y, and Z axis.
```java
player.teleport(location,
            TeleportFlag.Relative.X,
            TeleportFlag.Relative.Y,
            TeleportFlag.Relative.Z
        );
```

#### Vehicle Teleportation
Teleport an entity with the `RETAIN_PASSENGERS` flag, allowing its passengers to be transferred with the entity.
```java
entity.teleport(location, TeleportFlag.EntityState.RETAIN_PASSENGERS);
```

## Deprecations

#### Deprecation Policy
TODO


:::warning

It is highly recommended that you avoid using any APIs that are marked for deprecation.

:::

If you continue to use deprecated APIs, your server may become unstable and may not function as expected. 
You may also experience performance issues and other problems. To ensure the best possible experience and longevity
of your plugins, it is important to stay up-to-date with the latest API changes and avoid using any APIs
that are marked for deprecation.

#### Old API

As the game evolves, the API may represent concepts that no longer exist in the core game. 
This section contains API that is no longer supported by the game and therefore may behave unexpectedly on newer versions.

* [AsyncChatDecorateEvent#isPreview()](https://jd.papermc.io/paper/1.19/io/papermc/paper/event/player/AsyncChatDecorateEvent.html#isPreview())

#### Duplicate API

As Paper continues to upstream Spigot, it can occasionally include APIs that clash with what Paper already has. 
Typically, Paper will deprecate Spigot’s API in favor of their own API. 

However, in cases where upstream offers a more powerful API, Paper’s may be deprecated instead.

* [PlayerLocaleChangeEvent](https://jd.papermc.io/paper/1.19/com/destroystokyo/paper/event/player/PlayerLocaleChangeEvent.html)
* [PlayerInitialSpawnEvent](https://jd.papermc.io/paper/1.19/com/destroystokyo/paper/event/player/PlayerInitialSpawnEvent.html)
* [WorldBorder#isInBounds(Location)](https://jd.papermc.io/paper/1.19/org/bukkit/WorldBorder.html#isInBounds(org.bukkit.Location))
* [EntityTransformedEvent](https://jd.papermc.io/paper/1.19/com/destroystokyo/paper/event/entity/EntityTransformedEvent.html)
* [ItemStackRecipeChoice](https://jd.papermc.io/paper/1.19/com/destroystokyo/paper/inventory/ItemStackRecipeChoice.html)
* [HeightmapType](https://jd.papermc.io/paper/1.19/com/destroystokyo/paper/HeightmapType.html)
    * All associated methods in `Location` and `World`
* All deprecated or removed `GoalKey`s in [VanillaGoal](https://jd.papermc.io/paper/1.19/com/destroystokyo/paper/entity/ai/VanillaGoal.html)
* [StructureLocateEvent](https://jd.papermc.io/paper/1.19/io/papermc/paper/event/world/StructureLocateEvent.html) (not StructuresLocateEvent, different things)
* Duplicate `Effect`s.
* World API
    * [World#hasSkylight()](https://jd.papermc.io/paper/1.19/org/bukkit/World.html#hasSkylight())
    * [World#hasBedrockCeiling()](https://jd.papermc.io/paper/1.19/org/bukkit/World.html#hasBedrockCeiling())
    * [World#doesBedWork()](https://jd.papermc.io/paper/1.19/org/bukkit/World.html#doesBedWork())
    * [World#doesRespawnAnchorWork()](https://jd.papermc.io/paper/1.19/org/bukkit/World.html#doesRespawnAnchorWork())
  
#### Obsolete API

Paper strives to improve on APIs that may already be included. There may be some cases where we have built new 
APIs to offer as a replacement to another. Typically, APIs marked in this section will continue to function much longer.
However, it is encouraged to move away from said APIs.