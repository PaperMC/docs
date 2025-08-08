---
title: Menu Type API
slug: paper/dev/menu-type-api
description: A guide to the Menu Type API.
version: 1.21.8
sidebar:
  badge:
    text: Experimental
    variant: danger
---

:::danger[Experimental]

The Menu Type API and anything that uses it is currently experimental and may change in the future.

:::

Minecraft has a lot of types of menus. From chests, to crafting tables, to anvils, and even villager trade menus.
With the old Bukkit inventory API, it was not possible to replicate most of these perfectly. Exactly for
this reason, the menu type API was introduced.

## What is a menu?
Menus, also referred to as views, are user interfaces, which can be created and viewed by players. The
[`MenuType`](jd:paper:org.bukkit.inventory.MenuType) interface declares all possible menu types a menu can have.
The difference between menus and inventories is that inventories are containers and menus are
their visual representations.

Menus created using this API **follow the same logic as Vanilla**, meaning they are fully
functional. Some of them can directly represent a block, like a furnace. The [`MERCHANT`](jd:paper:org.bukkit.inventory.MenuType#MERCHANT)
can represent a merchant entity in the world.

## What are inventory views?
An [`InventoryView`](jd:paper:org.bukkit.inventory.InventoryView) is a specific view created from a menu type.
In the general sense, an inventory view links together **two separate inventories** and always has a player viewing them.
The bottom linked inventory is the player's inventory.

Some views have specialized subinterfaces for quickly checking their type, like [`FurnaceView`](jd:paper:org.bukkit.inventory.view.FurnaceView)
for furnace inventories. For other views, which don't have their own sub type, you can instead use the
[`InventoryView#getMenuType`](jd:paper:org.bukkit.inventory.InventoryView#getMenuType()) method.

## Building inventory views from menu types
The most common way to create inventory views from menu types is by using their respective builders. **Every menu type
has a builder** which can be used to customize the resulting view. For example, a simple crafting table
inventory view can be created and opened like this:

```java
// MenuType.CRAFTING is used to open a crafting table.
MenuType.CRAFTING.builder()

    // Set the title of the view, which will be displayed at the top.
    .title(Component.text("The inventory view's title"))

    // Determines whether the server should check if the player can reach the location.
    .checkReachable(true)

    // Set the location. Because of checkReachable being set to `true`, this has to be a valid
    // crafting table. The server will check and make sure that the player does not get pushed
    // away too far to use the crafting table and will close the player's inventory if the
    // crafting table were to be pushed away.
    .location(location)

    // Build this view for the provided player, linking the inventory of the crafting table
    // together with the player's own inventory into an inventory view.
    .build(player)

    // Open the view.
    .open();
```

:::tip[Reusing Builders]

Builders can be reused in order to reduce code repetition.

:::

## Opening blocks that have menus
Almost all inventory views have a block attached to them. The only exception being the
[`MenuType.MERCHANT`](jd:paper:org.bukkit.inventory.MenuType#MERCHANT), which
instead has a [`Merchant`](jd:paper:org.bukkit.inventory.Merchant) attached to it.

There are two types of blocks that have menus: Block entity blocks and stateless blocks.

Stateless blocks, as the name implies, do not have any state associated with them. Under
those count the majority of "workbench" blocks, like crafting tables, grindstones, anvils, and more.

Block entity blocks (also referred to as tile entity blocks) have a state associated with them.
Meaning when you open a specific location with the `#location` builder method, and the block matches
the expected block from the menu type, the state of that block can change. This means that all players
can see the change live.

Under those blocks count the beacon, chests, furnaces, and similar. For example,
[`MenuType.FURNACE`](jd:paper:org.bukkit.inventory.MenuType#FURNACE) would expect a furnace block.

## Persistent inventory views
Inventory views can be reused! This is useful for persistent operations.

For example, we can write a `/persistent` command with opens a player's own, persistent, stash!

```java title="CommandPersistent.java" showLineNumbers collapse={1-18}
package io.papermc.docs.menutype;

import com.mojang.brigadier.Command;
import com.mojang.brigadier.tree.LiteralCommandNode;
import io.papermc.paper.command.brigadier.CommandSourceStack;
import io.papermc.paper.command.brigadier.Commands;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.InventoryView;
import org.bukkit.inventory.MenuType;

import java.util.HashMap;
import java.util.Map;

public class CommandPersistent implements Listener {

    // A map to store all inventory views in. Generally it is not recommended
    // to use Player objects as keys or values, but in this case it is acceptable
    // because the inventory view is also bound to a player object, meaning we
    // couldn't reuse it after a player rejoins anyways.
    private static final Map<Player, InventoryView> VIEWS = new HashMap<>();

    // Create a command. Commands are explained in the Command API documentation
    // pages and therefore won't be covered here.
    public static LiteralCommandNode<CommandSourceStack> createCommand() {
        return Commands.literal("persistent").executes(ctx -> {
            if (!(ctx.getSource().getExecutor() instanceof Player player)) {
                return 0;
            }

            // First, attempt to get a stored view.
            InventoryView view = VIEWS.get(player);

            // If there is no view currently stored, create it.
            if (view == null) {
                view = MenuType.GENERIC_9X6.builder()
                    .title(Component.text(player.getName() + "'s stash", NamedTextColor.DARK_RED))
                    .build(player);

                // And finally store it in the map.
                VIEWS.put(player, view);
            }

            // As the inventory view is directly bound to the player, we do not have
            // to reassign the player and can just open it.
            view.open();
            return Command.SINGLE_SUCCESS;
        }).build();
    }

    // There are two things we should do on the quit event:
    // 1. Remove the player entry from the map, as it is no longer valid.
    // 2. Store the top inventory somewhere so it persists across server restarts.
    @EventHandler
    void onPlayerQuit(PlayerQuitEvent event) {
        InventoryView view = VIEWS.remove(event.getPlayer());
        if (view != null) {
            Inventory topInventory = view.getTopInventory();
            // Save the contents of the inventory to a file or database.
        }
    }
}
```
