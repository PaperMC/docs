---
title: Mob Goal API
slug: paper/dev/mob-goals
description: A guide to the Mob Goal API.
---

The Mob Goal API is a way of controlling the behaviour of mobs in Minecraft. It allows you to set a goal for a mob to perform, such as
attacking a player, or moving to a location. It also allows you to create your own custom goals.

## Registering a Goal on an Entity

To register a goal on an entity, you need to create an instance of the goal and then register it with the entity:

```java
Cow cow = ...;
Goal<Cow> goal = new ExampleGoal();

server.getMobGoals().addGoal(cow, 0, goal); // 0 is the priority, lower numbers are higher priority
```

:::tip

You can access the Vanilla goals from the `VanillaGoal` class. These are the goals that are used by Vanilla Minecraft.
They are specific to each mob type, so you can't use a cow goal on a zombie for example.

:::

## Creating a Custom Goal

To create a custom goal, you need to create a class that implements the `Goal` interface. This interface has several methods:
- `void start()`: Called when the goal is started.
- `void tick()`: Called every tick while the goal is running.
- `void stop()`: Called when the goal is stopped.
- `boolean shouldActivate()`: Called to determine if the goal should start.
- `boolean shouldStayActive()`: Called to determine if the goal should continue running.
- `GoalKey getKey()`: Called to get the key for the goal.
- `EnumSet<GoalType> getTypes()`: Called to get the types of the goal.

:::note[Types]

The `getTypes()` method is used to determine what types of goal this is. The types are:
- `GoalType.MOVE`: The goal moves the entity.
- `GoalType.LOOK`: The goal changes the direction the entity is looking.
- `GoalType.JUMP`: The goal makes the entity jump.
- `GoalType.TARGET`: The goal changes the target of the entity.
- `GoalType.UNKNOWN_BEHAVIOR`: The goal does something else. Used for mapping Vanilla goals.

:::

Here is an example of a goal that makes a camel follow a player. This is essentially the same as the `FOLLOW_MOB` in Vanilla,
but it is a good example of how to create a goal.

```java
public class CamelFollowPlayerGoal implements Goal<Camel> {

    public static final GoalKey<Camel> KEY = GoalKey.of(Camel.class, new NamespacedKey("testplugin", "camel_follow_player"));

    private final Player player;
    private final Camel camel;

    public CamelFollowPlayerGoal(Player player, Camel camel) {
        // The constructor takes the Player to follow and the Camel that is following
        this.player = player;
        this.camel = camel;
    }

    @Override
    public boolean shouldActivate() {
        // This is whether or the goal should start. In this case, we want the goal to always start so we return true.
        // You could also return false here if you wanted to only start the goal in certain situations.
        return true;
    }

    @Override
    public void start() {
        // This is called when the goal starts. In this case, we just send a message to the player.
        player.sendMessage(text("I am following you!"));
    }

    @Override
    public void tick() {
        // This is called every tick while the goal is running. In this case, we make the camel move towards the player
        // using the Pathfinder API. The 5.0 is the speed of the camel.
        camel.getPathfinder().moveTo(player, 5.0);
    }

    @Override
    public void stop() {
        // This is called when the goal stops. In this case, we just send a message to the player.
        player.sendMessage(text("I Stopped following you!"));
    }

    @Override
    public @NotNull GoalKey<Camel> getKey() {
        // This is the key for the goal. It is used to identify the goal and is used to determine if two goals are the same.
        // It requires the class of the entity and a NamespacedKey. The NamespacedKey is used to identify the goal.
        // You should use the plugin's namespace for the NamespacedKey, not Minecraft or Bukkit.
        return KEY;
    }

    @Override
    public @NotNull EnumSet<GoalType> getTypes() {
        // This is used to determine what types of goal this is. In this case, we are moving the entity and changing the
        // direction it is looking, so we return MOVE and LOOK. Return as many types as you need.
        return EnumSet.of(GoalType.MOVE, GoalType.LOOK);
    }
}
```

## Stopping a Goal

To stop a goal, you need to get the goal key and then call `stop()` on the goal:

```java
Cow cow = ...;
// This works because our example has a public static `KEY` field
server.getMobGoals().removeGoal(cow, CamelFollowPlayerGoal.KEY);

// You can also remove Vanilla goals
server.getMobGoals().removeGoal(cow, VanillaGoal.TEMPT);

// You can also remove all goals
server.getMobGoals().removeAllGoals(cow);
server.getMobGoals().removeAllGoals(cow, GoalType.MOVE); // Remove all MOVE goals
```
