---
title: Basic troubleshooting
description: This guide will help you diagnose your server's problem before reporting it to PaperMC or the plugin's author.
slug: paper/basic-troubleshooting
---

This guide will help you diagnose your server's problem before reporting it to PaperMC or the plugin's author.

:::caution[Stop Your Server And Take A Backup]

Before following this guide, stop your server first. Modifying server files while it is still running will corrupt them. Only a full server shutdown can prevent this.

Also, if you don't follow this guide carefully or make a mistake while following it, you might corrupt your server. It is highly advised to back up your server before following this guide. Archiving your server folder as a .zip is good enough, or if you prefer, use backup software such as [borg](https://www.borgbackup.org/) or [kopia](https://kopia.io/). It would be ideal to create a test server by copying your production server's file, but that's not always possible.

:::

If your server encounters a problem, it will either print an error message on the server console, create a crash report and close itself, or do both.
If your server crashes, the crash report will be saved in the crash-report directory. If your server didn't crash, those error messages will be stored in the log directory along with other messages.

Note that the logs older than the latest will be compressed and not stored as plain text files.

The first thing you have to do is diagnose those messages.

Almost every problem you encounter will print error message lines, which are called a "stack trace", on the server console. Examining the stack trace will help you find out what is causing problems on your server.

The stack trace starts with the error message, exception type, and exception message.

