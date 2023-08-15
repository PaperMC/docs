﻿---
slug: /dev/scheduler
---

# Using the Scheduler

The `BukkitScheduler` can be used to schedule your code to be run later or repeatedly.

:::info[Folia]

This guide is designed for Non-Folia Bukkit Servers. If you are using Folia, you should use its respective schedulers.

:::

## What is a tick?

Every game runs something called a game loop which essentially executes all the logic of the game over and over.
A single execution of that loop in Minecraft is called a 'tick'.

In Minecraft there are 20 ticks per second, or one tick every 50 milliseconds. This means that the game loop is executed 
20 times per second. A tick taking more than 50ms to execute is the moment when your server starts to fall behind on 
its work and lag.

### Converting between human units and Minecraft ticks

Every method of the scheduler that takes a delay or period uses ticks as a unit of time.

Converting from human units to ticks and back is as simple as:  
- `ticks = seconds * 20`  
- `seconds = ticks / 20`

You can make your code more readable by using the
[`TimeUnit`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/TimeUnit.html)
enum, e.g. to convert 5 minutes to ticks and back:  
- `TimeUnit.MINUTES.toSeconds(5) * 20`  
- `TimeUnit.SECONDS.toMinutes(ticks / 20)`

You can also use the `Tick` class from Paper to convert between human units and ticks, e.g. to convert 5 minutes to ticks:
`Tick.tick().fromDuration(Duration.ofMinutes(5))` will yield `6000` ticks.

## Obtaining the scheduler

To obtain a scheduler you can use the `getScheduler` method on the `Server` class, e.g. in your `onEnable` method:

```java
@Override
public void onEnable() {
    BukkitScheduler scheduler = this.getServer().getScheduler();
}
```

## Scheduling tasks

Scheduling a task requires you to pass:

- Your plugin's instance
- The code to run, either with a `Runnable` or `Consumer<BukkitTask>`
- The delay in ticks before the task should run for the first time
- If you're scheduling a repeating task - the period in ticks between each execution of the task

### Difference between synchronous and asynchronous tasks

#### Synchronous tasks (on the main thread)

Synchronous tasks are tasks that are executed on the main server thread. This is the same
thread that handles all game logic.

All tasks scheduled on the main thread will affect the server's performance. If your task
is making web requests, accessing files, databases or otherwise time-consuming operations you should consider using 
an asynchronous task.

#### Asynchronous tasks (off the main thread)

Asynchronous tasks are tasks that are executed on separate threads, therefore will not directly affect
your server's performance.

:::warning

**Large portions of the Bukkit API are not safe to use from within asynchronous tasks**. If a method changes or 
accesses the world state, it is not safe to be used from an asynchronous task.

:::

:::info

While the tasks are executed on separate threads, they are still started from the main thread
and will be affected if the server is lagging, an example would be 20 ticks not being exactly 1 second.

If you need a scheduler that runs independently of the server consider using your own
[`ScheduledExecutorService`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ScheduledExecutorService.html).
You can follow [this guide](https://www.baeldung.com/java-executor-service-tutorial#ScheduledExecutorService) to learn how to use it.

:::

### Different ways to schedule tasks

#### Using `Runnable`

The `Runnable` interface is used for the simplest tasks that don't require a `BukkitTask` instance.

You can either implement it in a separate class, e.g.:

```java
public class MyRunnableTask implements Runnable {

    private final MyPlugin plugin;
    
    public MyRunnableTask(MyPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public void run() {
        this.plugin.getServer().broadcast(Component.text("Hello, World!"));
    }

}
```
```java
scheduler.runTaskLater(plugin, new MyRunnableTask(plugin), 20);
```

Or use a lambda expression which is great for simple and short tasks:

```java
scheduler.runTaskLater(
    plugin, /* Lambda: */ () -> {
        this.plugin.getServer().broadcast(Component.text("Hello, World!"));
    }, /* End of the lambda */ 20);
```

#### Using `Consumer<BukkitTask>`

The `Consumer` interface is used for tasks that require a `BukkitTask` instance (usually in repeated tasks),
e.g. when you want to cancel the task from inside it.

You can either implement it in a separate class similarly to the `Runnable`, e.g.:

```java
public class MyConsumerTask implements Consumer<BukkitTask> {

    private final UUID entityId;

    public MyConsumerTask(UUID uuid) {
        this.entityId = uuid;
    }

    @Override
    public void accept(BukkitTask task) {
        Entity entity = Bukkit.getServer().getEntity(this.entityId);

        if (entity instanceof LivingEntity livingEntity) {
            livingEntity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
            return;
        }

        task.cancel(); // The entity is no longer valid, there's no point in continuing to run this task
    }
}
```
```java
scheduler.runTaskTimer(plugin, new MyConsumerTask(someEntityId), 0, 20);
```

Or use a lambda expression which again is much cleaner for short and simple tasks:

```java
scheduler.runTaskTimer(plugin, /* Lambda: */ task -> {
    Entity entity = Bukkit.getServer().getEntity(entityId);

    if (entity instanceof LivingEntity livingEntity) {
        livingEntity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
        return;
    }

    task.cancel(); // The entity is no longer valid, there's no point in continuing to run this task
} /* End of the lambda */, 0, 20);
```

##### Using BukkitRunnable

The `BukkitRunnable` class is a class that implements `Runnable` and holds a `BukkitTask` instance. This means that you do
not need to access the task from inside the `run()` method, you can simply use the `this.cancel` method:

```java
public class CustomRunnable extends BukkitRunnable {

    private final UUID entityId;

    public CustomRunnable(UUID uuid) {
        this.entityId = uuid;
    }

    @Override
    public void run() {
        Entity entity = Bukkit.getServer().getEntity(this.entityId);

        if (entity instanceof LivingEntity livingEntity) {
            livingEntity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
            return;
        }

        task.cancel(); // The entity is no longer valid, there's no point in continuing to run this task
    }
}
```

This simply adds a potion effect until the entity dies. 

#### Using a delay of 0 ticks

A delay of 0 ticks is treated as you wanting to run the task on the next tick. If you schedule a task with a delay of 0 ticks
whilst the server is starting / before it is enabled it will be executed before the server is enabled.
