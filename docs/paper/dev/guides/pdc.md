---
slug: /dev/pdc
---

# Persistent Data Container (PDC)

The Persistent Data Container (PDC) is a way to store custom data on a whole range of objects; such as items, entities, and blocks.
The Full list of classes that support the PDC are:

- [Chunk](#chunk)
- [World](#world)
- [Entity](#entity)
- [TileState](#tilestate)
- [ItemMeta](#itemmeta)
- [Structure](#structure)

## What is it used for?
In the past, developers resorted to storing data within the NBT tags of an object. 
This was a very hacky way of storing data, and was prone to having conflicts between different plugins
when they used the same keys. This is resolved by the use of `NamespacedKey`.
Therefore, the PDC is a much more stable way of storing data, and is much easier to use.

As the name implies, the PDC is persistent. This means that the data stored in the PDC will be saved to disk, 
and will be loaded back into the object when the server is restarted. This is great for storing attributes of an object,
such as the owner of an item, or the custom name of an entity.

## Adding Data
To store data in the PDC, there are a few things you need first. The first is a `NamespacedKey` which is used to identify the data.
The second is a `PersistentDataContainer` which is the object you want to store the data on. The third is the data itself.

```java
// Create a NamespacedKey
NamespacedKey key = new NamespacedKey(pluginInstance, "example-key");

ItemStack item = new ItemStack(Material.DIAMOND);
// ItemMeta implements PersistentDataHolder so we can get the PDC from it
ItemMeta meta = item.getItemMeta();
item.getPersistentDataContainer().set(key, PersistentDataType.STRING, "I love Tacos!");
item.setItemMeta(meta);
```

:::note

It is considered good practice to reuse the `NamespacedKey`'s. Constructing them from a static context is ideal for this.

:::

## Getting Data
To get data from the PDC, you need to know the `NamespacedKey` and the `PersistentDataType` of the data.

```java
// Create a NamespacedKey
NamespacedKey key = new NamespacedKey(pluginInstance, "example-key");

ItemStack item = ...; // Retrieve the item from before
// Get the data from the PDC
PeristentDataContainer container = item.getItemMeta().getPersistentDataContainer();
if (container.has(key, PersistentDataType.STRING)) {
    String value = container.get(key, PersistentDataType.STRING);
    // Do something with the value
    player.sendMessage(Compontent.text(value));
}
```

## Data Types

The PDC supports a wide range of data types, such as:
- `Byte`, `Byte Array`
- `Double`
- `Float`
- `Integer`, `Integer Array`
- `Long`, `Long Array`
- `Short`
- `String` 
- There are also `Tag Containers`.
This means that you can store a wide range of data in the PDC. However, If you need a more complex data type, you can
implement your own `PersistentDataType` and use that instead. Here is an example of how to do that for a UUID:

```java
public class UUIDDataType implements PersistentDataType<byte[], UUID> {
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
         ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
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

In order to use your own `PersistentDataType`, you must pass an instance of it to the set/get methods.
```java
container.set(key, new UUIDDataType(), uuid);
```

:::

## Storing on different objects

- ##### Chunk
    - `Chunk#getPersistentDataContainer()`
- ##### World
    - `World#getPersistentDataContainer()`
- ##### Entity
    - `Entity#getPersistentDataContainer()`
- ##### TileState
    - This is slightly more complicated, as you need to cast the block to something that extends `TileState`. 
      This does not work for all blocks, only those that have a tile entity. F.E:
      ```java
        Block block = ...;
        if (block instanceof Chest chest) {
            chest.getPersistentDataContainer().set(key, PersistentDataType.STRING, "I love Tacos!");
            chest.update();
        }
      ```
- ##### Structure
    - `Structure#getPersistentDataContainer()`
- ##### ItemMeta
    - `ItemMeta#getPersistentDataContainer()`#
