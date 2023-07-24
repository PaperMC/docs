---
slug: /dev/scheduler
---

# Using the Scheduler

The `BukkitScheduler` can be used to schedule your code to be run later or repeatedly.

## What is a tick?

Every game runs something called a game loop which essentially executes all the logic of the game over and over,
a single execution of that loop is called a 'tick'.

In Minecraft's case the amount of ticks per second is 20, or one tick every 50 milliseconds,
meaning that the game loop is executed 20 times per second. A tick taking more than 50ms to execute is the moment
when your server starts to fall behind on its work and lag.

### Converting between human units and Minecraft ticks

Every method of the scheduler that takes a delay or period uses ticks as a unit of time.

Converting from human units to ticks and back is as simple as:  
`ticks = seconds * 20`  
`seconds = ticks / 20`

You can make your code more readable by using the
[`TimeUnit`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/TimeUnit.html)
enum, e.g. to convert 5 minutes to ticks and back:  
`TimeUnit.MINUTES.toSeconds(5) * 20`  
`TimeUnit.SECONDS.toMinutes(ticks / 20)`

## Obtaining the scheduler

To obtain a scheduler you can use the instance method on the `Server` class, e.g. in your `onEnable` method:

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

Asynchronous tasks are tasks that are executed on separate threads, therefore will not affect
your server's performance.

:::warning

**You cannot safely access the Bukkit API from within asynchronous tasks**. If a method is not explicitly marked
as thread-safe or isn't obviously designed to be used asynchronously **you will eventually encounter errors**.

:::

:::info

While the tasks are executed on separate threads, they are still started from the main thread
and will be affected if the server is lagging, an example would be 20 ticks not being exactly 1 second.

If you need a scheduler that runs independently of the server consider using your own
[`ScheduledExecutorService`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ScheduledExecutorService.html).
You can follow [this guide](https://www.baeldung.com/java-executor-service-tutorial#ScheduledExecutorService) to learn how to use it.

:::

### Difference between `Runnable` and `Consumer<BukkitTask>`

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

#### Using `Consumer<BukkitTask>` {#using-consumerbukkittask}

The `Consumer` interface is used for tasks that require a `BukkitTask` instance (usually in repeated tasks),
e.g. when you want to cancel the task from inside it.

You can either implement it in a separate class similarly to the `Runnable`, e.g.:

```java
public class MyConsumerTask implements Consumer<BukkitTask> {
	
	private final LivingEntity entity;
	
	public MyConsumerTask(LivingEntity entity) {
		this.entity = entity;
	}
	
	@Override
	public void accept(BukkitTask task) {
		if(this.entity.isDead()) {
			task.cancel(); // The entity died, there's no point
			return;        // in running the code anymore.
		}
		
		this.entity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
	}
	
}
```
```java
scheduler.runTaskTimer(plugin, new MyConsumerTask(someEntity), 0, 20);
```

Or use a lambda expression which again is much cleaner for short and simple tasks:

```java
scheduler.runTaskTimer(plugin, /* Lambda: */ task -> {
	if (this.entity.isDead()) {
		task.cancel();
		return;
	}
	this.entity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
} /* End of the lambda */, 0, 20);
```

## Examples of tasks on the main thread

### A task to run later once

This task will run a single time after the delay specified in ticks, in this case 1 second.

```java
scheduler.runTaskLater(plugin, () -> {
	server.broadcast(Component.text("Hello, World!"));
}, 20);
```

### A task to run later repeatedly

This task will run repeatedly, first time after the delay specified in ticks - in this case 1 second -
and then every period specified in ticks - in this case 5 seconds.

```java
scheduler.runTaskTimer(plugin, () -> {
	server.broadcast(Component.text("Hello, World!"));
}, 20, 5 * 20);
```

### A repeating task to be canceled later

Cancelling a repeating task requires you to have an instance of a `BukkitTask`.
After obtaining it, simply use the `cancel()` method.  
The example on how to use a [`Consumer<BukkitTask>`](#using-consumerbukkittask) already shows exactly how to do it.