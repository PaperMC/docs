---
title: Entity Pathfinder API
slug: paper/dev/entity-pathfinder
description: A guide to the Entity Pathfinder API.
---

The Entity Pathfinder API can be used to control the movement of entities in Minecraft. It allows you to set a path
for an entity to follow, such as moving to a location or following a player.

## Accessing the pathfinder

To access the pathfinder for a mob, you need to call [`getPathfinder()`](jd:paper:org.bukkit.entity.Mob#getPathfinder()) on the mob.
This will return an instance of [`Pathfinder`](jd:paper:com.destroystokyo.paper.entity.Pathfinder).

:::note

The pathfinder is only available for entities that implement [`Mob`](jd:paper:org.bukkit.entity.Mob).

:::

Let's say that you have a [`Cow`](jd:paper:org.bukkit.entity.Cow) and want to move it to a player.
You can do this by getting the pathfinder for the cow and then setting the path to the player's location:

```java
Cow cow = ...;
Player player = ...;

Pathfinder pathfinder = cow.getPathfinder();
// moveTo returns a boolean indicating whether the path was set successfully
boolean success = pathfinder.moveTo(player.getLocation());
```

If you want to access the current path for the cow, you can call [`getPathfinder()`](jd:paper:org.bukkit.entity.Mob#getPathfinder())
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

The pathfinder is limited by Minecraft's own pathfinding logic.
For example, a polar bear cannot fly. This means that if you set a path for a polar bear to a location that is in the air,
it will not be able to reach it.

Some attributes can be set on the pathfinder to change the way that the pathfinder works. These are:
- [`setCanOpenDoors(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanOpenDoors(boolean)): Whether the entity can open doors.
  This is relevant for zombies breaking down doors and villagers opening doors.
- [`setCanPassDoors(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanPassDoors(boolean)): Whether the entity can pass through open doors.
- [`setCanFloat(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanFloat(boolean)): Whether the entity can float in water.

These methods have respective getters as well.

## Stopping the pathfinding

You can call [`stopPathfinding()`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#stopPathfinding()) on the pathfinder to cancel the entity
from pathfinding. This will also clear the current path. You can use
[`hasPath()`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#hasPath()) to check if the pathfinder is currently running.
