---
title: Contenedor de datos persistentes (PDC)
description: Una guía de la API de PDC para almacenar datos.
slug: es/paper/dev/pdc
version: 1.21.8
---
El contenedor de datos persistentes (PDC) permite guardar datos personalizados en distintos objetos, como objetos del inventario, entidades y entidades de bloque. Estas son las clases compatibles:

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

## ¿Para qué se utiliza?
Antes del PDC, los desarrolladores usaban varios métodos para guardar datos personalizados en objetos:

- Etiquetas NBT: requieren reflexión para acceder a los datos internos y pueden dejar de funcionar entre versiones.
- Lore y nombres visibles: pueden entrar en conflicto con los datos de otros plugins y son lentos de consultar.

El PDC ofrece una forma fiable y eficiente de asociar datos arbitrarios a los objetos. No depende de las estructuras internas del servidor, así que es menos probable que se rompa entre versiones. Además, el servidor gestiona el ciclo de vida de los datos: por ejemplo, guarda el PDC de una entidad cuando esta se descarga.

## Agregar datos
Para guardar datos en el PDC, necesitas tres elementos: un [](jd:paper:org.bukkit.NamespacedKey) que identifique los datos, un [](jd:paper:org.bukkit.persistence.PersistentDataContainer) donde guardarlos y los propios datos.
```java
NamespacedKey key = new NamespacedKey(pluginInstance, "example_key"); // Create a NamespacedKey
World world = Bukkit.getServer().getWorlds().getFirst();

PersistentDataContainer pdc = world.getPersistentDataContainer();
pdc.set(key, PersistentDataType.STRING, "I love tacos!");
```
[](jd:paper:org.bukkit.inventory.ItemStack), en cambio, no ofrece ese método. Para modificar su PDC, usa el consumidor de `editPersistentDataContainer()`:
```java
NamespacedKey key = ...;

// Para la versión 1.20.4 y anteriores, usa 'new ItemStack(Material.DIAMOND)'.
ItemStack item = ItemStack.of(Material.DIAMOND);
item.editPersistentDataContainer(pdc -> {
    pdc.set(key, PersistentDataType.STRING, "I love tacos!");
});
```

