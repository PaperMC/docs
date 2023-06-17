---
slug: /dev/roadmap
---

# Roadmap

Paper offers a rich API that has a wide range of features that can help you unlock the full potential of your server. 
However, in order to make room for new features and improvements, some of the older APIs will be phased out. This page 
is intended to document any future API changes that are planned or possible deprecations that may be coming up. 

## Future Plans


### Interface ItemStacks

When you create ItemStacks, you create an API representation of an ItemStack.
However, there are also places where you can obtain an ItemStack that is backed by an NMS object instead. 
This can lead to inconsistencies and unnecessary upkeep since we need to maintain our own implementation of ItemStack and
support the NMS backed object using ugly methods due to it not being a plain interface.

In the future, ItemStack will be converted to an interface that allows developers to use an underlying 
ItemStack directly instead of going through the API implementation.

#### Precautions
- Avoid directly extending the ``ItemStack`` class.
  - Custom implementations of this class are not supported


### ServerPlayer Reusing    
*Note: Only applies to NMS usage, will not apply to API.*

Avoid directly storing player (ServerPlayer) entity instances. Currently the player instance is reused when switching 
worlds, however, in the future, this behavior will be reverted to match vanilla behavior. API entities (wrappers) will
continue to function and will have their underlying instance replaced automatically.

This is being done to help reduce possible inconsistencies between world switching between Vanilla and Paper.

## Experimental API

### Teleport Flags

Teleport flags offer a way to teleport entities whilst being able to customize behavior.
This allows you to do things like teleport players using relative flags and being able to retain passengers.

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

## Deprecation Policy

:::warning

It is highly recommended that you avoid using any APIs that are marked as deprecated.

:::

If you continue to use deprecated APIs, your server may become unstable and may not function as expected.
You may also experience performance issues and other problems. To ensure the best possible experience and longevity
of your plugins, it is important to stay up-to-date with the latest API changes and avoid using any APIs
that are marked for deprecation.


API marked with ``@Deprecated`` should not be used in your code base, as alternative API may be able to be used instead.
While certain API may continue to function despite being deprecated, it **cannot** be promised that this API won't be marked 
as deprecated for removal in the future.
```java
@Deprecated
public void exampleMethod();
```
*Example deprecated method*

### Deprecated for Removal

In addition to being marked as ``@Deprecated``, api may be marked as `forRemoval` with a given ``@ScheduledForRemoval`` version.
API scheduled for removal should only occur within major release versions of Minecraft.
It is highly recommended you migrate away from API scheduled for removal. 

It should be noted, that API scheduled for removal will be given adequate time to allow plugin developers to migrate
away from said API.
```java
@ApiStatus.ScheduledForRemoval(inVersion = "1.20")
@Deprecated(forRemoval = true)
public void exampleMethod();
```
*Example method marked for removal in 1.20*


## Deprecation Reasons

There are many possible reasons why an API might be deprecated.
Some of the common reasons why API can be deprecated is:

### Old API

As the game evolves, the API may represent concepts that no longer exist in the core game.

Old API is no most likely not functional in newer versions of the game, which will behave unexpectedly on newer versions,
therefore may be scheduled for removal.

### Duplicate API

As Paper continues to upstream Spigot, it can occasionally include APIs that clash with what Paper already has. 
Typically, Paper will deprecate Spigot’s API in favor of their own API. 

However, in cases where upstream offers a more powerful API, Paper’s may be deprecated instead.
While Paper is still upstreaming Spigot, any api introduced by spigot will continue to function, and will 
not be removed.

### Obsolete API
Paper strives to improve on APIs that may already be included. There may be some cases where we have built new 
APIs to offer as a replacement to another.

Obsolete API is expected for function for the far future, and may not be scheduled for removal
for a fair amount of time. 

*See [the API migration guide](docs/paper/dev/api/obsolete-api-migration) for more information*