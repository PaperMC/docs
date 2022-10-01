---
slug: /reference/system-properties
---

# Paper System Properties 

These system properties can be set when you start your server allowing for the configuration of various settings.

:::danger Danger Ahead

Setting flags for the JVM can alter how it operates and the same goes for the paper server.
If you are unsure about what a flag does, it is recommended that you **do not use it**.

:::

## How they work

System properties are set when you start your server. For example, if you are using a `.bat` or a `.sh` file to start your server, you can add the system properties to the file. For example:

```bash
java -Dpaper.log-level=FINE -jar paper.jar
```

Where a `-D` is used to set a system property, and the system property is `paper.log-level` with a value of `FINE`. Otherwise, just add them to the start command

## List of System Properties

#### paper.playerconnection.keepalive:

- **default**: `30`
- **description**: Controls how long the player connection will wait before closing in seconds.

#### paper.ticklist-excessive-delay-threshold:

- **default**: `60`
- **description**: Sets the excessive tick delay to the specified number of seconds.

#### timings.bypassMax:

- **default**: `unset`
- **description**: Allows for bypassing the max number of frames to send to the Aikar's Timings API. Setting this will not permit bypassing the limit unless the API is configured to allow it.

#### LetMeReload:

- **default**: `unset`
- **description**: Overrides the need to send confirmation message when using the `/reload` command.

#### paper.disableChannelLimit:

- **default**: `unset`
- **description**: Disables the plugin channel limit for the server. This will disable the limit of 128 plugin channels per player.

#### net.kyori.adventure.text.warnWhenLegacyFormattingDetected:

- **default**: `true`
- **description**: Enables or disables the warning when legacy formatting is detected.

#### Paper.DisableClassPrioritization:

- **default**: `unset`
- **description**: Disables the class prioritization system - mostly an issue when failing to relocate or shade properly.

#### Paper.disableFlushConsolidate:

- **default**: `unset`
- **description**: Disables the netty flush consolidation system.

#### Paper.debugDynamicMissingKeys:

- **default**: `unset`
- **description**: Enables debug logging for missing keys in NBT objects.

#### disable.watchdog:

- **default**: `unset`
- **description**: Disables the watchdog warning system.

#### paper.explicit-flush:

- **default**: `unset`
- **description**: Enables explicit flushing of the network channel.

#### Paper.enable-sync-chunk-writes:

- **default**: `unset`
- **description**: Syncs writes on each write call. This has a performance impact, particularly on hard drives.

#### paper.debug-sync-loads:

- **default**: `unset`
- **description**: Enables debug logging for sync chunk loads.

#### Paper.ignoreWorldDataVersion:

- **default**: `unset`
- **description**: Ignores the world data version when loading a world. This is not recommended and will likely cause issues.

#### Paper.allowAsyncChunksSingleCore:

- **default**: `unset`
- **description**: Allows async chunk loading on single core systems.

#### debug.entities:

- **default**: `unset`
- **description**: Enables debug log messages for entity information.

#### Paper.bypassHostCheck:

- **default**: `unset`
- **description**: Bypasses the host pattern matching attempt for the client when connecting to the server.

#### paper.ticklist-warn-on-excessive-delay:

- **default**: `unset`
- **description**: Enables the warning when a tick list is scheduled with an excessive delay.

#### debug.rewriteForIde:

- **default**: `unset`
- **description**: Removes the NMS revision from the stack trace to allow for easier debugging in IDEs. 
It also remaps plugin CB calls to remove the version information.

#### convertLegacySigns:

- **default**: `unset`
- **description**: Converts legacy signs to the new format.

#### paper.maxCustomChannelName:

- **default**: `64`
- **description**: Sets the largest size that a plugin channel can be.

#### Paper.maxSignLength:

- **default**: `80`
- **description**: Sets the maximum line length for signs.

#### Paper.FilterThreshhold:

- **default**: `8192`
- **min**: `8192`
- **description**: Sets the maximum size of a packet to be filtered.

#### Paper.minPrecachedDatafixVersion:

- **default**: `Minecraft world version + 1`
- **description**: If you are expecting to convert a large number of chunks you might consider setting this to only convert from a point onwards.

#### paper.maxChunkThreads:

- **default**: `4`
- **description**: Sets the maximum number of threads to use for chunk loading. You cannot use more than half of the available cores.

#### Paper.WorkerThreadCount:

- **default**: `8` or `number of cpus - 2`. Whichever is lower
- **description**: Sets the number of worker threads to use for chunk loading.

#### Paper.excessiveTELimit:

- **default**: `750`
- **description**: Splits tile entities into multiple packets if there are more than this many.

#### paper.maxChunkThreads:

- **default**: `4` but is capped at `number of cpus / 2`
- **description**: Sets the maximum number of threads to use for chunk loading.

#### io.papermc.paper.suppress.sout.nags:

- **default**: `unset`
- **description**: Suppresses the nag message about using System.out/System.err in a plugin.

#### paper.strict-thread-checks:

- **default**: `unset`
- **description**: Overrides the status of the AsyncCatcher so that it will always throw an exception if it is not on the main thread.

#### Paper.skipServerPropertiesComments:

- **default**: `unset`
- **description**: Skips the comments in the server.properties file.

#### Paper.debugInvalidSkullProfiles:

- **default**: `unset`
- **description**: Enables debug logging for invalid skull profiles. It appends an exception to the log.

#### paper.alwaysPrintWarningState:

- **default**: `unset`
- **description**: Always prints the warning state for the particular level.

#### Paper.printStacktraceOnBadPluginClassAccess:

- **default**: `unset`
- **description**: Prints a stacktrace when a plugin attempts to access a class that is not a dependency of the plugin.
