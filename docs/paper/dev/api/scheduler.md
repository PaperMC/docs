---
slug: /dev/scheduler
---

# Scheduler

The `BukkitScheduler` can be used to schedule your code to be run later or run it repeatedly.

## What is a tick?

Every game runs something called a game loop which essentially executes all the logic of the game over and over,
a single execution of that loop is called a 'tick'.

In Minecraft's case the amount of ticks per second is 20, meaning that the game loop is executed 20 times per second.
With some math we can see that 1 tick is equal to 50 milliseconds. A tick taking more than 50ms to execute is the moment
when your server starts to fall behind on its work and lag.

### Converting between human units and Minecraft ticks

Every method of the scheduler that takes a delay or period uses ticks as a unit of time.

:::warning

The above also applies to the asynchronous methods. If you need **an asynchronous scheduler** with millisecond precision, create your own
[`ScheduledExecutorService`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ScheduledExecutorService.html).

:::

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
- your plugin's instance,
- the code to run, either with a `Runnable` or `Consumer<BukkitTask>` (the differences and usage are explained below),
- the delay in ticks before the task should run,
- the period in ticks between each execution of the task if you're scheduling a repeating task.

### Using `Runnable`

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
scheulder.runTaskLater(plugin, new MyRunnableTask(plugin), 20);
```

Or use a lambda expression which is great for simple and short tasks:

```java
scheduler.runTaskLater(
	plugin, 
	// Lambda:
	() -> {
		this.plugin.getServer().broadcast(Component.text("Hello, World!")
	},
	// End of the lambda
	20);
```

### Using `Consumer<BukkitTask>`

The Consumer interface is used for tasks that require a `BukkitTask` instance (usually in repeated tasks),
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
		if(this.entity.isDead()) task.cancel(); // The entity died, there's no point
		                                        // in running the code anymore.
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
	if(this.entity.isDead()) task.cancel();
	this.entity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
} /* End of the lambda */, 0, 20);
```

## Tasks on the main thread

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

This task will run repeatedly, first time after 10 seconds, and then every 5 seconds. After 10 minutes
the task will be canceled entirely.

```java
BukkitTask task = scheduler.runTaskTimer(plugin, () -> {
	server.broadcast(Component.text("Hello, World!"));
}, 10 * 20, 5 * 20);

scheduler.runTaskLater(plugin, () -> task.cancel(), TimeUnit.MINUTES.toSeconds(10) * 20);
```

### A repeating task with a dynamic period

This task will run repeatedly, first time after 10 seconds, and then every 20-100 ticks (1-5 seconds) chosen randomly.

```java
public class MyDynamicTask implements Runnable {
	
	private final Random random = new Random();
	private final MyPlugin plugin;
	
	public MyDynamicTask(MyPlugin plugin) {
		this.plugin = plugin;
	}
	
	@Override
	public void run() {
		this.plugin.getServer().broadcast(Component.text("Hello, World!"));
		this.plugin.getServer().getScheduler().runTaskLater(
			this.plugin,
			this,
			this.random.nextInt(20, 101)
		);
	}
	
}
```

Note that we schedule the task again in the `run` method, when scheduling initially we will also
use the `runTaskLater` method and not `runTaskTimer`.

```java
scheduler.runTaskLater(plugin, new MyDynamicTask(plugin), 10 * 20);
```