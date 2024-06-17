---
slug: /reference/system-properties
description: Documentation for the system properties Paper may check.
---

# Paper System Properties

These system properties can be set when you start your server allowing for the configuration of various settings.

:::danger[Danger Ahead]

Setting flags for the JVM can alter how it operates and the same goes for the Paper server.
If you are unsure about what a flag does, it is recommended that you **do not use it**.

:::

## How they work

System properties are set when you start your server. For example, if you are using a `.bat` or a `.sh` file to start your server, you can add the system properties to the file. For example:

```bash
java -Dpaper.log-level=FINE -jar paper.jar
```

:::info

Some of Paper's system properties contain a `.` character in their name. When using PowerShell, these will require wrapping in quotes.
i.e. `"-Dpaper.log-level=FINE"`

:::

Where a `-D` is used to set a system property, and the system property is `paper.log-level` with a value of `FINE`. Otherwise, just add them to the start command

:::note

Where a system property is stated as `unset`, setting it as `true` will work to enable it.

:::

## List of system properties

#### paper.playerconnection.keepalive:

- **default**: `30`
- **description**: Controls how long the player connection will wait before closing when not receiving any keepalives, in seconds.

#### timings.bypassMax:

- **default**: `unset`
- **description**: Allows for bypassing the max amount of data to send to the Aikar's Timings API. Setting this will not permit bypassing the limit unless the API is configured to allow it.

#### LetMeReload:

- **default**: `unset`
- **description**: This disables the reload confirmation message when using the `/reload` command.

#### paper.disableChannelLimit:

- **default**: `unset`
- **description**: Disables the plugin channel limit for the server. This will disable the limit of 128 plugin channels per player.

#### net.kyori.adventure.text.warnWhenLegacyFormattingDetected:

- **default**: `false`
- **description**: Enables or disables the warning when legacy formatting is detected in a chat component.

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
- **description**: Sets the largest size that a plugin channel name can take.

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

#### Paper.WorkerThreadCount:

- **default**: `8` or `number of cpus - 2`. Whichever is lower
- **description**: Sets the number of worker threads to use for chunk loading.

#### Paper.excessiveTELimit:

- **default**: `750`
- **description**: Splits tile entities into multiple packets if there are more than this many.

#### io.papermc.paper.suppress.sout.nags:

- **default**: `unset`
- **description**: Suppresses the nag message about using `System.out`/`System.err` in a plugin.

#### paper.strict-thread-checks:

- **default**: `unset`
- **description**: This sets the status of the AsyncCatcher so that it will always log an error if code is not run on the main thread.

#### Paper.skipServerPropertiesComments:

- **default**: `unset`
- **description**: Skips the comments in the `server.properties` file.

#### Paper.debugInvalidSkullProfiles:

- **default**: `unset`
- **description**: Enables debug logging for invalid skull profiles. This logs any invalid skulls in the world with the appropriate location information.

#### paper.alwaysPrintWarningState:

- **default**: `unset`
- **description**: Always prints the warning state for the particular level.

#### Paper.parseYamlCommentsByDefault:

- **default**: `true`
- **description**: Sets whether to parse comments in YAML files by default.

#### paperclip.patchonly:

- **default**: `false`
- **description**: If the server is started via the Paperclip patch utility (the default distribution on the downloads page) then this sets whether it should only patch the Vanilla server and download libraries without starting the server.

#### Paper.IgnoreJavaVersion:

- **default**: `false`
- **description**: Allows you to bypass the Java version check. See [here](/paper/faq#unsupported-java-detected-what-do-i-do) for more info.

#### paper.useLegacyPluginLoading:

- **default**: `false`
- **description**: Allows cyclic plugin loading. See [here](paper-plugins.md#cyclic-plugin-loading) for more info.

#### Paper.DisableCommandConverter:

- **default**: `false`
- **description**: Disables Paper's automatic upgrading of commands, including items with custom data defined in command blocks and other places that may contain commands, to the new component format introduced in version 1.20.5.

#### paper.disable-plugin-rewriting

- **default**: `false`
- **description**: Disables plugin remapping introduced in 1.20.5 and everything involving automatic plugin conversion by commodore. For more information see the [userdev](../../dev/getting-started/userdev.mdx#1205-and-beyond) documentation and the official [announcement](https://discord.com/channels/289587909051416579/976631292747735080/1232740079097876570).
