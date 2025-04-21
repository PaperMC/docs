---
title: Roadmap
description: Outlines the future intents and plans of the Paper project.
slug: paper/dev/roadmap
---

Paper offers a rich API with a wide range of features that can help you unlock the full potential of your server.
However, in order to make room for new features and improvements, some of the older APIs will be phased out. This page
is intended to document any future API changes that are planned or possible deprecations that may be coming up.

## Future plans

### Interface `ItemStack`s

When you create `ItemStack`s using the constructor, you create an API representation of an [`ItemStack`](jd:paper:org.bukkit.inventory.ItemStack).
This is an object that delegates to a NMS-backed object, you should instead use [`ItemStack#of`](jd:paper:org.bukkit.inventory.ItemStack#of(org.bukkit.Material)) to get the NMS-backed object directly.

In the future, `ItemStack` will be converted to an interface and the constructor will be removed.

#### Precautions

- Avoid directly extending the `ItemStack` class.
  - Custom implementations of this class are not supported and **will** break.

### `ServerPlayer` reuse
*Note: Only applies to NMS usage, will not apply to API.*

Avoid directly storing player (`ServerPlayer`) entity instances. Currently, the player instance is reused when switching
worlds, however, in the future, this behavior will be reverted to match Vanilla behavior. API entities (wrappers) will
continue to function and will have their underlying instance replaced automatically.

This is done to help reduce possible inconsistencies between world switching between Vanilla and Paper.

## Deprecation policy

:::caution

It is highly recommended that you avoid using any APIs that are marked as deprecated.

:::

If you continue to use deprecated APIs, your server may become unstable and may not function as expected.
You may also experience performance issues and other problems. To ensure the best possible experience and longevity
of your plugins, it is important to stay up-to-date with the latest API changes and avoid using any APIs
that are marked for deprecation.

API marked with [`@Deprecated`](jd:java:java.lang.Deprecated) should not be used in your code base,
as alternative API may be able to be used instead. While certain API may continue to function despite being deprecated,
it **cannot** be promised that this API won't be marked as deprecated for removal in the future.
```java
@Deprecated
public void exampleMethod(); // Example deprecated method
```

### Deprecated for removal

In addition to being marked as `@Deprecated`, API may be marked as `forRemoval` with a given
[`@ApiStatus.ScheduledForRemoval`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/ApiStatus.ScheduledForRemoval.html) version.
API scheduled for removal should only occur within major release versions of Minecraft.
It is highly recommended you migrate away from API scheduled for removal.

It should be noted, that API scheduled for removal will be given adequate time to allow plugin developers to migrate
away from said API.
```java
@ApiStatus.ScheduledForRemoval(inVersion = "1.20")
@Deprecated(forRemoval = true)
public void exampleMethod(); // Example method marked for removal in 1.20
```

## Deprecation reasons

There are many possible reasons why an API might be deprecated.
Some of the common reasons why API can be deprecated is:

### Old API

As the game evolves, the API may represent concepts that no longer exist in the core game.

Old API is most likely not functional and/or may behave unexpectedly in newer versions of the game,
therefore it may be scheduled for removal.

### Duplicate API

Since Paper used to downstream Spigot, it can occasionally include APIs added by Spigot that clash with what Paper already has.
Typically, Paper will deprecate Spigot’s API in favor of their own API.

However, in cases where upstream offers a more powerful API, Paper’s may be deprecated instead.

### Obsolete API
Paper strives to improve on APIs that may already be included. There may be some cases where we have built new
APIs to offer as a replacement to another.

Obsolete API is expected for function for the far future and may not be scheduled for removal
for a fair amount of time.
