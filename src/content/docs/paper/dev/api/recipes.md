---
title: Recipes
description: How to create and manage recipes.
slug: paper/dev/recipes
---

Recipes are a way to define a way to craft a particular item. They are defined by a plugin or
datapack, however we are only going to cover the plugin side of things here.

## [`ShapedRecipe`](jd:paper:org.bukkit.inventory.ShapedRecipe)

A shaped recipe is a recipe that requires a specific pattern of items in the crafting grid to craft an item.
These are created using a pattern string and a map of characters to items. The pattern strings are 3,
3-character strings that represent the rows of the crafting grid. They can be created as follows:

```java title="TestPlugin.java"
public class TestPlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        NamespacedKey key = new NamespacedKey(this, "television");

        ItemStack item = ItemStack.of(Material.BLACK_WOOL);
        item.setData(DataComponentTypes.ITEM_NAME, Component.text("Television"));

        ShapedRecipe recipe = new ShapedRecipe(key, item);
        recipe.shape("AAA", "ABA", "AAA");
        recipe.setIngredient('A', Material.WHITE_CONCRETE);
        recipe.setIngredient('B', Material.BLACK_STAINED_GLASS_PANE);

        getServer().addRecipe(recipe);
    }
}
```

This recipe would require a television to be crafted with one black stained glass pane surrounded 
by white concrete. The result would look like this in the crafting grid:

```
AAA
ABA 
AAA
```

:::note

You do not need to register the recipe within your plugin's `onEnable` method, You can register it
at any time. However, if you do not register it after the plugin has been enabled and there are
players online, you will need to either resend all the recipes to the players or use the boolean
parameter in the [`addRecipe`](jd:paper:org.bukkit.Server#addRecipe(org.bukkit.inventory.Recipe,boolean))
method to update all players with the new recipe.

:::

:::caution

You cannot use Air as a material in a shaped recipe, this will cause an error.

:::


## [`ShapelessRecipe`](jd:paper:org.bukkit.inventory.ShapelessRecipe)

A shapeless recipe is a recipe that requires a specific number of items in the crafting grid to craft an item.
These are created using a list of items. They can be created as follows:

```java title="TestPlugin.java"
public class TestPlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        NamespacedKey key = new NamespacedKey(this, "WarriorSword");
        ItemStack item = ItemStack.of(Material.DIAMOND_SWORD);

        ShapelessRecipe recipe = new ShapelessRecipe(key, item);
        recipe.addIngredient(3, Material.DIAMOND);
        recipe.addIngredient(2, Material.STICK);

        getServer().addRecipe(recipe);
    }
}
```

This recipe declares that you simply need 3 diamonds and 2 sticks to craft the item, without any specific
orientation of the cross pattern in the crafting grid. This could be crafted in any of the following ways:
```
  DSS   |   SDS   |   S D
  D     |   D     |   D
  D     |   D     |   D S
```
And, any other composition of the 5 items.
