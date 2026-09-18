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
[15:20:42 ERROR]: Could not pass event PluginEnableEvent to ExamplePlugin v1.0
java.lang.NullPointerException: Cannot invoke "Object.toString()" because "player" is null
        at ExamplePlugin.jar//com.example.paperplugin.ExamplePlugin.on(ExamplePlugin.java:21) ~[?:?]
        at org.bukkit.plugin.RegisteredListener.callEvent(RegisteredListener.java:71) ~[paper-api-26.2.build.112-stable.jar:?]
        at io.papermc.paper.plugin.manager.PaperEventManager.callEvent(PaperEventManager.java:54) ~[paper-26.2.jar:26.2-112-c9e894d]
        at io.papermc.paper.plugin.manager.PaperPluginManagerImpl.callEvent(PaperPluginManagerImpl.java:131) ~[paper-26.2.jar:26.2-112-c9e894d]
        at org.bukkit.plugin.SimplePluginManager.callEvent(SimplePluginManager.java:627) ~[paper-api-26.2.build.112-stable.jar:?]
        at io.papermc.paper.plugin.manager.PaperPluginInstanceManager.enablePlugin(PaperPluginInstanceManager.java:212) ~[paper-26.2.jar:26.2-112-c9e894d]
        at io.papermc.paper.plugin.manager.PaperPluginManagerImpl.enablePlugin(PaperPluginManagerImpl.java:109) ~[paper-26.2.jar:26.2-112-c9e894d]
        at org.bukkit.plugin.SimplePluginManager.enablePlugin(SimplePluginManager.java:519) ~[paper-api-26.2.build.112-stable.jar:?]
        at org.bukkit.craftbukkit.CraftServer.enablePlugin(CraftServer.java:633) ~[paper-26.2.jar:26.2-112-c9e894d]
        at org.bukkit.craftbukkit.CraftServer.enablePlugins(CraftServer.java:590) ~[paper-26.2.jar:26.2-112-c9e894d]
        at net.minecraft.server.dedicated.DedicatedServer.initServer(DedicatedServer.java:298) ~[paper-26.2.jar:26.2-112-c9e894d]
        at net.minecraft.server.MinecraftServer.runServer(MinecraftServer.java:1266) ~[paper-26.2.jar:26.2-112-c9e894d]
        at net.minecraft.server.MinecraftServer.lambda$spin$0(MinecraftServer.java:303) ~[paper-26.2.jar:26.2-112-c9e894d]
        at java.base/java.lang.Thread.run(Thread.java:1474) ~[?:?]
```

-   Firstly, we can see that this certain error occurred when a [](jd:paper:org.bukkit.event.server.PluginEnableEvent)
    was being handled by the `ExamplePlugin`.

-   Then we can see on the second line, the cause of the exception:
    > `java.lang.NullPointerException: Cannot invoke "Object.toString()" because "player" is null`

    This tells us that the exception was caused by a [](jd:java:java.lang.NullPointerException),
    and that the exception was caused because we tried to call the `toString()` method on a null "player" object.

-   From here, as we work down the stacktrace, we can see the exact path of execution that led to the error. In this case,
    the next line of the stacktrace is:
    > `at ExamplePlugin.jar//com.example.paperplugin.ExamplePlugin.on(ExamplePlugin.java:21) ~[?:?]`

    Which tells us that the error was thrown at line 21 of `ExamplePlugin.java`.

-   You can continue to work down the stacktrace, and see the exact path of execution that led to the error. In this case,
    it is server internals, so we can generally ignore it.

## Omitted stacktraces

In JDK 5, the JVM started to omit stacktraces for certain exceptions. This was common when the JVM had optimized the code,
and you could get `NullPointerException`s without a stacktrace. In order to fix this, you can pass the `-XX:-OmitStackTraceInFastThrow` flag to the JVM:

```bash
java -XX:-OmitStackTraceInFastThrow -jar paper.jar
```
