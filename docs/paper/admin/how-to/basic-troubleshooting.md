---
slug: /basic-troubleshooting
---

# Basic Troubleshooting

This guide will help you diagnose your server's problem before reporting it to PaperMC or the plugin's author. Please, read this documentation carefully.

:::tip Backup Your Server

People can break their servers while trying to follow this guide. It is highly advised to backup your server before following this guide.  
It would be ideal to create a test server by copying your production server's file, but that's not always possible.  
Please, take a backup first.

:::

:::caution Stop Your Server

Before following this guide, stop your server first. Modifying server files while it is still running will corrupt them. This is like having an operation without anesthesia. Your server will scream like you would.

:::

## Read The Error Message

If your server encounters a problem, it will either print an error message on the server console, create a crash report and close itself, or do both.

If your server crashes, the crash report will be saved in the `crash-report` directory.  
If your server didn't crash, those error messages will be stored in the `log` directory along with other messages.

The first thing you have to do is diagnose those messages.

### Case 01: Paper Watchdog Thread Dump

If your error message looks like this, **do not blindly report it to PaperMC** as it says:

```plaintext
[00:00:00] [Paper Watchdog Thread/ERROR]: --- DO NOT REPORT THIS TO PAPER - THIS IS NOT A BUG OR A CRASH - git-Paper-366 (MC: 1.19.3) ---
[00:00:00] [Paper Watchdog Thread/ERROR]: The server has not responded for 10 seconds! Creating thread dump
[00:00:00] [Paper Watchdog Thread/ERROR]: ------------------------------
```

This can be caused by various things. Maybe your server's hardware is not enough to run Minecraft server. Maybe one of the plugins you use is causing lag on your server.

The thread dump from Paper Watchdog can be found below. If you find any plugin's name in there, talk to the plugin's author about that, not PaperMC.

### Case 02: Stack Trace

Almost every problem you encounter will print error message lines, which are called "stack trace", on the server console. Examining the stack trace will help you find out what is causing problems on your server.

The stack trace starts with the error message, exception type, and exception message.

Both error messages and exception messages were put there by the developer of either your plugin or paper server. These messages tell you what problem your server experienced.  
An exception type like `java.lang.RuntimeException` tells you the type of the exception. This will help the developer (and you) understand the type of problem.

Many lines beginning with `at` may appear beneath the exception message. These are the bodies of the stack trace. These lines tell you where the problem starts. The top line of the body of the stack trace will tell you exactly where the problem occurred, as well as the name of the JAR file.

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

### Run Server Without Any Plugins

Try to run your server without any plugins. If you rename or delete `plugins` directory, your server will run without any plugins.

If you don't have any issues with this condition, it's the plugin that's causing them.  
If you still experience problems, head to [Paper Documentation](#paper-documentation) because it might be paper that is creating problems, and most of them are because of a misconfigured paper server.

### Binary Search

To find out what plugin is causing problem, [binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) is ideal way to do it.

Here is brief animation about binary search.

![Binary Search Example](assets/binary-search.gif)

## Check Plugin Updates

There is a chance that your problem is already fixed in the latest release or latest build of the plugin.

Head to your plugin's official download page and check if you are using the latest build or the latest release of the plugin. If not, update it to the latest version and try to run your server again to see if the problem is fixed or not.

### Update Library Plugin Too

Many plugins use library plugins, and you have to download them and put them in `plugins` directory.

If you don't update them to the latest version or latest build, you might experience problems related to plugins that use the library plugin.

Some library plugins, like ProtocolLib, tell their users to use their latest development build for support of the latest Minecraft version. You should look carefully at the requirements of your plugin.

## Check Documentation

If you misconfigured your plugin or your server, it can also cause problems on your server.

### Plugin Documentation

Many plugins provide their own documentation about how to set them up properly. Read those documents carefully and check if there is something wrong with the plugin's configuration.

### Paper Documentation

Paper can also be configured in a variety of ways. Check these documents for detailed explanations about each configuration.

* [Paper Global Config](../reference/global-configuration.md)
* [Paper Per World Configuration](../reference/world-configuration.md)

## Consult With Developer

If your problem is related to a plugin you use and you still don't know how to solve it, you can try to reach the plugin's author.  
Many plugins have a way to contact their author, like GitHub Issue Trakcer, Discord Support Server, Gitter, IRC, etc.  
Don't ask for help related to a plugin in PaperMC.

If your problem isn't related to any plugin, you can come to PaperMC's Discord server and ask for help, or create a new issue in the GitHub Issue Tracker.
