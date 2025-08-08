---
title: Registries
description: A guide to registries and their modification on Paper.
slug: paper/dev/registries
sidebar:
  badge:
    text: Experimental
    variant: danger
---

:::danger[Experimental]
The Registry API and anything that uses it is currently experimental and may change in the future.
:::

## What is a registry?

In the context of Minecraft, a registry holds onto a set of values of the same type, identifying
each by a key. An example of such a registry would be the [ItemType registry](jd:paper:org.bukkit.Registry#ITEM) which holds all known item types.
Registries are available via the [RegistryAccess](jd:paper:io.papermc.paper.registry.RegistryAccess) class.

While a large portion of registries are defined by the server and client independently, more and
more are defined by the server and sent to the client while joining the server.
This enables the server, and to that extent plugins, to define custom content for both itself and
clients playing on it.
Notable examples include **enchantments** and **biomes**.

### Retrieving values from a registry

To retrieve elements from a registry, their respective keys can be used.
The API defines two types of keys.
- `net.kyori.adventure.key.Key` represents a namespace and a key.
- [TypedKey](jd:paper:io.papermc.paper.registry.TypedKey) wraps an Adventure key,
  but also includes the [key of
  the registry](jd:paper:io.papermc.paper.registry.TypedKey#registryKey()) the
  [TypedKey](jd:paper:io.papermc.paper.registry.TypedKey) belongs to.

An example of retrieving the `Sharpness` enchantment using
[TypedKeys](jd:paper:io.papermc.paper.registry.TypedKey) looks as follows:

```java
// Fetch the enchantment registry from the registry access
final Registry<Enchantment> enchantmentRegistry = RegistryAccess
    .registryAccess()
    .getRegistry(RegistryKey.ENCHANTMENT);

// Get the sharpness enchantment using its key.
// getOrThrow may be replaced with get if the registry may not contain said value
final Enchantment enchantment = enchantmentRegistry.getOrThrow(TypedKey.create(
    RegistryKey.ENCHANTMENT, Key.key("minecraft:sharpness"))
);

// Same as above, but using the instance's method
final Enchantment enchantment = enchantmentRegistry.getOrThrow(
    RegistryKey.ENCHANTMENT.typedKey(Key.key("minecraft:sharpness"))
);

// Same as above, but using generated create method
// available for data-driven registries or "writable" ones
// (those bound to a lifecycle event in RegistryEvents).
final Enchantment enchantment = enchantmentRegistry.getOrThrow(
    EnchantmentKeys.create(Key.key("minecraft:sharpness"))
);

// Same as above too, but using generated typed keys.
// Only Vanilla entries have generated keys, for custom entries, the above method must be used.
final Enchantment enchantment = enchantmentRegistry.getOrThrow(EnchantmentKeys.SHARPNESS);
```

### Referencing registry values

Referencing entries in a registry is easier said than done.
While in most cases, a plain [Collection](jd:java:java.util.Collection) of the values might suffice, alternative approaches are
more often used by Minecraft and will hence be encountered.

A [`RegistrySet`](jd:paper:io.papermc.paper.registry.set.RegistrySet) defines a
collection of elements that *relate* to a registry.

Its most common subtype is the
[`RegistryKeySet`](jd:paper:io.papermc.paper.registry.set.RegistryKeySet) which
simply holds onto [TypedKey](jd:paper:io.papermc.paper.registry.TypedKey) instances.
An advantage of this data structure is its ability to remain valid even if the values of a
registry change.

A [`RegistryKeySet`](jd:paper:io.papermc.paper.registry.set.RegistryKeySet) can be
created via the factory methods on [`RegistrySet`](jd:paper:io.papermc.paper.registry.set.RegistrySet) like this:
```java
// Create a new registry key set that holds a collection enchantments
final RegistryKeySet<Enchantment> bestEnchantments = RegistrySet.keySet(
    RegistryKey.ENCHANTMENT,
    // Arbitrary keys of enchantments to store in the key set.
    EnchantmentKeys.CHANNELING,
    EnchantmentKeys.create(Key.key("papermc:softspoon"))
);
```

A [`Tag`](jd:paper:io.papermc.paper.registry.tag.Tag) follows up the concept
of a [`RegistryKeySet`](jd:paper:io.papermc.paper.registry.set.RegistryKeySet)
but is itself named and can hence be referenced.
A list of Vanilla tags can be found [on the Minecraft wiki](https://minecraft.wiki/w/Tag#Java_Edition_2).

## Mutating registries

Beyond plain reading access to registries, Paper also offers a way for plugins to modify registries.

:::caution
Mutating registries needs to be done during the server's bootstrap phase.
As such, this section is only applicable to [Paper plugins](/paper/dev/getting-started/paper-plugins).

**Exceptions** thrown by plugins during this phase will cause the server to shutdown before loading,
as missing values or modifications to the registries would otherwise cause data loss.
:::

:::note
Mutating registries is done via the
[LifecycleEventManager](jd:paper:io.papermc.paper.plugin.lifecycle.event.LifecycleEventManager).
See the [Lifecycle Events](/paper/dev/lifecycle) page for more information.
:::

The general entrypoint for mutating registries is
the [RegistryEvents](jd:paper:io.papermc.paper.registry.event.RegistryEvents) type,
which provides an entry point for each registry that can be modified.
Modification of a registry can take two different forms.

### Create new entries

Creating new entries is done via the [`compose` lifecycle event](jd:paper:io.papermc.paper.registry.event.RegistryEventProvider#compose())
on the respective registries.
The compose event is called after a registry's content has been loaded from "vanilla" sources, like the built-in
datapack or any detected, enabled, datapacks. Plugins can hence register their own entries at this point.
The following example shows how to create a new enchantment:

```java title="TestPluginBootstrap.java"
public class TestPluginBootstrap implements PluginBootstrap {

    @Override
    public void bootstrap(BootstrapContext context) {
        // Register a new handler for the compose lifecycle event on the enchantment registry
        context.getLifecycleManager().registerEventHandler(RegistryEvents.ENCHANTMENT.compose().newHandler(event -> {
            event.registry().register(
                // The key of the registry
                // Plugins should use their own namespace instead of minecraft or papermc
                EnchantmentKeys.create(Key.key("papermc:pointy")),
                b -> b.description(Component.text("Pointy"))
                    .supportedItems(event.getOrCreateTag(ItemTypeTagKeys.SWORDS))
                    .anvilCost(1)
                    .maxLevel(25)
                    .weight(10)
                    .minimumCost(EnchantmentRegistryEntry.EnchantmentCost.of(1, 1))
                    .maximumCost(EnchantmentRegistryEntry.EnchantmentCost.of(3, 1))
                    .activeSlots(EquipmentSlotGroup.ANY)
            );
        }));
    }
}
```

### Modifying existing entries

Modification of existing entries is useful for plugins that aim to change the way Vanilla entries
behave. For this, use the [`entryAdd` lifecycle event](jd:paper:io.papermc.paper.registry.event.RegistryEventProvider#entryAdd()).
The event is called for _\*any\*_ entry added to a registry, however the API provides an easy way to target a specific entry for modification.
The following example shows how to increase the maximum level of the `Sharpness` enchantment.

```java
@Override
public void bootstrap(BootstrapContext context) {
    context.getLifecycleManager().registerEventHandler(RegistryEvents.ENCHANTMENT.entryAdd()
        // Increase the max level to 20
        .newHandler(event -> event.builder().maxLevel(20))
        // Configure the handler to only be called for the Vanilla sharpness enchantment.
        .filter(EnchantmentKeys.SHARPNESS)
    );
}
```
