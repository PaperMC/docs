---
title: Scheduling
description: A comprehensive guide on using BukkitScheduler to run code at specific times, including best practices and performance considerations.
slug: paper/dev/scheduler
---

The [`BukkitScheduler`](jd:paper:org.bukkit.scheduler.BukkitScheduler) is a powerful tool for scheduling tasks in your Paper server. It allows you to run code at specific times, either once or repeatedly, and supports both synchronous and asynchronous execution.

:::note[Folia]

This guide is designed for non-Folia Bukkit servers. If you are using Folia, you should use its respective schedulers. See the [Folia Support](/paper/dev/api/folia-support) documentation for more information.

:::

## Understanding Ticks

### What is a tick?

Every game runs something called a game loop, which executes all the game logic repeatedly. In Minecraft, a single execution of this loop is called a 'tick'.

Key tick characteristics:
- 20 ticks per second (TPS)
- One tick = 50 milliseconds
- Server lag occurs when ticks take longer than 50ms to execute
- TPS can drop below 20 during high load or poor performance

### Converting between human units and Minecraft ticks

Every scheduler method that takes a delay or period uses ticks as the unit of time.

Common conversions:
- `ticks = seconds * 20`
- `seconds = ticks / 20`

#### Using TimeUnit for readability

The [`TimeUnit`](jd:java:java.util.concurrent.TimeUnit) enum makes conversions more readable:

```java
// Convert 5 minutes to ticks
long ticks = TimeUnit.MINUTES.toSeconds(5) * 20;

// Convert ticks back to minutes
long minutes = TimeUnit.SECONDS.toMinutes(ticks / 20);
```

#### Using Paper's Tick class

Paper provides a `Tick` class for more convenient conversions:

```java
// Convert 5 minutes to ticks
long ticks = Tick.tick().fromDuration(Duration.ofMinutes(5)); // Returns 6000 ticks
```

## Obtaining the Scheduler

You can obtain the scheduler in several ways:

```java
// Method 1: From your plugin instance
BukkitScheduler scheduler = this.getServer().getScheduler();

// Method 2: From Bukkit class
BukkitScheduler scheduler = Bukkit.getScheduler();

// Method 3: Store it as a field in your plugin
private final BukkitScheduler scheduler;

@Override
public void onEnable() {
    this.scheduler = this.getServer().getScheduler();
}
```

## Task Types and Scheduling

### Synchronous vs Asynchronous Tasks

#### Synchronous Tasks (Main Thread)
- Executed on the main server thread
- Can safely access and modify game state
- Should be used for:
  - World modifications
  - Entity operations
  - Player interactions
  - Inventory management
  - Scoreboard updates

#### Asynchronous Tasks (Separate Thread)
- Executed on separate threads
- Cannot directly modify game state
- Should be used for:
  - File I/O operations
  - Database queries
  - Web requests
  - Complex calculations
  - Long-running operations

:::caution[Thread Safety]

**Most Bukkit API methods are not thread-safe**. Always use synchronous tasks for:
- World modifications
- Entity operations
- Player data changes
- Inventory management
- Scoreboard updates
- Any operation that affects game state

:::

### Scheduling Methods

#### One-time Tasks

```java
// Run after delay
scheduler.runTaskLater(plugin, () -> {
    // Task code
}, 20); // 1 second delay

// Run asynchronously after delay
scheduler.runTaskLaterAsynchronously(plugin, () -> {
    // Async task code
}, 20);
```

#### Repeating Tasks

```java
// Run every period ticks
scheduler.runTaskTimer(plugin, task -> {
    // Task code
    if (shouldStop) {
        task.cancel();
    }
}, 0, 20); // Start immediately, run every second

// Run asynchronously every period ticks
scheduler.runTaskTimerAsynchronously(plugin, task -> {
    // Async task code
    if (shouldStop) {
        task.cancel();
    }
}, 0, 20);
```

#### Immediate Tasks

```java
// Run on next tick
scheduler.runTask(plugin, () -> {
    // Task code
});

// Run asynchronously immediately
scheduler.runTaskAsynchronously(plugin, () -> {
    // Async task code
});
```

### Task Implementation Options

#### Using Runnable

```java
// As a separate class
public class MyTask implements Runnable {
    private final MyPlugin plugin;
    
    public MyTask(MyPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public void run() {
        // Task code
    }
}

// Using lambda (recommended for simple tasks)
scheduler.runTask(plugin, () -> {
    // Task code
});
```

#### Using Consumer<BukkitTask>

```java
// For tasks that need to cancel themselves
scheduler.runTaskTimer(plugin, task -> {
    if (shouldStop) {
        task.cancel();
    }
    // Task code
}, 0, 20);
```

#### Using BukkitRunnable

```java
public class MyRunnable extends BukkitRunnable {
    @Override
    public void run() {
        // Task code
        if (shouldStop) {
            this.cancel();
        }
    }
}

// Usage
new MyRunnable().runTaskTimer(plugin, 0, 20);
```

## Best Practices

### Performance Considerations

1. **Minimize Task Frequency**
   - Only schedule tasks as frequently as necessary
   - Consider combining multiple tasks into one
   - Use appropriate delays for non-critical tasks

2. **Task Lifecycle Management**
   - Always cancel tasks when they're no longer needed
   - Cancel tasks in `onDisable()`
   - Store task IDs for later cancellation

3. **Resource Management**
   - Use weak references for long-lived tasks
   - Clean up resources in task cancellation
   - Avoid memory leaks in repeating tasks

### Common Patterns

#### Task Cancellation

```java
private int taskId;

@Override
public void onEnable() {
    this.taskId = scheduler.runTaskTimer(plugin, task -> {
        // Task code
    }, 0, 20).getTaskId();
}

@Override
public void onDisable() {
    scheduler.cancelTask(this.taskId);
}
```

#### Conditional Task Execution

```java
scheduler.runTaskTimer(plugin, task -> {
    if (!condition) {
        task.cancel();
        return;
    }
    // Task code
}, 0, 20);
```

#### Async to Sync Bridge

```java
scheduler.runTaskAsynchronously(plugin, () -> {
    // Async work
    final Result result = doAsyncWork();
    
    scheduler.runTask(plugin, () -> {
        // Sync work with result
        handleResult(result);
    });
});
```

## Common Pitfalls

1. **Memory Leaks**
   - Forgetting to cancel tasks
   - Holding strong references to large objects
   - Not cleaning up resources

2. **Thread Safety Issues**
   - Modifying game state from async tasks
   - Not properly synchronizing shared data
   - Race conditions in task execution

3. **Performance Problems**
   - Too many concurrent tasks
   - Tasks running too frequently
   - Heavy operations on main thread

## Debugging Tips

1. **Task Monitoring**
   - Use `/timings` to monitor task performance
   - Check server logs for task-related errors
   - Monitor TPS for task impact

2. **Common Issues**
   - Tasks not running: Check if plugin is enabled
   - Tasks running too slow: Check server TPS
   - Memory issues: Check for task leaks

:::tip[Pro Tips]
- Use Paper's `Timings` system to monitor task performance
- Consider using a task manager class for complex scheduling
- Always test tasks under load conditions
- Document task purposes and timing requirements
:::