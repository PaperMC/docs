---
title: Entity Pathfinder API
slug: paper/dev/entity-pathfinder
description: A guide to the Entity Pathfinder API.
---

The Entity Pathfinder API is a way of controlling the movement of entities in Minecraft. It allows you to set a path
for an entity to follow, such as moving to a location, or following a player.

## Accessing the pathfinder

To access the pathfinder for a Mob, you need to call [`getPathfinder()`](jd:paper:org.bukkit.entity.Mob#getPathfinder()) on the Mob.
This will return an instance of [`Pathfinder`](jd:paper:com.destroystokyo.paper.entity.Pathfinder).

:::note

The pathfinder is only available for entities that implement [`Mob`](jd:paper:org.bukkit.entity.Mob).

:::

Let's say that we have a [`Cow`](jd:paper:org.bukkit.entity.Cow) and we want it to move to a specific [`Player`](jd:paper:org.bukkit.entity.Player)'s
location. We can do this by getting the pathfinder for the cow and then setting the path to the player's location:

```java
Cow cow = ...;
Player player = ...;

Pathfinder pathfinder = cow.getPathfinder();
// moveTo returns a boolean indicating whether the path was set successfully
boolean success = pathfinder.moveTo(player.getLocation());
```

If we want to access the current path for the cow, we can call [`getPathfinder()`](jd:paper:org.bukkit.entity.Mob#getPathfinder())
on the pathfinder:

```java
PathResult path = pathfinder.getCurrentPath();

// A PathResult is essentially a wrapper around a List of Locations. These can be accessed with:
List<Location> locations = path.getPoints();
// It is important to note that the list contains points that have already been passed,
// as well as future points. If you want to get the next point, you can use:
Location nextPoint = path.getNextPoint(); // Or locations.get(path.getNextPointIndex())
// Finally, you can access the final destination with:
Location destination = path.getFinalPoint();
```

## Pathfinding rules

Much of the way that the Pathfinder works is dictated by the limitations of the actual entity pathfinding in Minecraft.
For example, a Polar Bear cannot fly. This means that if you set a path for a Polar Bear to a location that is in the air,
it will not be able to reach it.

Some attributes can be set on the pathfinder to change the way that the pathfinder works. These are:
- [`setCanOpenDoors(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanOpenDoors(boolean)): Whether the entity can open doors. This is relevant for Zombies breaking down doors, and
Villagers opening doors.
- [`setCanPassDoors(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanPassDoors(boolean)): Whether the entity can pass through open doors.
- [`setCanFloat(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanFloat(boolean)): Whether the entity can float in water.
These all have respective getters as well.

## Stopping the pathfinder

You can call [`stopPathfinding()`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#stopPathfinding()) on the pathfinder to stop the pathfinder. This will stop the pathfinder and clear the
current path. You can use [`hasPath()`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#hasPath()) to check if the pathfinder is running.