Both error messages and exception messages were put there by the developer of either your plugin or Paper. These messages tell you what problem your server experienced. An exception type like `java.lang.RuntimeException` tells you the type of the exception. This will help the developer (and you) understand the type of problem. A good starting point is to search the exception type and message in the [Paper Discord](https://discord.gg/papermc).

Many lines beginning with `at` may appear beneath the exception message. These are the body of the stack trace. These lines tell you where the problem starts. The top line of the body of the stack trace will tell you exactly where the problem occurred and, if possible, display where it came from.

Issues are often plugin-induced, and are the first possible thing you should check.

# Common issues

## Plugin-induced issues
If you find any plugin's name in a stack trace in your logs, head to [Check Plugin Updates](#check-plugin-updates) and read from there. In most cases, the plugin, whose name is found on the stack trace, is causing the problem.

You can disable all of your plugins by renaming the plugins directory to something else, such as plugins-disabled, or by archiving the plugins directory and deleting it.

After that, try to run your server.

If the problem is resolved after removing the plugins, you know that it was a plugin that caused the issue.

### Binary search
In case you've determined a plugin is causing issues but cannot narrow it down, try a binary search.

1. Split your plugins into two groups. The size of the two groups can be different, but it is ideal if the difference is minimal. Make sure that plugins that depend on each other are grouped together.
2. Disable one of the two groups of plugins. You can disable them by changing their extension from .jar to something else, such as .jar-disabled, or move them outside the plugins directory and into a temporary directory.
3. Run your server and check if the problem still exists. If the problem is resolved, the plugin that caused the issue is one of the disabled plugins. If the problem is not resolved, the plugin that is causing the issue is one of the active plugins.
4. Repeat from the start with the suspect plugin group.
Repeat the steps above with groups that have the plugin that is causing the issue.

:::caution[Library Plugin Dependencies]

Some plugins that you install are not a typical plugin, but a library. These are installed like plugins, however tend to offer few user-facing features and are relied upon by other plugins for their functionality. If you disable a library, plugins that depend on it will not work properly. Common examples of these libraries are ProtocolLib, Vault providers, permission plugins, etc.

:::

### Check plugin updates
There is a chance that your problem is already fixed in the latest release or latest build of the plugin.

Head to your plugin's official download page and check if you are using the latest build or the latest release of the plugin. If not, update it to the latest version and try to run your server again to see if the problem is resolved.

### Update library plugins
Many plugins use library plugins like ProtocolLib, and you have to download them and put them in the plugins directory.

If you don't update them to the latest version or latest build, you might experience problems related to plugins that use the library plugin.

Some library plugins tell their users to use their latest development build for support of the latest Minecraft version. You should look carefully at the requirements of your plugin.

### Check documentation
If you misconfigured your plugin or your server, it can also cause problems on your server. Many plugins provide their own documentation about how to set them up properly. Read those documents carefully and check if there is something wrong with the plugin's configuration.

If your problem is related to a plugin you use, and you still don't know how to solve it, you can try to reach out to the plugin's author. Many plugins have a way to contact their author, like a GitHub issue tracker, Discord support guild, Gitter, IRC, etc.

Below, we list other issues that may happen when running a server.

## Server does not start
When this happens, always check your `latest.log` file in your `logs` folder, you may find your issue listed here. If logs are not generating, check your startup script, as described below:

### Checking your startup script
The recommended way to start a server is via a startup script, that you can generate [here](/misc/tools/start-script-gen). Don't double click the .jar!
If you're on Windows and your terminal disappears quickly after you run, make sure there's a line at the end of the file containing just `pause`.
In case you get an error similar to `Error: Unable to access jarfile server.jar`, make sure that the .jar name in your startup script is the same as the file you downloaded. Note that Windows, by default, hides extensions, so you may need re-enable that in the Folder and Search Options in the file explorer to see the correct name of the file, extension included.

### Failed to bind to port
This may happen in two cases:
1. A server is already running, check your task manager app for Java processes.
2. `server-ip`, in `server.properties`, is configured incorrectly. Note that this option is not a placeholder for your external IP, it controls which network interfaces your server will bind to. Most of the time, it should be left empty.

### Attempted to load chunk saved with newer version
```
java.lang.RuntimeException: Server attempted to load chunk saved with newer version of minecraft! 3955 > 3465
[18:23:38 WARN]:        at net.minecraft.world.level.chunk.storage.ChunkRegionLoader.loadChunk(ChunkRegionLoader.java:149)
[18:23:38 WARN]:        at io.papermc.paper.chunk.system.scheduling.ChunkLoadTask$ChunkDataLoadTask.runOffMain(ChunkLoadTask.java:338)
[18:23:38 WARN]:        at io.papermc.paper.chunk.system.scheduling.GenericDataLoadTask$ProcessOffMainTask.run(GenericDataLoadTask.java:307)
[18:23:38 WARN]:        at ca.spottedleaf.concurrentutil.executor.standard.PrioritisedThreadedTaskQueue$PrioritisedTask.executeInternal(PrioritisedThreadedTaskQueue.java:351)
[18:23:38 WARN]:        at ca.spottedleaf.concurrentutil.executor.standard.PrioritisedThreadedTaskQueue.executeTask(PrioritisedThreadedTaskQueue.java:118)
[18:23:38 WARN]:        at ca.spottedleaf.concurrentutil.executor.standard.PrioritisedThreadPool$PrioritisedThread.pollTasks(PrioritisedThreadPool.java:274)
[18:23:38 WARN]:        at ca.spottedleaf.concurrentutil.executor.standard.PrioritisedQueueExecutorThread.run(PrioritisedQueueExecutorThread.java:50)
```

That error means that your world was created or opened in a server version that's newer than one you're currently running. Downgrading your world is not supported, so make sure to use the latest supported version of Paper. Even if you haven't joined the server, by loading your world in a newer version, it is upgraded automatically.

:::danger[Forcing the server to try to load a newer world]

The server will start if you use the `-DPaper.ignoreWorldDataVersion=true` flag. However, this is **highly not recommended, completely unsupported and may permanently corrupt your world**. If you're going to attempt this, take a backup.

:::

### Circular plugin loading

```
[15:01:04] [Server thread/ERROR]: [SimpleProviderStorage] Circular plugin loading detected!
[15:01:04] [Server thread/ERROR]: [SimpleProviderStorage] Circular load order:
[15:01:04] [Server thread/ERROR]: [SimpleProviderStorage]   Plugin1 -> Plugin2 -> Plugin3 -> Plugin4 -> Plugin1
[15:01:04] [Server thread/ERROR]: [SimpleProviderStorage] Please report this to the plugin authors of the first plugin of each loop or join the PaperMC Discord server for further help.
[15:01:04] [Server thread/ERROR]: [SimpleProviderStorage] If you would like to still load these plugins, acknowledging that there may be unexpected plugin loading issues, run the server with -Dpaper.useLegacyPluginLoading=true
```

That means your plugins are configured in a way such that they want to start before (or after) each other, which is impossible -- one has to go first. Plugins usually have reasons to want to start before each other, so when such a conflict happens, rather than picking randomly and risking issues, the server warns you about the issue and shuts down.
There's often a problematic plugin involved, and to solve this, it's preferable that you report the issue to its authors. Removing it should also fix the issue. As a last resort, you can use the `-Dpaper.useLegacyPluginLoading=true` startup flag, but it may cause hard to debug issues.

### Outdated version of Java

```
Exception in thread "ServerMain" java.lang.UnsupportedClassVersionError: org/bukkit/craftbukkit/Main has been compiled by a more recent version of the Java Runtime (class file version 65.0), this version of the Java Runtime only recognizes class file versions up to 61.0
        at java.base/java.lang.ClassLoader.defineClass1(Native Method)
        at java.base/java.lang.ClassLoader.defineClass(ClassLoader.java:1017)
        at java.base/java.security.SecureClassLoader.defineClass(SecureClassLoader.java:150)
        at java.base/java.net.URLClassLoader.defineClass(URLClassLoader.java:524)
        at java.base/java.net.URLClassLoader$1.run(URLClassLoader.java:427)
        at java.base/java.net.URLClassLoader$1.run(URLClassLoader.java:421)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:712)
        at java.base/java.net.URLClassLoader.findClass(URLClassLoader.java:420)
        at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:592)
        at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:525)
        at java.base/java.lang.Class.forName0(Native Method)
        at java.base/java.lang.Class.forName(Class.java:467)
        at io.papermc.paperclip.Paperclip.lambda$main$0(Paperclip.java:38)
        at java.base/java.lang.Thread.run(Thread.java:842)
```

Your version of Java is outdated, check [our guide on updating it](/misc/java-install). To avoid possibly having to do more tweaks, uninstall your current version of Java, if any.
If you do have the correct version installed, your operating system may be not picking it up. Make sure you've closed and opened your terminal after installing it, and that Java is present in your `PATH` environment variable.

## Server crashes or exits unexpectedly

:::caution[Update!]

Always keep your server up to date (and take a backup before updating). Older versions are known to have on-demand crashes that can be triggered by players at any time.

:::

### Unexpected graceful shutdown
If your server shuts down normally as if you typed `/stop` or pressed a stop button in your panel, enable `debug` in `server.properties`. The next time the server shuts down, you will get a stack trace that will help you debug.

### Watchdog dump ("DO NOT REPORT THIS TO PAPER")
```
[02:04:00] [Paper Watchdog Thread/ERROR]: --- DO NOT REPORT THIS TO PAPER - THIS IS NOT A BUG OR A CRASH  - 1.21.3-66-afb5b13 (MC: 1.21.3) ---
[02:04:00] [Paper Watchdog Thread/ERROR]: The server has not responded for 10 seconds! Creating thread dump
[02:04:00] [Paper Watchdog Thread/ERROR]: ------------------------------
[02:04:00] [Paper Watchdog Thread/ERROR]: Server thread dump (Look for plugins here before reporting to Paper!):
[02:04:00] [Paper Watchdog Thread/ERROR]: ------------------------------
[02:04:00] [Paper Watchdog Thread/ERROR]: Current Thread: Server thread
[02:04:00] [Paper Watchdog Thread/ERROR]: PID: 129 | Suspended: false | Native: true | State: RUNNABLE
[02:04:00] [Paper Watchdog Thread/ERROR]: Stack:
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/sun.nio.ch.UnixFileDispatcherImpl.write0(Native Method)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/sun.nio.ch.UnixFileDispatcherImpl.write(UnixFileDispatcherImpl.java:65)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/sun.nio.ch.IOUtil.writeFromNativeBuffer(IOUtil.java:137)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/sun.nio.ch.IOUtil.write(IOUtil.java:102)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/sun.nio.ch.IOUtil.write(IOUtil.java:72)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/sun.nio.ch.FileChannelImpl.write(FileChannelImpl.java:300)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/sun.nio.ch.ChannelOutputStream.writeFully(ChannelOutputStream.java:68)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/sun.nio.ch.ChannelOutputStream.write(ChannelOutputStream.java:105)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/java.io.BufferedOutputStream.flushBuffer(BufferedOutputStream.java:125)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/java.io.BufferedOutputStream.implFlush(BufferedOutputStream.java:252)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/java.io.BufferedOutputStream.flush(BufferedOutputStream.java:240)
[02:04:00] [Paper Watchdog Thread/ERROR]: java.base@21.0.5/java.io.FilterOutputStream.close(FilterOutputStream.java:184)
```

That message shows up when your server is taking very long (10+ seconds) to finish the current tick -- it's not a bug or crash, it's simply warning you of severe lag, that can eventually lead to a crash.
A good rule of thumb is checking the first lines of the stack trace, as that shows where the main thread was stuck at the time it was printed. Many times, that points to the root cause of the issue.
However, sometimes the issue may not be obvious or appear in the stack trace. If possible, analyze a [spark report](#spark-report) for more details, and, if you're in doubt about how to proceed, feel free to visit the [Paper Discord](https://discord.gg/papermc) for help.

### Crash without logs
If you have access to a Linux shell, run `dmesg -T | grep -i killed`. That should show how your server process was killed.
A common cause (but not the only one), if it was killed due to OOM, is that your server panel is configured with a memory limit that's too close to your `-Xmx`. Either reduce `-Xmx` (by 1-2GB is a good initial rule of thumb) or increase/disable the memory limits in your panel.
If you're using a hosting company that only provides you with a panel, you likely won't have the tools to get to the bottom of the problem. You should make a ticket with your host in this case.

## Performance and gameplay issues
Unfortunately, Paper can't replicate Vanilla behavior 100%, but it is a goal (except when it comes to exploits). If you're still experiencing a bug that cannot be reproduced in vanilla **multiplayer**, please apply a [Vanilla-like configuration](/paper/vanilla) and check if there's already an open issue in our GitHub. If not, feel free to create one.

### Strange entity/farm/redstone/spawning behavior
If you copied values of a pre-made configuration or optimization guide, now is a good time to revert the changes. Keep a copy of your current configs if you prefer, and delete the originals so they can re-generate to default values.

In case you're still experiencing such issues with default configurations, try our [Vanilla-like configurations](/paper/vanilla) but do note that this comes at a performance cost.

Also, keep in mind that singleplayer does not behave the same as multiplayer, both when it comes to spawning and certain entity behavior. For example, mobs despawn if they're over 128 blocks away from a player, and this becomes more apparent in multiplayer, especially if you're making farms where monsters go to another dimension via a nether portal. If there are players in the target dimension and they're all very far from the portal, the mob will instantly despawn -- this is intended Vanilla behavior.

### Dupes not working
Paper has some [unsupported settings](/paper/reference/global-configuration#unsupported_settings) that allow certain dupes. However, a few of them cannot be re-introduced because that would break other aspects of the server. Paper also will not re-add dupes that no longer exist in the game.

## Performance issues
### Spark report
Paper has the [spark](https://spark.lucko.me/) profiler built-in, in order to diagnose the root cause of performance issues.
For example, you can generate a report for 300 seconds by running `/spark profiler start --timeout 300`
If you want to diagnose lag spikes that last more than, for example, 100 ms, you can run `/spark profiler start --only-ticks-over 100 --timeout 300`

Look into the [spark docs](https://spark.lucko.me/docs) for a more in-depth guide on how to use it and read reports. If you're still unsure about what's the cause of your problem, you can send us the link via the [Paper Discord](https://discord.gg/papermc).

### High RAM usage
Unless you're experiencing out of memory crashes or bad garbage collection (GC) times, high memory usage is expected.

Java programs store objects in memory, in an area where we call the heap. The heap grows over time, you can set its initial value with `-Xms` and the maximum value with `-Xmx`.

It's normal that the Java process will use the RAM it's given, sometimes using a little more than `-Xmx`. This number won't go down over time, as the garbage collector (GC) rarely returns RAM to the operating system in servers. This is by itself not a problem, in fact it's beneficial: by having more heap memory to work with, GC will have to worry less about disposing of garbage, as that takes valuable processing time. This is not a memory leak and will not cause out of memory crashes, which are commonly caused by not leaving enough RAM for your OS or improperly configured memory limits in a container.

There are several different memory metrics that can be measured. For example, imagine a server in a 16GB container, running with `-Xms1G -Xmx14G`. In this case:
* **Container memory limit:** 16GB
* **Maximum heap:** 14GB
* **Current heap size:** Starts at 1GB and expands quickly. Will be between 1-14GB at any given point
* **Current heap usage:** will be smaller than the number above, and will grow and shrink in a sawtooth pattern under normal conditions

Keep in mind that different tools choose different metrics out of these to display, so the usage meter in your panel, at a glance, might not look like what a plugin will display.

### Low CPU usage
Paper is able to make use of multiple cores, but this does not necessarily mean that you will have several cores at near 100% usage. A major source of load in the server comes from the tick loop, which uses a single thread. Thus, at a certain point, more cores will not give you a performance benefit, so it's advisable to go for a CPU with high single-threaded performance and allocate a sufficient amount of threads to your server (at least 4). In servers with a high core count, this situation can translate to a low CPU usage relative to the total amount of cores.

However, if your server (especially if large) is really adamant on using only a single core, check your panel's CPU allocation setting. In certain panels, a number like `4` doesn't mean it'll use 4 cores, but instead that it will use the one core with ID 4.
