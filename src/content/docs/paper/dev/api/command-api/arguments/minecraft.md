---
title: Minecraft-specific
description: Everything regarding the essential Brigadier arguments.
slug: paper/dev/command-api/arguments/minecraft
---

The [Arguments and Literals](/paper/dev/command-api/basics/arguments-and-literals) page covers the most used, native Brigadier arguments. But Minecraft define a few more which Paper wraps around. These can be accessed
in a static context using the [](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes) class. We will go over all of those in this section.

## Quick overview
A quick overview of all possible arguments is defined here:

| Argument Reference                                                                                                                      | Resolved Type                                                                                    |
|-----------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| [`entity()`](/paper/dev/command-api/arguments/entity-player#entity-argument)                                                            | [](jd:paper:org.bukkit.entity.Entity)                                                            |
| [`entities()`](/paper/dev/command-api/arguments/entity-player#entities-argument)                                                        | <code>List<[Entity](jd:paper:org.bukkit.entity.Entity)></code>                                   |
| [`player()`](/paper/dev/command-api/arguments/entity-player#player-argument)                                                            | [](jd:paper:org.bukkit.entity.Player)                                                            |
| [`players()`](/paper/dev/command-api/arguments/entity-player#players-argument)                                                          | <code>List<[Player](jd:paper:org.bukkit.entity.Player)></code>                                   |
| [`playerProfiles()`](/paper/dev/command-api/arguments/entity-player#player-profiles-argument)                                           | <code>Collection<[PlayerProfile](jd:paper:com.destroystokyo.paper.profile.PlayerProfile)></code> |
| [`blockPosition()`](/paper/dev/command-api/arguments/location#block-position-argument)                                                  | [](jd:paper:io.papermc.paper.math.BlockPosition)                                                 |
| [`columnBlockPosition()`](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#columnBlockPosition())                     | [](jd:paper:io.papermc.paper.command.brigadier.argument.position.ColumnBlockPosition)            |
| [`blockInWorldPredicate()`](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#blockInWorldPredicate())                 | [](jd:paper:io.papermc.paper.command.brigadier.argument.predicate.BlockInWorldPredicate)         |
| [`finePosition(boolean centerIntegers)`](/paper/dev/command-api/arguments/location#fine-position-argument)                              | [](jd:paper:io.papermc.paper.math.FinePosition)                                                  |
| [`columnFinePosition(boolean centerIntegers)`](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#columnFinePosition()) | [](jd:paper:io.papermc.paper.command.brigadier.argument.position.ColumnFinePosition)             |
| [`rotation()`](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#rotation())                                           | [](jd:paper:io.papermc.paper.math.Rotation)                                                      |
| [`angle()`](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#angle())                                                 | `float`                                                                                          |
| [`axes()`](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#axes())                                                   | <code>Set<[Axis](jd:paper:org.bukkit.Axis)></code>                                               |
| [`blockState()`](/paper/dev/command-api/arguments/paper#block-state-argument)                                                           | [](jd:paper:org.bukkit.block.BlockState)                                                         |
| [`itemStack()`](/paper/dev/command-api/arguments/paper#item-argument)                                                                   | [](jd:paper:org.bukkit.inventory.ItemStack)                                                      |
| [`itemPredicate()`](/paper/dev/command-api/arguments/predicate#item-predicate-argument)                                                 | [](jd:paper:io.papermc.paper.command.brigadier.argument.predicate.ItemStackPredicate)            |
| [`namedColor()`](/paper/dev/command-api/arguments/adventure#named-color-argument)                                                       | [](jd:adventure:net.kyori.adventure.text.format.NamedTextColor) (Adventure)                      |
| [`hexColor()`](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#hexColor())                                           | [](jd:adventure:net.kyori.adventure.text.format.TextColor) (Adventure)                           |
| [`component()`](/paper/dev/command-api/arguments/adventure#component-argument)                                                          | [](jd:adventure:net.kyori.adventure.text.Component) (Adventure)                                  |
| [`style()`](/paper/dev/command-api/arguments/adventure#adventure-style-argument)                                                        | [](jd:adventure:net.kyori.adventure.text.format.Style) (Adventure)                               |
| [`signedMessage()`](/paper/dev/command-api/arguments/adventure#signed-message-argument)                                                 | [](jd:adventure:net.kyori.adventure.chat.SignedMessage) (Adventure)                              |
| [`scoreboardDisplaySlot()`](/paper/dev/command-api/arguments/enums#scoreboard-display-slot-argument)                                    | [](jd:paper:org.bukkit.scoreboard.DisplaySlot)                                                   |
| [`namespacedKey()`](/paper/dev/command-api/arguments/paper#namespacedkey-argument)                                                      | [](jd:paper:org.bukkit.NamespacedKey)                                                            |
| [`key()`](/paper/dev/command-api/arguments/adventure#key-argument)                                                                      | [](jd:adventure:net.kyori.adventure.key:net.kyori.adventure.key.Key) (Adventure)                 |
| [`integerRange()`](/paper/dev/command-api/arguments/predicate#integer-range-argument)                                                   | `Range<Integer>`                                                                                 |
| [`doubleRange()`](/paper/dev/command-api/arguments/predicate#double-range-argument)                                                     | `Range<Double>`                                                                                  |
| [`world()`](/paper/dev/command-api/arguments/location#world-argument)                                                                   | [](jd:paper:org.bukkit.World)                                                                    |
| [`gameMode()`](/paper/dev/command-api/arguments/enums#gamemode-argument)                                                                | [](jd:paper:org.bukkit.GameMode)                                                                 |
| [`heightMap()`](/paper/dev/command-api/arguments/enums#heightmap-argument)                                                              | [](jd:paper:org.bukkit.HeightMap)                                                                |
| [`uuid()`](/paper/dev/command-api/arguments/paper#uuid-argument)                                                                        | `UUID`                                                                                           |
| [`objectiveCriteria()`](/paper/dev/command-api/arguments/paper#objective-criteria-argument)                                             | [](jd:paper:org.bukkit.scoreboard.Criteria)                                                      |
| [`entityAnchor()`](/paper/dev/command-api/arguments/enums#entity-anchor-argument)                                                       | [](jd:paper:io.papermc.paper.entity.LookAnchor)                                                  |
| [ `time(int minTime)`](/paper/dev/command-api/arguments/paper#time-argument)                                                            | `Integer`                                                                                        |
| [`templateMirror()`](/paper/dev/command-api/arguments/enums#template-mirror-argument)                                                   | [](jd:paper:org.bukkit.block.structure.Mirror)                                                   |
| [`templateRotation()`](/paper/dev/command-api/arguments/enums#template-rotation-argument)                                               | [](jd:paper:org.bukkit.block.structure.StructureRotation)                                        |
| [`resource(RegistryKey<T>)`](/paper/dev/command-api/arguments/registry#resource-argument)                                               | registry element                                                                               |
| [`resourceKey(RegistryKey<T>)`](/paper/dev/command-api/arguments/registry#resource-key-argument)                                        | [](jd:paper:io.papermc.paper.registry.TypedKey) of a registry element                                                                |
