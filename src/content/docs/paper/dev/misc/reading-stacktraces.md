---
title: Reading stacktraces
description: Stacktraces are produced by the JVM when an exception occurs. This guide will discuss the basics of how to read them.
slug: paper/dev/reading-stacktraces
---

## What is a stacktrace?
In Java, a stacktrace shows the call stack of a thread. The call stack is the path of execution that led to the current point in the program.
Usually, the stacktrace will be printed to the console when an exception is not handled correctly.

Stacktraces are a useful tool for debugging your code. They show you the exact line of code that caused an error, and the
line of code that called that line of code, and so on. This is useful because it allows you to see the exact path of execution that led to the error.

### Example

Here is an example of a stacktrace, which has been caused due to a `NullPointerException`:

```
[15:20:42 ERROR]: Could not pass event PluginEnableEvent to TestPlugin v1.0
java.lang.NullPointerException: Cannot invoke "Object.toString()" because "player" is null
        at io.papermc.testplugin.TestPlugin.onPluginEnable(TestPlugin.java:23) ~[TestPlugin-1.0-SNAPSHOT.jar:?]
        at com.destroystokyo.paper.event.executor.asm.generated.GeneratedEventExecutor1.execute(Unknown Source) ~[?:?]
        at org.bukkit.plugin.EventExecutor$2.execute(EventExecutor.java:77) ~[paper-api-1.20.2-R0.1-SNAPSHOT.jar:?]
        at co.aikar.timings.TimedEventExecutor.execute(TimedEventExecutor.java:81) ~[paper-api-1.20.2-R0.1-SNAPSHOT.jar:git-Paper-49]
        at org.bukkit.plugin.RegisteredListener.callEvent(RegisteredListener.java:70) ~[paper-api-1.20.2-R0.1-SNAPSHOT.jar:?]
        at io.papermc.paper.plugin.manager.PaperEventManager.callEvent(PaperEventManager.java:54) ~[paper-1.20.2.jar:git-Paper-49]
        at io.papermc.paper.plugin.manager.PaperPluginManagerImpl.callEvent(PaperPluginManagerImpl.java:126) ~[paper-1.20.2.jar:git-Paper-49]
        at org.bukkit.plugin.SimplePluginManager.callEvent(SimplePluginManager.java:615) ~[paper-api-1.20.2-R0.1-SNAPSHOT.jar:?]
        at io.papermc.paper.plugin.manager.PaperPluginInstanceManager.enablePlugin(PaperPluginInstanceManager.java:200) ~[paper-1.20.2.jar:git-Paper-49]
        at io.papermc.paper.plugin.manager.PaperPluginManagerImpl.enablePlugin(PaperPluginManagerImpl.java:104) ~[paper-1.20.2.jar:git-Paper-49]
        at org.bukkit.plugin.SimplePluginManager.enablePlugin(SimplePluginManager.java:507) ~[paper-api-1.20.2-R0.1-SNAPSHOT.jar:?]
        at org.bukkit.craftbukkit.v1_20_R2.CraftServer.enablePlugin(CraftServer.java:636) ~[paper-1.20.2.jar:git-Paper-49]
        at org.bukkit.craftbukkit.v1_20_R2.CraftServer.enablePlugins(CraftServer.java:547) ~[paper-1.20.2.jar:git-Paper-49]
        at net.minecraft.server.MinecraftServer.loadWorld0(MinecraftServer.java:636) ~[paper-1.20.2.jar:git-Paper-49]
        at net.minecraft.server.MinecraftServer.loadLevel(MinecraftServer.java:435) ~[paper-1.20.2.jar:git-Paper-49]
        at net.minecraft.server.dedicated.DedicatedServer.initServer(DedicatedServer.java:308) ~[paper-1.20.2.jar:git-Paper-49]
        at net.minecraft.server.MinecraftServer.runServer(MinecraftServer.java:1101) ~[paper-1.20.2.jar:git-Paper-49]
        at net.minecraft.server.MinecraftServer.lambda$spin$0(MinecraftServer.java:318) ~[paper-1.20.2.jar:git-Paper-49]
        at java.lang.Thread.run(Thread.java:833) ~[?:?]
```

-   Firstly, we can see that this certain error occurred when a [`PluginEnableEvent`](jd:paper:org.bukkit.event.server.PluginEnableEvent)
    was being handled by the `TestPlugin`.

-   Then we can see on the second line, the cause of the exception:
    > `java.lang.NullPointerException: Cannot invoke "Object.toString()" because "player" is null`

    This tells us that the exception was caused by a [`NullPointerException`](jd:java:java.lang.NullPointerException),
    and that the exception was caused because we tried to call the `toString()` method on a null "player" object.

-   From here, as we work down the stacktrace, we can see the exact path of execution that led to the error. In this case,
    the next line of the stacktrace is:
    > `at io.papermc.testplugin.TestPlugin.onPluginEnable(TestPlugin.java:23) ~[TestPlugin-1.0-SNAPSHOT.jar:?]`

    Which tells us that the error was thrown at line 23 of `TestPlugin.java`.

-   You can continue to work down the stacktrace, and see the exact path of execution that led to the error. In this case,
    it is server internals, so we can generally ignore it.

## Omitted stacktraces

In JDK 5, the JVM started to omit stacktraces for certain exceptions. This was common when the JVM had optimized the code,
and you could get `NullPointerException`s without a stacktrace. In order to fix this, you can pass the `-XX:-OmitStackTraceInFastThrow` flag to the JVM:

```bash
java -XX:-OmitStackTraceInFastThrow -jar paper.jar
```
