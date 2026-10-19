---
title: Registros
description: Guía sobre los registros de Paper y cómo modificarlos.
slug: es/paper/dev/registries
sidebar:
  badge:
    text: Experimental
    variant: danger
---

:::danger[Experimental]
La API del Registro y todo lo que la utilice es actualmente experimental y puede cambiar en el futuro.
:::
## ¿Qué es un registro?

En el contexto de Minecraft, un registro conserva un conjunto de valores del mismo tipo, identificando cada uno mediante una clave. Un ejemplo de dicho registro sería el [Registro ItemType](jd:paper:org.bukkit.Registry#ITEM), que contiene todos los tipos de elementos conocidos. Los registros están disponibles a través de la clase [](jd:paper:io.papermc.paper.registry.RegistryAccess) o estáticamente para registros integrados a través de [](jd:paper:org.bukkit.Registry).

Si bien el servidor y el cliente definen una gran parte de los registros de forma independiente, el servidor define cada vez más y los envía al cliente mientras se une al servidor. Esto permite que el servidor, y en esa medida los complementos, definan contenido personalizado tanto para él como para los clientes que juegan en él. Ejemplos notables incluyen **encantamientos** y **biomas**.

### Recuperar valores de un registro

Para recuperar elementos de un registro, se pueden utilizar sus respectivas claves. La API define dos tipos de claves.
- [](jd:adventure:net.kyori.adventure.key:net.kyori.adventure.key.Key) representa un espacio de nombres y un valor.
- [](jd:paper:io.papermc.paper.registry.TypedKey) envuelve una clave de Aventura,
  pero también incluye la [clave del registro](jd:paper:io.papermc.paper.registry.TypedKey#registryKey()) a la que pertenece el [](jd:paper:io.papermc.paper.registry.TypedKey).

Un ejemplo de cómo recuperar el encantamiento `Sharpness` usando [TypedKeys](jd:paper:io.papermc.paper.registry.TypedKey) se ve a continuación:
```java
// Obtén el registro de encantamientos mediante el acceso a registros.
// Para los registros integrados, las constantes de la clase Registry son equivalentes.
final Registry<Enchantment> registry = RegistryAccess.registryAccess().getRegistry(RegistryKey.ENCHANTMENT);

// Obtén el encantamiento sharpness mediante su clave.
// Puedes sustituir getOrThrow por get si es posible que el registro no contenga ese valor.
final Enchantment enchantment = registry.getOrThrow(TypedKey.create(
    RegistryKey.ENCHANTMENT, Key.key("minecraft:sharpness"))
);

// Igual que arriba, pero con el método de la instancia.
final Enchantment enchantment = registry.getOrThrow(
    RegistryKey.ENCHANTMENT.typedKey(Key.key("minecraft:sharpness"))
);

// Igual que arriba, pero con el método create generado.
// Disponible para registros basados en datos o «escribibles».
// (las vinculadas a un evento del ciclo de vida en RegistryEvents).
final Enchantment enchantment = registry.getOrThrow(
    EnchantmentKeys.create(Key.key("minecraft:sharpness"))
);

// Igual que arriba, pero con claves tipadas generadas.
// Solo las entradas de Vanilla tienen claves generadas; para las entradas personalizadas, debes usar el método anterior.
final Enchantment enchantment = registry.getOrThrow(EnchantmentKeys.SHARPNESS);
```
### Hacer referencia a valores de registro

Hacer referencia a entradas en un registro es más fácil de decir que de hacer. Si bien en la mayoría de los casos, un simple [](jd:java:java.util.Collection) de los valores puede ser suficiente, Minecraft utiliza con mayor frecuencia enfoques alternativos y, por lo tanto, se encontrarán.

Un [](jd:paper:io.papermc.paper.registry.set.RegistrySet) define una colección de elementos que *se relacionan* con un registro.

Su subtipo más común es el [](jd:paper:io.papermc.paper.registry.set.RegistryKeySet) que simplemente retiene [](jd:paper:io.papermc.paper.registry.TypedKey) instancias. Una ventaja de esta estructura de datos es su capacidad de seguir siendo válida incluso si cambian los valores de un registro.

Se puede crear un [](jd:paper:io.papermc.paper.registry.set.RegistryKeySet) mediante los métodos de fábrica en [](jd:paper:io.papermc.paper.registry.set.RegistrySet) como este:
```java
// Crea un conjunto nuevo de claves de registro que contenga una colección de encantamientos.
final RegistryKeySet<Enchantment> bestEnchantments = RegistrySet.keySet(
    RegistryKey.ENCHANTMENT,
    // Claves arbitrarias de encantamientos para guardar en el conjunto de claves.
    EnchantmentKeys.CHANNELING,
    EnchantmentKeys.create(Key.key("papermc:softspoon"))
);
```
Un [](jd:paper:io.papermc.paper.registry.tag.Tag) sigue el concepto de un [](jd:paper:io.papermc.paper.registry.set.RegistryKeySet), pero en sí mismo tiene un nombre y, por lo tanto, se puede hacer referencia a él. Puede encontrar una lista de etiquetas Vanilla [en Minecraft Wiki](https://minecraft.wiki/w/Tag_(Java_Edition)#List_of_tag_types).

## Registros mutantes

Más allá del acceso de lectura simple a los registros, Paper también ofrece una forma para que los complementos modifiquen los registros.
:::caution
La mutación de los registros debe realizarse durante la fase de arranque del servidor. Como tal, esta sección solo se aplica a los [complementos de Paper](/es/paper/dev/getting-started/paper-plugins).

**Las excepciones** lanzadas por los complementos durante esta fase harán que el servidor se apague antes de cargar, ya que los valores faltantes o las modificaciones en los registros provocarían la pérdida de datos.
:::

:::note
La mutación de registros se realiza a través de [](jd:paper:io.papermc.paper.plugin.lifecycle.event.LifecycleEventManager). Consulte la página [Eventos del ciclo de vida](/es/paper/dev/lifecycle) para obtener más información.
:::
El punto de entrada general para los registros mutantes es el tipo [](jd:paper:io.papermc.paper.registry.event.RegistryEvents), que proporciona un punto de entrada para cada registro que se puede modificar. La modificación de un registro puede adoptar dos formas diferentes.

### Crear nuevas entradas

La creación de nuevas entradas se realiza a través del [`compose` evento de ciclo de vida](jd:paper:io.papermc.paper.registry.event.RegistryEventProvider#compose()) en los registros respectivos. El evento de redacción se llama después de que el contenido de un registro se haya cargado desde fuentes "básicas", como el paquete de datos integrado o cualquier paquete de datos detectado y habilitado. Por lo tanto, los complementos pueden registrar sus propias entradas en este punto. El siguiente ejemplo muestra cómo crear un nuevo encantamiento:
```java title="ExamplePluginBootstrap.java"
public final class ExamplePluginBootstrap implements PluginBootstrap {

    @Override
    public void bootstrap(final BootstrapContext context) {
        // Registra un handler nuevo para el evento compose del ciclo de vida del registro de encantamientos.
        context.getLifecycleManager().registerEventHandler(RegistryEvents.ENCHANTMENT.compose(), event -> {
            event.registry().register(
                // La clave del registro.
                // Los plugins deben usar su propio espacio de nombres en lugar de minecraft o papermc.
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
        });
    }
}
```
### Modificar entradas existentes

La modificación de entradas existentes es útil para complementos que tienen como objetivo cambiar la forma en que se comportan las entradas Vanilla. Para ello, utilice el [`entryAdd` evento de ciclo de vida](jd:paper:io.papermc.paper.registry.event.RegistryEventProvider#entryAdd()). El evento se llama para _\*cualquier\*_ entrada agregada a un registro; sin embargo, la API proporciona una manera fácil de apuntar a una entrada específica para su modificación. El siguiente ejemplo muestra cómo aumentar el nivel máximo del encantamiento `Sharpness`.
```java
@Override
public void bootstrap(final BootstrapContext context) {
    context.getLifecycleManager().registerEventHandler(RegistryEvents.ENCHANTMENT.entryAdd()
        // Aumenta el nivel máximo a 20.
        .newHandler(event -> event.builder().maxLevel(20))
        // Configura el handler para que solo se invoque con el encantamiento sharpness de Vanilla.
        .filter(EnchantmentKeys.SHARPNESS)
    );
}
```
