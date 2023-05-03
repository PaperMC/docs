---
slug: /basic-troubleshooting
---

# Basic Troubleshooting

This guide will help you diagnose your server's problem before reporting it to PaperMC or the plugin's author.

:::caution[Stop Your Server And Take A Backup]

Before following this guide, stop your server first. Modifying server files while it is still running will corrupt them.  
Only a full server shutdown can prevent this.

Also, if you don't follow this guide carefully or make a mistake while following this guide, you might corrupt your server. It is highly advised to backup your server before following this guide.  
It would be ideal to create a test server by copying your production server's file, but that's not always possible.

:::

## Read The Error Message

If your server encounters a problem, it will either print an error message on the server console, create a crash report and close itself, or do both.

If your server crashes, the crash report will be saved in the `crash-report` directory.  
If your server didn't crash, those error messages will be stored in the `log` directory along with other messages.

Note that the logs older than the latest will be compressed and not stored as plain text files.

The first thing you have to do is diagnose those messages.

### Case 01: Paper Watchdog Thread Dump

If your error message looks like this, **do not blindly report it to PaperMC** as it says:

```plaintext
[00:00:00] [Paper Watchdog Thread/ERROR]: --- DO NOT REPORT THIS TO PAPER - THIS IS NOT A BUG OR A CRASH - git-Paper-366 (MC: 1.19.3) ---
[00:00:00] [Paper Watchdog Thread/ERROR]: The server has not responded for 10 seconds! Creating thread dump
[00:00:00] [Paper Watchdog Thread/ERROR]: ------------------------------
```

This can be caused by various things. Maybe your server's hardware is not capable of running Minecraft server. Maybe one of the plugins you use is causing lag on your server.

The thread dump from Paper Watchdog can be found below that line. If you find any plugin's name in there, talk to the plugin's author about that, not PaperMC.

### Case 02: Stack Trace

Almost every problem you encounter will print error message lines, which are called "stack trace", on the server console. Examining the stack trace will help you find out what is causing problems on your server.

The stack trace starts with the error message, exception type, and exception message.

Both error messages and exception messages were put there by the developer of either your plugin or paper server. These messages tell you what problem your server experienced.  
An exception type like `java.lang.RuntimeException` tells you the type of the exception. This will help the developer (and you) understand the type of problem.

Many lines beginning with `at` may appear beneath the exception message. These are the body of the stack trace. These lines tell you where the problem starts. The top line of the body of the stack trace will tell you exactly where the problem occurred and, if possible, display where it came from.

If you find any plugin's name in the stack trace, head to [Check Plugin Updates](#check-plugin-updates) and read from there. In most cases, the plugin, whose name is found on the stack trace, is causing the problem. If not, continue reading.

Here are some examples of stack trace.

<details>
  <summary>Example 01: Server attempted to load chunk saved with newer version of minecraft!</summary>

```plaintext
[00:00:00 WARN]: java.lang.RuntimeException: Server attempted to load chunk saved with newer version of minecraft! 3218 > 3120
```

You tried to load the world generated with a higher version of Minecraft. You cannot do this.  
If you don't have any backup of your world before the chunk version update, you must use your updated world with a higher version of Minecraft.

</details>

<!-- Another examples -->

## Find Out What Plugin Is Causing The Problem

If you can't find the name of any plugin in the thread dump or stack trace, try these steps.

### Disable All Plugins

To determine if it is a plugin or the paper itself that is causing problems, disable all of your plugins first.

You can disable all of your plugins by renaming the `plugins` directory to something else, such as `plugins-disabled`, or by archiving the `plugins` directory and deleting it.

After that, try to run your server.

If the problem is resolved after removing the plugins, you know that it was a plugin that caused the issue.  
If you still experience problems, head to [Paper Documentation](#paper-documentation). Maybe your paper server is misconfigured, and that is creating issues.

### Binary Search

To efficiently search for the plugin that is causing the issue, you can do the following:

1. **Split your plugins into two groups**  
   The size of the two groups can be different, but it is ideal if the difference is minimal.
2. **Disable one of the two groups of plugins**  
   You can disable them by changing their extension from `.jar` to `.jar-disabled`.
3. **Run your server and check if the problem still exists**  
   If the problem is resolved, the plugin that caused the issue is one of the disabled plugins.  
   If the problem is not resolved, the plugin that is causing the issue is one of the active plugins.
4. **Repeat from the start with the suspect plugin group**  
   Repeat the steps above with groups that have the plugin that is causing the issue.

## Check Plugin Updates

There is a chance that your problem is already fixed in the latest release or latest build of the plugin.

Head to your plugin's official download page and check if you are using the latest build or the latest release of the plugin. If not, update it to the latest version and try to run your server again to see if the problem is resolved.

### Update Library Plugin Too

Many plugins use library plugins like ProtocolLib, and you have to download them and put them in `plugins` directory.

If you don't update them to the latest version or latest build, you might experience problems related to plugins that use the library plugin.

Some library plugins tell their users to use their latest development build for support of the latest Minecraft version. You should look carefully at the requirements of your plugin.

## Check Documentation

If you misconfigured your plugin or your server, it can also cause problems on your server.

### Plugin Documentation

Many plugins provide their own documentation about how to set them up properly. Read those documents carefully and check if there is something wrong with the plugin's configuration.

### Paper Documentation

Paper can also be configured in a variety of ways. Check these documents for detailed explanations about each configuration.

* [Paper Global Config](../reference/global-configuration.md)
* [Paper Per World Configuration](../reference/world-configuration.md)

## Consult With Developer

If your problem is related to a plugin you use and you still don't know how to solve it, you can try to reach out to the plugin's author.  
Many plugins have a way to contact their author, like a GitHub issue tracker, Discord support guild, Gitter, IRC, etc.  

If your problem isn't related to any plugin, you can come to PaperMC's Discord server and ask for help, or create a new issue on our GitHub issue tracker.
