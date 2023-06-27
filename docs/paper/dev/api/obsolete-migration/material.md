---
slug: /dev/material
---

# Material Migration Guide

Material was originally built when every single item had a corresponding block.
However, on modern versions of Material, this is no longer the case. 
It’s important to understand that from now on, what was once called Material is now split into two categories: ``ItemType`` and ``BlockType``.

This guide is meant to outline some of the steps you can take in your codebase in order to remove usage of the now deprecated 
Material API. All places in the API that once used Material now only take an ItemType or a BlockType depending on the context.

## ItemType
ItemType represents a type of Item that can only be given in an inventory and may not have a physical block in the world. 
In contexts where Material was previously used in inventories or ItemStacks, ItemType may be used instead.

#### Before
```java
new ItemStack(Material.AIR);
```
#### After
```java
ItemStack.of(ItemType.AIR);
```

## BlockType
BlockType represents a type of Block that can only be placed in the physical world and does not have a corresponding 
item that can be put in an inventory. In contexts where Material was previously used with Blocks, BlockType may be used instead.

#### Before
```java
Material block = blockData.getMaterial();
```

#### After
```java
BlockType block = blockData.getType();
```

## Enum Language Features

Due to Material being an enum and the BlockType/ItemType equivalents being based on namespaced key fields, alternatives will need to be used.

### Collections
Previously, you could use enum collections (i.e ``EnumSet``, ``EnumMap``) to more efficiently store enums. Due to the fact
that ItemType and BlockType are no longer enums, alternative collection types will need to be used.

If you need to have combined collection with both block and item types, you can use the common ``Keyed`` interface.


## Switch Statements
Switch statements will unfourtently need to replaced by a more cumbersome approach of if statements. It's encouraged to try
to use sets whenever possible here, to avoid massive chains of if statements.

TODO: Maybe mark something about the tag api? Maybe we can add our own tags and encourage people to register those.

```java
return switch (material) {
            case POTATO:
            case POTATOES:
            case CARROT:
            case CARROTS:
                yield true;
            default:
                yield false;
        };
```


