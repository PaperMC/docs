---
title: Recetas
description: Cómo crear y gestionar recetas.
slug: es/paper/dev/recipes
---
Las recetas son una forma de definir una forma de elaborar un artículo en particular. Están definidos por un complemento o paquete de datos; sin embargo, aquí solo cubriremos el lado del complemento.

## [](jd:paper:org.bukkit.inventory.ShapedRecipe)

Una receta con forma es una receta que requiere un patrón específico de elementos en la cuadrícula de elaboración para elaborar un elemento. Estos se crean utilizando una cadena de patrón y un mapa de caracteres para elementos. Las cadenas de patrones son cadenas de 3 caracteres que representan las filas de la cuadrícula de elaboración. Se pueden crear de la siguiente manera:
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        NamespacedKey key = new NamespacedKey(this, "television");

        ItemStack result = ItemStack.of(Material.BLACK_WOOL);
        result.setData(DataComponentTypes.ITEM_NAME, Component.text("Television"));

        ShapedRecipe recipe = new ShapedRecipe(key, result);
        recipe.shape(
            "AAA",
            "ABA",
            "AAA"
        );
        recipe.setIngredient('A', Material.WHITE_CONCRETE);
        recipe.setIngredient('B', Material.BLACK_STAINED_GLASS_PANE);

        this.getServer().addRecipe(recipe);
    }
}
```
Esta receta requeriría que un televisor estuviera fabricado con un panel de vidriera negro rodeado de concreto blanco. La receta se vería así en la cuadrícula de elaboración:
```
AAA
ABA
AAA
```
<!-- TODO: esta nota está desactualizada en versiones recientes; consulta el TODO en Server#addRecipe, que ahora siempre vuelve a enviar las recetas. Hay que esperar a resolverlo. -->
:::note
No necesita registrar la receta dentro del método `onEnable` de su complemento. Puede registrarla en cualquier momento. Sin embargo, si no lo registra después de habilitar el complemento y hay jugadores en línea, deberá reenviar todas las recetas a los jugadores o usar el parámetro booleano en el método [`addRecipe`](jd:paper:org.bukkit.Server#addRecipe(org.bukkit.inventory.Recipe,boolean)) para actualizar todos los jugadores con la nueva receta.
:::

:::caution
No puedes usar `minecraft:air` como ingrediente en una receta con forma, esto causará un error; simplemente deja un espacio en el patrón de la forma.
:::
## [](jd:paper:org.bukkit.inventory.ShapelessRecipe)

Una receta sin forma es una receta que requiere una cantidad específica de elementos en la cuadrícula de elaboración para elaborar un elemento. Estos se crean utilizando una lista de elementos. Se pueden crear de la siguiente manera:
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        NamespacedKey key = new NamespacedKey(this, "warrior_sword");
        ItemStack result = ItemStack.of(Material.DIAMOND_SWORD);

        ShapelessRecipe recipe = new ShapelessRecipe(key, result);
        recipe.addIngredient(3, Material.DIAMOND);
        recipe.addIngredient(2, Material.STICK);

        this.getServer().addRecipe(recipe);
    }
}
```
Esta receta declara que simplemente necesitas 3 diamantes y 2 palos para elaborar el artículo, sin ninguna orientación específica del patrón cruzado en la cuadrícula de elaboración. Esto podría elaborarse de cualquiera de las siguientes maneras:
```
  DSS   |   SDS   |   S D
  D     |   D     |   D
  D     |   D     |   D S
```
Y, cualquier otra composición de los 5 ítems.