:::note
El método [`ItemStack#editPersistentDataContainer()`](jd:paper:org.bukkit.inventory.ItemStack#editPersistentDataContainer(java.util.function.Consumer)) está disponible a partir de 1.21.4. En versiones anteriores, accede a [](jd:paper:org.bukkit.inventory.meta.ItemMeta) y modifícalo con [`ItemStack#editMeta()`](jd:paper:org.bukkit.inventory.ItemStack#editMeta(java.util.function.Consumer)), disponible desde 1.16.5.
:::

:::note
Es recomendable reutilizar los objetos `NamespacedKey`. Puedes crearlos con:
- Una instancia [](jd:paper:org.bukkit.plugin.Plugin) y un identificador
- Un espacio de nombres y un identificador.

La primera opción usa automáticamente el nombre del plugin, en minúsculas, como espacio de nombres. Usa la segunda si necesitas otro espacio de nombres o quieres acceder a datos de otro plugin.
:::
## Obteniendo datos
Para leer datos del PDC, necesitas conocer su `NamespacedKey` y su [](jd:paper:org.bukkit.persistence.PersistentDataType). Algunas API, como [](jd:adventure:net.kyori.adventure.text.Component#text(java.lang.String)), requieren valores no nulos. En esos casos, usa [`getOrDefault`](jd:paper:io.papermc.paper.persistence.PersistentDataContainerView#getOrDefault(org.bukkit.NamespacedKey,org.bukkit.persistence.PersistentDataType,C)) en lugar de [`get`](jd:paper:io.papermc.paper.persistence.PersistentDataContainerView#get(org.bukkit.NamespacedKey,org.bukkit.persistence.PersistentDataType)), que puede devolver `null`.
```java
NamespacedKey key = ...; // Usa la misma clave que en el ejemplo de añadir datos
World world = ...; // Usa el mismo mundo que en el ejemplo de añadir datos

PersistentDataContainer pdc = world.getPersistentDataContainer();

// Usa los datos del PDC.
String value = pdc.getOrDefault(key, PersistentDataType.STRING, "<null>");

// Haz algo con el valor.
player.sendPlainMessage(value);
```
## tipos de datos

El PDC admite una amplia gama de tipos de datos, como por ejemplo:
- `Byte`, `Byte Array`
- `Double`
- `Float`
- `Integer`, `Integer Array`
- `Long`, `Long Array`
- `Short`
- `String`
- `Boolean`
- `Tag Containers`: una forma de anidar PDC entre sí. Para crear un nuevo `PersistentDataContainer`, puede utilizar:
  ```java
  // Obtén un contenedor existente.
  PersistentDataContainer container = ...;
  // Crea un contenedor nuevo.
  PersistentDataContainer newContainer = container.getAdapterContext().newPersistentDataContainer();
  ```
- `Lists`: una forma de representar listas de datos que se pueden almacenar mediante otro tipo de datos persistentes. Puedes crearlos a través de:
  ```java
  // Guarda una lista de cadenas en un contenedor creando explícitamente
  // un tipo de datos de lista que contiene cadenas.
  container.set(
      key,
      PersistentDataType.LIST.listTypeFrom(PersistentDataType.STRING),
      List.of("a", "list", "of", "strings")
  );

  // Guarda una lista de cadenas en un contenedor mediante la API.
  // usando las definiciones preestablecidas de los tipos de lista más comunes.
  container.set(key, PersistentDataType.LIST.strings(), List.of("a", "list", "of", "strings"));

  // Obtén una lista de cadenas del contenedor.
  List<String> strings = container.get(key, PersistentDataType.LIST.strings());
  ```

:::note[Boolean `PersistentDataType`]
El tipo PDC [`Boolean`](jd:paper:org.bukkit.persistence.PersistentDataType#BOOLEAN) existe por conveniencia
- No se pueden destilar tipos más complejos en un `Boolean`.
:::
### Tipos de datos personalizados

Puede almacenar una amplia gama de datos en el PDC con los adaptadores nativos; sin embargo, si necesita un tipo de datos más complejo, puede implementar su propio `PersistentDataType` y usarlo en su lugar. El trabajo del `PersistentDataType` es "deconstruir" un tipo de datos complejo en algo que sea compatible de forma nativa (ver arriba) y luego viceversa.

A continuación se muestra un ejemplo de cómo hacerlo para un UUID:
```java title="UUIDDataType.java"
public class UUIDDataType implements PersistentDataType<byte[], UUID> {

    public static final UUIDDataType INSTANCE = new UUIDDataType();

    // Solo necesitamos una instancia, así que no hace falta permitir que se creen más.
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
Para utilizar su propio `PersistentDataType`, debe pasar una instancia del mismo al [`get`](jd:paper:io.papermc.paper.persistence.PersistentDataContainerView#get(org.bukkit.NamespacedKey,org.bukkit.persistence.PersistentDataType))/ [`set`](jd:paper:org.bukkit.persistence.PersistentDataContainer#set(org.bukkit.NamespacedKey,org.bukkit.persistence.PersistentDataType,C))/ [`has`](jd:paper:io.papermc.paper.persistence.PersistentDataContainerView#has(org.bukkit.NamespacedKey,org.bukkit.persistence.PersistentDataType)) métodos.
```java
container.set(key, UUIDDataType.INSTANCE, uuid);
```

:::
## Contenedores de solo lectura

Ciertas clases, como `ItemStack` o [](jd:paper:org.bukkit.OfflinePlayer), proporcionan una vista de solo lectura de su PDC. A diferencia de `ItemStack`, `OfflinePlayer` <u>no</u> proporciona ninguna forma de modificar el contenedor subyacente. Esto se debe a que el archivo `OfflinePlayer` se lee directamente desde el disco y requeriría una operación de bloqueo del archivo. Los objetos mutables, como [](jd:paper:org.bukkit.persistence.PersistentDataHolder#getPersistentDataContainer()), generalmente deben volver a guardarse incluso sin modificaciones ni supervisión. Por eso es mejor utilizar "vistas" no modificables para operaciones de sólo lectura.
```java
NamespacedKey key = ...;
ItemStack item = ...;

PersistentDataContainerView pdcView = item.getPersistentDataContainer();

// Usa la «vista» de datos del PDC.
String value = pdcView.getOrDefault(key, PersistentDataType.STRING, "<null>");

// Haz algo con el valor.
player.sendPlainMessage(value);
```

:::note
La compatibilidad con la vista PDC para `ItemStack` solo se introdujo en 1.21.1. Para versiones anteriores, debe utilizar `ItemMeta` en su lugar.
:::
## Almacenamiento en diferentes objetos
:::caution
Los datos **no** se copian entre los titulares por usted y deben copiarse **manualmente** si se "mueven" entre PersistentDataHolders.

P.ej. Colocar un ItemStack como un bloque (con un TileState) ***no*** copia los datos de PDC.
:::
Los objetos que pueden tener un PDC implementan la interfaz [](jd:paper:org.bukkit.persistence.PersistentDataHolder) y su PDC se puede recuperar con `PersistentDataHolder#getPersistentDataContainer()`.

- ##### [](jd:paper:org.bukkit.inventory.ItemStack)
    - Históricamente, se accedía al contenedor de datos persistentes de un `ItemStack` mediante
      su `ItemMeta`. Sin embargo, esto implica el coste adicional de construir todo el `ItemMeta`, que actúa como una instantánea de los datos del `ItemStack` en el momento de su creación.

      Para evitar este coste adicional, a partir de la versión 1.21.1 `ItemStack` expone una vista de solo lectura de su contenedor de datos persistentes mediante [](jd:paper:org.bukkit.inventory.ItemStack#getPersistentDataContainer()).
      A partir de la versión 1.21.4, también se pueden simplificar las modificaciones del contenedor mediante [](jd:paper:org.bukkit.inventory.ItemStack#editPersistentDataContainer(java.util.function.Consumer)).
      El contenedor de datos persistentes disponible dentro del consumidor no es válido fuera de este.
      ```java
      ItemStack itemStack = ...;
      itemStack.editPersistentDataContainer(pdc -> {
          pdc.set(key, PersistentDataType.STRING, "I love tacos!");
      });
      ```
- ##### [](jd:paper:org.bukkit.Chunk)
    - `Chunk#getPersistentDataContainer()`
- ##### [](jd:paper:org.bukkit.World)
    - `World#getPersistentDataContainer()`
- ##### [](jd:paper:org.bukkit.entity.Entity)
    - `Entity#getPersistentDataContainer()`
- ##### [](jd:paper:org.bukkit.block.TileState)
    - Esto es algo más complicado, ya que debes convertir el estado del bloque a un tipo que extienda `TileState`.
      No funciona con todos los bloques, solo con aquellos que tienen una entidad de bloque.
      ```java
      Block block = ...;
      if (block.getState() instanceof Chest chest) {
          chest.getPersistentDataContainer().set(key, PersistentDataType.STRING, "I love tacos!");
          chest.update();
      }
      ```
- ##### [](jd:paper:org.bukkit.structure.Structure)
    - `Structure#getPersistentDataContainer()`
- ##### [](jd:paper:org.bukkit.generator.structure.GeneratedStructure)
    - `GeneratedStructure#getPersistentDataContainer()`
- ##### [](jd:paper:org.bukkit.Raid)
    - `Raid#getPersistentDataContainer()`
- ##### [](jd:paper:org.bukkit.OfflinePlayer)
    - `OfflinePlayer` solo expone una versión de solo lectura del contenedor de datos persistentes.
      Se accede a él mediante `OfflinePlayer#getPersistentDataContainer()`.
- ##### [](jd:paper:org.bukkit.inventory.meta.ItemMeta)
    - `ItemMeta#getPersistentDataContainer()`
