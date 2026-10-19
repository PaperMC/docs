---
title: Titulares de inventario personalizados
description: Cómo utilizar un InventoryHolder personalizado para identificar inventarios personalizados.
slug: es/paper/dev/custom-inventory-holder
---
`InventoryHolder` permite identificar en los eventos los inventarios creados por tu plugin.

## ¿Por qué utilizar un `InventoryHolder`?

Con `InventoryHolder`, puedes comprobar directamente si tu plugin creó un inventario.

Identificar inventarios por su nombre no es fiable: otros plugins e incluso jugadores pueden crear inventarios con el mismo nombre. Comparar componentes también requiere comprobar que coincidan exactamente o serializarlos a otro formato.

Un `InventoryHolder` personalizado evita esos problemas y te permite añadir métodos para gestionar el inventario.

## Crear un `InventoryHolder` personalizado

Primero, implementa la interfaz [](jd:paper:org.bukkit.inventory.InventoryHolder) en una clase nueva y crea el [](jd:paper:org.bukkit.inventory.Inventory) en su constructor:
:::note
El constructor recibe la clase principal del plugin para crear el `Inventory`. Si lo prefieres, usa el método estático [](jd:paper:org.bukkit.Bukkit#createInventory(org.bukkit.inventory.InventoryHolder,int)) y elimina ese parámetro.
:::

```java title="MyInventory.java"
public class MyInventory implements InventoryHolder {

    private final Inventory inventory;

    public MyInventory(MyPlugin plugin) {
        // Crea un inventario de 9 espacios; `this` es nuestro InventoryHolder.
        this.inventory = plugin.getServer().createInventory(this, 9);
    }

    @Override
    public Inventory getInventory() {
        return this.inventory;
    }

}
```
## Abriendo el inventario

Para abrir el inventario, primero tenemos que crear una instancia de nuestra clase `MyInventory` y luego abrir el inventario para el jugador. Puedes hacerlo donde lo necesites.
:::note
Pasamos una instancia de la clase principal de nuestro complemento según lo requiere el constructor. Si utilizó el método estático y eliminó el argumento del constructor, no es necesario que lo pase aquí.
:::

```java
Player player = ...;

MyInventory myInventory = new MyInventory(myPlugin);
player.openInventory(myInventory.getInventory());
```
## Escuchando un evento

Una vez que tengamos el inventario abierto, podemos escuchar cualquier evento de inventario que deseemos y verificar si [](jd:paper:org.bukkit.inventory.Inventory#getHolder()) devuelve una instancia de nuestro `MyInventory`.
```java
@EventHandler
public void onInventoryClick(InventoryClickEvent event) {
    Inventory inventory = event.getInventory();
    // Comprueba si el holder es nuestro MyInventory.
    // Si es así, usa la coincidencia de patrones de instanceof para guardarlo de inmediato en una variable.
    if (!(inventory.getHolder(false) instanceof MyInventory myInventory)) {
        // No es nuestro inventario; ignora el evento.
        return;
    }

    // Realiza lo necesario en el evento.
}
```
## Almacenamiento de datos sobre el titular

Puede almacenar datos adicionales para sus inventarios en `InventoryHolder` agregando campos y métodos a su clase.

Hagamos un inventario que cuente la cantidad de veces que pinchamos una piedra dentro de ella. Primero, modifiquemos un poco nuestra clase `MyInventory`:
```java title="MyInventory.java"
public class MyInventory implements InventoryHolder {

    private final Inventory inventory;
    private int clicks = 0; // Almacena la cantidad de clics.

    public MyInventory(MyPlugin plugin) {
        this.inventory = plugin.getServer().createInventory(this, 9);

        // Coloca la piedra en la que haremos clic.
        this.inventory.setItem(0, ItemStack.of(Material.STONE));
    }

    /// Se llama desde el evento cada vez que el jugador hace clic en la piedra.
    public void addClick() {
        this.clicks++;
        this.updateCounter();
    }

    /// Actualiza el objeto contador cuando se hace clic en la piedra.
    private void updateCounter() {
        this.inventory.setItem(8, ItemStack.of(Material.BEDROCK, this.clicks));
    }

    @Override
    public Inventory getInventory() {
        return this.inventory;
    }

}
```
Ahora, podemos modificar nuestro oyente para verificar si el jugador hizo clic en la piedra y, de ser así, agregar un clic.
```java
@EventHandler
public void onInventoryClick(InventoryClickEvent event) {
    // Obtenemos el inventario en el que se hizo clic para evitar el caso en que el jugador
    // ya tenga una piedra en su inventario y haga clic en ella.
    Inventory inventory = event.getClickedInventory();
    // Comprueba si el valor es null por si el jugador hizo clic fuera de la ventana.
    if (inventory == null || !(inventory.getHolder(false) instanceof MyInventory myInventory)) {
        return;
    }

    event.setCancelled(true);

    ItemStack clicked = event.getCurrentItem();
    // Comprueba si el jugador hizo clic en la piedra.
    if (clicked != null && clicked.getType() == Material.STONE) {
        // Usa el método de MyInventory para incrementar el campo
        // y actualizar el contador.
        myInventory.addClick();
    }
}
```

:::note
Puede almacenar la instancia `MyInventory` creada, p. en un `Map<UUID, MyInventory>` para uso por jugador, o como un campo para compartir el inventario entre todos los jugadores, y usarlo para conservar el contador incluso cuando abra el inventario la próxima vez.
:::
