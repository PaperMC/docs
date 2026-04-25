---
title: Mob Goal API
slug: paper/dev/mob-goals
description: A guide to the Mob Goal API.
---

The Mob Goal API allows controlling the behavior of mobs in Minecraft. With it, you can set a goal for a mob to perform, such as
attacking a player, or moving to a location. It also allows you to create your own custom goals.

## Adding a goal to an entity

To add a goal to an entity, you need to obtain an instance of the goal and then add it to the entity's [](jd:paper:com.destroystokyo.paper.entity.ai.MobGoals):

```java
Cow cow = ...;
Goal<Cow> goal = new ExampleGoal();

// 0 is the priority. A lower number denotes a higher priority.
server.getMobGoals().addGoal(cow, 0, goal);
```

:::tip

You can access Vanilla goals from the [`VanillaGoal`](jd:paper:com.destroystokyo.paper.entity.ai.VanillaGoal) class.
They may be specific to a mob type. For example, you can't use
[`VanillaGoal.BEE_ATTACK`](jd:paper:com.destroystokyo.paper.entity.ai.VanillaGoal#BEE_ATTACK) on a zombie.

:::

## Creating a custom goal

To create a custom goal, you need to create a class that implements the [`Goal`](jd:paper:com.destroystokyo.paper.entity.ai.Goal) interface.
This interface has several methods:
- [`void start()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#start()): Called when the goal is started.
- [`void tick()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#tick()): Called every tick while the goal is running.
- [`void stop()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#stop()): Called when the goal is stopped.
- [`boolean shouldActivate()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#shouldActivate()): Called to determine if the goal should start.
- [`boolean shouldStayActive()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#shouldStayActive()): Called to determine if the goal should continue running.
- [`GoalKey getKey()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#getKey()): Called to get the key for the goal.
- [`EnumSet<GoalType> getTypes()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#getTypes()): Called to get the types of the goal.

:::note[Types]

The [`getTypes()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#getTypes()) method is used to determine what types of goal this is. Possible values are:
- [`GoalType.MOVE`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#MOVE): The goal moves the entity.
- [`GoalType.LOOK`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#LOOK): The goal changes the direction the entity is looking.
- [`GoalType.JUMP`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#JUMP): The goal makes the entity jump.
- [`GoalType.TARGET`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#TARGET): The goal changes the target of the entity.
- [`GoalType.UNKNOWN_BEHAVIOR`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#UNKNOWN_BEHAVIOR): The goal does something else. Used for mapping Vanilla goals.

:::

Here is an example of a goal that makes a camel follow a player. This is essentially the same as the
[`FOLLOW_MOB`](jd:paper:com.destroystokyo.paper.entity.ai.VanillaGoal#FOLLOW_MOB) Vanilla goal,
but it is a good example on how to create a goal.

```java
@NullMarked
public class CamelFollowPlayerGoal implements Goal<Camel> {

    // This is the key for the goal. It is used to identify the goal and is
    // used to determine if two goals are the same.
    public static final GoalKey<Camel> KEY = GoalKey.of(
        // The entity class this goal is targeting.
        Camel.class,
        // The key used for identification. Should use your plugin's namespace.
        new NamespacedKey("testplugin", "camel_follow_player")
    );

    private final Player player; // The player to follow.
    private final Camel camel; // The camel that is following.

    public CamelFollowPlayerGoal(Player player, Camel camel) {
        this.player = player;
        this.camel = camel;
    }

    @Override
    public boolean shouldActivate() {
        // Whether the goal should start. In this case, we want the goal to always
        // start so we return true. You could also return false if a specific
        // condition needs to be met.
        return true;
    }

    @Override
    public void start() {
        // Called when the goal starts.
        player.sendMessage(text("I am following you!"));
    }

    @Override
    public void tick() {
        // Called every tick while the goal is running. Here, we make the camel
        // move towards the player using the Pathfinder API.
        // The 5.0 is the speed of the camel.
        camel.getPathfinder().moveTo(player, 5.0);
    }

    @Override
    public void stop() {
        // Called when the goal stops.
        player.sendMessage(text("I stopped following you!"));
    }

    @Override
    public GoalKey<Camel> getKey() {
        return KEY;
    }

    @Override
    public EnumSet<GoalType> getTypes() {
        // Returns the types of this goal. Since we are changing the
        // camel's look direction and move it, we return MOVE and LOOK.
        // You may return as many types as you need.
        return EnumSet.of(GoalType.MOVE, GoalType.LOOK);
    }
}
```

## Removing a goal

To remove a goal, you can call one of the [`removeGoal`](jd:paper:com.destroystokyo.paper.entity.ai.MobGoals#removeAllGoals(T)) methods:

```java
Cow cow = ...;

// This works because our example has a public static field.
server.getMobGoals().removeGoal(cow, CamelFollowPlayerGoal.KEY);

// You can also remove Vanilla goals.
server.getMobGoals().removeGoal(cow, VanillaGoal.TEMPT);

// Remove all goals with a MOVE type.
server.getMobGoals().removeAllGoals(cow, GoalType.MOVE);

// Remove all goals.
server.getMobGoals().removeAllGoals(cow);
```
