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

### Converting between SI units and Minecraft ticks

Every method of the scheduler that takes a delay or period uses ticks as a unit of time.

:::warning

The above also applies to the asynchronous methods. If you need a scheduler with millisecond precision, create your own
[`ScheduledExecutorService`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ScheduledExecutorService.html).

:::

Converting from human units to ticks and back is as simple as:  
`ticks = seconds * 20`  
`seconds = ticks / 20`

:::note

In Java and Kotlin to not lose precision you must use `ticks / 20.0`.

:::

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