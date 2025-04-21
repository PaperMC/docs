---
title: Minecraft internals
description: A brief overview of how to use internals in your plugin.
slug: paper/dev/internals
---

The code that runs Minecraft is not open source. Bukkit is an API that allows plugins to interact with the server. This
is implemented by CraftBukkit and interacts with Minecraft's code. You will often hear the terms NMS and CraftBukkit
when talking about Minecraft internals.

:::danger[Using Minecraft internals]

Using Minecraft internals is not recommended. This is because using internal code directly is not guaranteed to be
stable and it changes often. This means that your plugin may break when a new version of Minecraft is released.
Whenever possible, you should use API instead of internals.

**PaperMC will offer no direct support for programming against Minecraft internals.**

:::

## What is NMS?

NMS stands for `net.minecraft.server` and refers to a Java package that contains a lot of Mojang's code. This code is
proprietary and is not open source. This code is not guaranteed to be stable when invoked externally and may change at
any time.

## Accessing Minecraft internals

In order to use Mojang and CraftBukkit code, you may either use the `paperweight-userdev` Gradle plugin or use reflection.
[`paperweight-userdev`](https://github.com/PaperMC/paperweight-test-plugin) is the recommended way to access internal code
as it is easier to use due to being able to have the remapped code in your IDE. You can find
out more about this in the [`paperweight-userdev`](/paper/dev/userdev) section.

However, if you are unable to use `paperweight-userdev`, you can use reflection.

### Reflection

Reflection is a way to access code at runtime. This allows you to access code that may not be available at compile time.
Reflection is often used to access internal code across multiple versions. However, reflection does come
with performance impacts if used improperly. For example, if you are accessing a method or field more than once,
you should cache the [`Field`](jd:java:java.lang.reflect.Field)/
[`Method`](jd:java:java.lang.reflect.Method) to prevent the performance
impact of looking up the field/method each time.

:::caution[1.20.4 and older]

The internal CraftBukkit code was relocated to `org.bukkit.craftbukkit.<version>` unless you ran a Mojang-mapped version
of Paper. This was unlikely to be the case in most production environments until 1.20.5. This means that any attempts to reflect had to
include the version. For example, `org.bukkit.craftbukkit.v1_20_R2.CraftServer` was the full class and package name
for the CraftServer class in version 1.20.2. You could access these classes easily with some reflection utilities.

```java
private static final String CRAFTBUKKIT_PACKAGE = Bukkit.getServer().getClass().getPackageName();

public static String cbClass(String clazz) {
  return CRAFTBUKKIT_PACKAGE + "." + clazz;
}

// You can then use this method to get the CraftBukkit class:
Class.forName(cbClass("entity.CraftBee"));
```

:::

Minecraft's code is obfuscated. This means that the names of classes and methods are changed to make them harder to
understand. Paper deobfuscates these identifiers for development and since 1.20.5, also for runtime.

:::caution[1.20.4 and older]

Previously, to provide compatibility with legacy plugins, Paper was reobfuscated at runtime.
You could use a library like [reflection-remapper](https://github.com/jpenilla/reflection-remapper) to automatically remap the
reflection references. This allowed you to use the deobfuscated, Mojang-mapped names in your code. This was recommended as
it made the code easier to understand.

:::

### Mojang-mapped servers

Running a Mojang-mapped (moj-map) server is an excellent way to streamline your processes because you can develop using
the same mappings that will be present at runtime. This eliminates the need for remapping in your compilation, which in
turn simplifies debugging and allows you to hotswap plugins.

As of 1.20.5, Paper ships with a Mojang-mapped runtime by default instead of reobfuscating the server to Spigot mappings.
By adopting Mojang mappings, you ensure that your plugin won't require internal remapping at runtime.
For more information, see the [plugin remapping](/paper/dev/project-setup#plugin-remapping) section
and [userdev](/paper/dev/userdev#1205-and-beyond) documentation covering these changes.

### Getting the current Minecraft version

You can get the current Minecraft version to allow you to use the correct code for a specific version. This can be done
with one of the following methods:

```java replace
// Example value: \{LATEST_PAPER_RELEASE}
String minecraftVersion = Bukkit.getServer().getMinecraftVersion();

// Example value: \{LATEST_PAPER_RELEASE}-R0.1-SNAPSHOT
String bukkitVersion = Bukkit.getServer().getBukkitVersion();

// Example value for 1.20.1: 3465
int dataVersion = Bukkit.getUnsafe().getDataVersion();
```

:::danger[Parsing the version]

Parsing the version from the package name of classes is no longer possible as of 1.20.5 as Paper stopped relocating the CraftBukkit package.
See the [reflection](#reflection) section for more information.

:::
