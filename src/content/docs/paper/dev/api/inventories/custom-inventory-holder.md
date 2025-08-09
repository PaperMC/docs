---
title: Custom InventoryHolders
description: How to use a custom InventoryHolder to identify custom inventories.
slug: paper/dev/custom-inventory-holder
---

`InventoryHolder`s are a way to identify your plugin's inventories in events.

## Why use an `InventoryHolder`?

`InventoryHolder`s simplify the steps you need to do to make sure an inventory was created by your plugin.

Using inventory names for identification is unreliable, as other plugins, or even players, can create inventories with names the exact same as yours.
With components, you also need to make sure the name is exactly the same or serialize it to other formats.

Custom `InventoryHolder`s have no such downsides and by using them you're guaranteed to have methods available to handle your inventory.

## Creating a custom holder

The first step is to implement the [`InventoryHolder`](jd:paper:org.bukkit.inventory.InventoryHolder) interface.
We can do this the following way: create a new class that will create our [`Inventory`](jd:paper:org.bukkit.inventory.Inventory) in the constructor.

:::note

The constructor takes your main plugin class as an argument in order to create the `Inventory`.
If you wish, you can use the static method [`Bukkit#createInventory(InventoryHolder, int)`](jd:paper:org.bukkit.Bukkit#createInventory(org.bukkit.inventory.InventoryHolder,int)) instead and remove the argument.

:::

```java title="MyInventory.java"
public class MyInventory implements InventoryHolder {

    private final Inventory inventory;

    public MyInventory(MyPlugin plugin) {
        // Create an Inventory with 9 slots, `this` here is our InventoryHolder.
        this.inventory = plugin.getServer().createInventory(this, 9);
    }

    @Override
    public Inventory getInventory() {
        return this.inventory;
    }

}
```

## Opening the inventory

To open the inventory, first we have to instantiate our `MyInventory` class and then open the inventory for the player.
You can do that wherever you need.

:::note

We pass an instance of our plugin's main class as it's required by the constructor. If you've used the static method and removed the constructor
argument you don't have to pass it here.

:::

```java
Player player; // Assume we have a Player instance.
               // This can be a command, another event or anywhere else you have a Player.

MyInventory myInventory = new MyInventory(myPlugin);
player.openInventory(myInventory.getInventory());
```

## Listening to an event

Once we have the inventory open, we can listen to any inventory events we like and check if
[`Inventory#getHolder()`](jd:paper:org.bukkit.inventory.Inventory#getHolder()) returns an instance of our `MyInventory`.

```java
@EventHandler
public void onInventoryClick(InventoryClickEvent event) {
    Inventory inventory = event.getInventory();
    // Check if the holder is our MyInventory,
    // if yes, use instanceof pattern matching to store it in a variable immediately.
    if (!(inventory.getHolder(false) instanceof MyInventory myInventory)) {
        // It's not our inventory, ignore it.
        return;
    }

    // Do what we need in the event.
}
```

## Storing data on the holder

You can store extra data for your inventories on the `InventoryHolder` by adding fields and methods to your class.

Let's make an inventory that counts the amount of times we clicked a stone inside it.
First, let's modify our `MyInventory` class a little:

```java title="MyInventory.java"
public class MyInventory implements InventoryHolder {

    private final Inventory inventory;

    private int clicks = 0; // Store the amount of clicks.

    public MyInventory(MyPlugin plugin) {
        this.inventory = plugin.getServer().createInventory(this, 9);

        // Set the stone that we're going to be clicking.
        this.inventory.setItem(0, ItemStack.of(Material.STONE));
    }

    // A method we will call in the listener whenever the player clicks the stone.
    public void addClick() {
        this.clicks++;
        this.updateCounter();
    }

    // A method that will update the counter item.
    private void updateCounter() {
        this.inventory.setItem(8, ItemStack.of(Material.BEDROCK, this.clicks));
    }

    @Override
    public Inventory getInventory() {
        return this.inventory;
    }

}
```

Now, we can modify our listener to check if the player clicked the stone, and if so, add a click.

```java
@EventHandler
public void onInventoryClick(InventoryClickEvent event) {
    // We're getting the clicked inventory to avoid situations where the player
    // already has a stone in their inventory and clicks that one.
    Inventory inventory = event.getClickedInventory();
    // Add a null check in case the player clicked outside the window.
    if (inventory == null || !(inventory.getHolder(false) instanceof MyInventory myInventory)) {
        return;
    }

    event.setCancelled(true);

    ItemStack clicked = event.getCurrentItem();
    // Check if the player clicked the stone.
    if (clicked != null && clicked.getType() == Material.STONE) {
        // Use the method we have on MyInventory to increment the field
        // and update the counter.
        myInventory.addClick();
    }
}
```

:::note

You can store the created `MyInventory` instance, e.g. on a `Map<UUID, MyInventory>` for per-player use, or as a field to share the inventory between
all players, and use it to persist the counter even when opening the inventory for the next time.

:::
