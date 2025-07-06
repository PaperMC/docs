---
title: Persistent data container (PDC)
description: A guide to the PDC API for storing data.
slug: paper/dev/pdc
version: "1.21.4 and below"
---

The Persistent Data Container (PDC) is a way to store custom data on a whole range of objects; such as items, entities, and block entities.
The full list of classes that support the PDC are:

- [`ItemStack`](#itemstack)
- [`Chunk`](#chunk)
- [`World`](#world)
- [`Entity`](#entity)
- [`TileState`](#tilestate)
- [`Structure`](#structure)
- [`GeneratedStructure`](#generatedstructure)
- [`Raid`](#raid)
- [`OfflinePlayer`](#offlineplayer)
- [`ItemMeta`](#itemmeta)

## What is it used for?
In the past, developers resorted to a variety of methods to store custom data on objects:

- NBT tags: Requires reflection to access internals and was generally unreliable in the long term.
- Lore and display names: Prone to collisions as well as slow to access.

The benefit of the PDC is that it allows for a more reliable and performant way to store arbitrary data on objects.
It also doesn't rely on accessing server internals, so it's less likely to break on future versions. It also removes the need to
manually track the data lifecycle, as, for example with an entity, the PDC will be saved when the entity unloads.

## Adding data
To store data in the PDC, there are a few things you need first. The first is a [`NamespacedKey`](jd:paper:org.bukkit.NamespacedKey),
which is used to identify the data. The second is a [`PersistentDataContainer`](jd:paper:org.bukkit.persistence.PersistentDataContainer),
which is the object you want to store the data on. The third is the data itself.

```java
// Create a NamespacedKey
NamespacedKey key = new NamespacedKey(pluginInstance, "example-key");

World world = Bukkit.getServer().getWorlds().getFirst();

PersistentDataContainer pdc = world.getPersistentDataContainer();

pdc.set(key, PersistentDataType.STRING, "I love Tacos!");
```

[`ItemStack`](jd:paper:org.bukkit.inventory.ItemStack) however doesn't have this method and instead requires you to use its builder-style consumer:

```java
NamespacedKey key = ...; // Retrieve the key from before

// For 1.20.4 and below, use 'new ItemStack(Material.DIAMOND)' instead
ItemStack item = ItemType.DIAMOND.createItemStack();
// ItemStack provides a util method, so we can directly edit its PDC
item.editPersistentDataContainer(pdc -> {
    pdc.set(key, PersistentDataType.STRING, "I love Tacos!");
});
```

:::note

The [`ItemStack#editPersistentDataContainer()`](jd:paper:org.bukkit.inventory.ItemStack#editPersistentDataContainer(java.util.function.Consumer)) method on `ItemStack` is only available in 1.21.4+. For older versions, you need to access and modify the `ItemMeta` instead.
For 1.16.5+, there's the [`ItemStack#editMeta()`](jd:paper:org.bukkit.inventory.ItemStack#editMeta(java.util.function.Consumer)) method though.

:::

:::note

It is considered good practice to reuse `NamespacedKey` objects. They can be constructed with either:
- A [`Plugin`](jd:paper:org.bukkit.plugin.Plugin) instance and a [`String`](jd:java:java.lang.String) identifier
- A [`String`](jd:java:java.lang.String) namespace and a [`String`](jd:java:java.lang.String) identifier

The first option is often preferred as it will automatically use the plugin's lowercased name as namespace; however, the second option can be used if you
want to use a different namespace or access the data from another plugin.

:::

## Getting data
To get data from the PDC, you need to know the `NamespacedKey` and the `PersistentDataType` of the data.

```java
// Create a NamespacedKey
NamespacedKey key = new NamespacedKey(pluginInstance, "example-key");

ItemStack item = ...; // Retrieve the item from before
// Get the data from the PDC. Do note that ItemStack provides a "view", which is read-only
PersistentDataContainerView containerView = item.getPersistentDataContainer();
if (containerView.has(key, PersistentDataType.STRING)) {
    String value = containerView.get(key, PersistentDataType.STRING);
    // Do something with the value
    player.sendMessage(Component.text(value));
}
```

:::note

The [`ItemStack#getPersistentDataContainer()`](jd:paper:org.bukkit.inventory.ItemStack#getPersistentDataContainer()) method on `ItemStack` is only available in 1.21.1+. For older versions, you need to access and modify the `ItemMeta` instead.

:::

## Data types

The PDC supports a wide range of data types, such as:
- `Byte`, `Byte Array`
- `Double`
- `Float`
- `Integer`, `Integer Array`
- `Long`, `Long Array`
- `Short`
- `String`
- `Boolean`
- `Tag Containers` - a way to nest PDCs within each other. To create a new `PersistentDataContainer`, you can use:
  ```java
  // Get the existing container
  PersistentDataContainer container = ...;
  // Create a new container
  PersistentDataContainer newContainer = container.getAdapterContext().newPersistentDataContainer();
  ```
- `Lists` - a way to represent lists of data that can be stored via another persistent data type. You may create them via:
  ```java
  // Storing a list of strings in a container by verbosely creating
  // a list data type wrapping the string data type.
  container.set(
      key,
      PersistentDataType.LIST.listTypeFrom(PersistentDataType.STRING),
      List.of("a", "list", "of", "strings")
  );

  // Storing a list of strings in a container by using the api
  // provided pre-definitions of commonly used list types.
  container.set(key, PersistentDataType.LIST.strings(), List.of("a", "list", "of", "strings"));

  // Retrieving a list of strings from the container.
  List<String> strings = container.get(key, PersistentDataType.LIST.strings());
  ```

:::note[Boolean `PersistentDataType`]

The [`Boolean`](jd:paper:org.bukkit.persistence.PersistentDataType#BOOLEAN) PDC type exists for convenience
- you cannot make more complex types distill to a `Boolean`.

:::

### Custom data types

You can store a wide range of data in the PDC with the native adapters; however, if you need a more complex data type, you can
implement your own [`PersistentDataType`](jd:paper:org.bukkit.persistence.PersistentDataType) and use that instead.
The `PersistentDataType`'s job is to "deconstruct" a complex data type into something that is natively supported (see above) and then vice-versa.

Here is an example of how to do that for a UUID:

```java title="UUIDDataType.java"
@NullMarked
public class UUIDDataType implements PersistentDataType<byte[], UUID> {

    public static final UUIDDataType INSTANCE = new UUIDDataType();

    // We just need a singleton, so there's no need to allow instantiation
    private UUIDDataType() {}

    @Override
    public Class<byte[]> getPrimitiveType() {
        return byte[].class;
    }

    @Override
    public Class<UUID> getComplexType() {
        return UUID.class;
    }

    @Override
    public byte[] toPrimitive(UUID complex, PersistentDataAdapterContext context) {
        ByteBuffer bb = ByteBuffer.allocate(Long.BYTES * 2);
        bb.putLong(complex.getMostSignificantBits());
        bb.putLong(complex.getLeastSignificantBits());
        return bb.array();
    }

    @Override
    public UUID fromPrimitive(byte[] primitive, PersistentDataAdapterContext context) {
        ByteBuffer bb = ByteBuffer.wrap(primitive);
        long firstLong = bb.getLong();
        long secondLong = bb.getLong();
        return new UUID(firstLong, secondLong);
    }
}
```

:::note

In order to use your own `PersistentDataType`, you must pass an instance of it to the
[`get`](jd:paper:io.papermc.paper.persistence.PersistentDataContainerView#get(org.bukkit.NamespacedKey,org.bukkit.persistence.PersistentDataType))/
[`set`](jd:paper:org.bukkit.persistence.PersistentDataContainer#set(org.bukkit.NamespacedKey,org.bukkit.persistence.PersistentDataType,C))/
[`has`](jd:paper:io.papermc.paper.persistence.PersistentDataContainerView#has(org.bukkit.NamespacedKey,org.bukkit.persistence.PersistentDataType)) methods.
```java
container.set(key, UUIDDataType.INSTANCE, uuid);
```

:::


## Read-only containers
:::note

Certain classes, like `ItemStack` or [`OfflinePlayer`](jd:paper:org.bukkit.OfflinePlayer), provide a read-only view of their PDC.
In contrast to `ItemStack`, `OfflinePlayer` does <u>not</u> provide any way to modify the underlying container.

:::

## Storing on different objects

:::caution

Data is **not** copied across holders for you, and needs to be **manually** copied if 'moving' between PersistentDataHolders.

E.g. Placing an ItemStack as a Block (with a TileState) ***does not*** copy over PDC data.

:::

Objects that can have a PDC implement the [`PersistentDataHolder`](jd:paper:org.bukkit.persistence.PersistentDataHolder) interface
and their PDC can be fetched with [`PersistentDataHolder#getPersistentDataContainer()`](jd:paper:org.bukkit.persistence.PersistentDataHolder#getPersistentDataContainer()).

- ##### [`ItemStack`](jd:paper:org.bukkit.inventory.ItemStack)
    - The persistent data container of an `ItemStack` has historically been accessed by
      the `ItemStack`'s `ItemMeta`. This, however, includes the overhead of constructing the entire `ItemMeta`, which acts as a snapshot of the `ItemStack`'s data at the point of creation.

      To avoid this overhead in 1.21.1+, ItemStack exposes a read-only view of its persistent data container at `ItemStack#getPersistentDataContainer()`.
      Edits to the persistent data container can also be simplified in 1.21.4+ using `ItemStack#editPersistentDataContainer(java.util.function.Consumer)`.
      The persistent data container available in the consumer is not valid outside the consumer.
      ```java
      ItemStack itemStack = ...;
      itemStack.editPersistentDataContainer(pdc -> {
          pdc.set(key, PersistentDataType.STRING, "I love Tacos!");
      });
      ```
- ##### [`Chunk`](jd:paper:org.bukkit.Chunk)
    - `Chunk#getPersistentDataContainer()`
- ##### [`World`](jd:paper:org.bukkit.World)
    - `World#getPersistentDataContainer()`
- ##### [`Entity`](jd:paper:org.bukkit.entity.Entity)
    - `Entity#getPersistentDataContainer()`
- ##### [`TileState`](jd:paper:org.bukkit.block.TileState)
    - This is slightly more complicated, as you need to cast the block's state to something that extends `TileState`.
      This does not work for all blocks, only those that have a block entity.
      ```java
      Block block = ...;
      if (block.getState() instanceof Chest chest) {
          chest.getPersistentDataContainer().set(key, PersistentDataType.STRING, "I love Tacos!");
          chest.update();
      }
      ```
- ##### [`Structure`](jd:paper:org.bukkit.structure.Structure)
    - `Structure#getPersistentDataContainer()`
- ##### [`GeneratedStructure`](jd:paper:org.bukkit.generator.structure.GeneratedStructure)
    - `GeneratedStructure#getPersistentDataContainer()`
- ##### [`Raid`](jd:paper:org.bukkit.Raid)
    - `Raid#getPersistentDataContainer()`
- ##### [`OfflinePlayer`](jd:paper:org.bukkit.OfflinePlayer)
    - OfflinePlayer only exposes a read-only version of the persistent data container.
      It can be accessed via `OfflinePlayer#getPersistentDataContainer()`.
- ##### [`ItemMeta`](jd:paper:org.bukkit.inventory.meta.ItemMeta)
    - `ItemMeta#getPersistentDataContainer()`
