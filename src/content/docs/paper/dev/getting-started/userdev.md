---
title: paperweight-userdev
description: A guide on how to use the paperweight-userdev Gradle plugin to access internal code.
slug: paper/dev/userdev
---

**paperweight** is the name of Paper's custom build tooling. The **paperweight-userdev** Gradle plugin part of that
provides access to internal code (also known as NMS) during development.

:::note

This guide is written using the Gradle Kotlin DSL and assumes you have some basic knowledge of Gradle.
If you want to see a fully-functioning plugin that uses **paperweight-userdev**,
check out this [example plugin](https://github.com/PaperMC/paperweight-test-plugin).

:::

## Why this is useful
This is the only supported way of accessing server internals, as redistributing the server JAR is against the
Minecraft EULA and general license assumption. Even if you manually depended on the patched server, you would be
hindering other people working on your project and would be missing deployed API javadocs/sources in your IDE.

On top of that, Spigot and pre-1.20.5 Paper versions still use Spigot mappings, which are a mix of obfuscated fields/methods
and mapped as well as custom named classes. This can make it hard to work with in a development environment. This plugin lets you use
fully deobfuscated types, names, and fields during development, and then remaps your plugin, so it can still be used with the obfuscated
server. However, this does not apply to reflection. Look at something like [this library](https://github.com/jpenilla/reflection-remapper) to be able to
use non-obfuscated names in reflection if you want to support obfuscated servers.

:::note[1.20.5 Mojang-mapped runtime]

As of Minecraft version 1.20.5, Paper ships with a Mojang-mapped runtime instead of re-obfuscating the server to Spigot mappings.
See [here](#1205-and-beyond) for more details.

:::

## Adding the plugin
Add the plugin to your `build.gradle.kts` file.

```kts title="build.gradle.kts" replace
plugins {
  id("io.papermc.paperweight.userdev") version "\{LATEST_USERDEV_RELEASE}"
}
```

:::note[Gradle Version]

Please make sure you are using the latest stable version of Gradle.
For more information on upgrading Gradle, check out the [Gradle Wrapper documentation](https://docs.gradle.org/current/userguide/gradle_wrapper.html).

:::

The latest version of `paperweight-userdev` supports dev bundles for Minecraft 1.17.1 and newer, so it's best practice to keep it up to date!
Only the latest version of `paperweight-userdev` is officially supported, and we will ask you to update first if you are having problems with old versions.
Furthermore, if you are having issues with `paperweight-userdev`, you should ask in the
[`#build-tooling-help`](https://discord.com/channels/289587909051416579/1078993196924813372) channel in our dedicated [Discord server](https://discord.gg/PaperMC)!

:::note[Snapshots]

**paperweight-userdev** SNAPSHOT (pre-release) versions are only available through Paper's Maven repository.
```kotlin title="settings.gradle.kts"
pluginManagement {
  repositories {
    gradlePluginPortal()
    maven("https://repo.papermc.io/repository/maven-public/")
  }
}
```

:::

## Adding the dev bundle dependency
If you try to load your Gradle project now, you will receive an error saying you have to declare
a dev bundle dependency. You can do that by adding to your `dependencies` block in your `build.gradle.kts`
file.

```kotlin title="build.gradle.kts" replace
dependencies {
  // Other Dependencies
  paperweight.paperDevBundle("\{LATEST_PAPER_RELEASE}-R0.1-SNAPSHOT")
}
```

:::tip

You should remove any dependency on the Paper API, as the dev bundle includes that.

:::

## Gradle tasks

### `reobfJar`

This task creates a plugin JAR that is re-obfuscated to Spigot's runtime mappings.
This means it will work on standard Paper servers.

The output will be inside the `build/libs` folder. The JAR whose filename includes `-dev`
is Mojang-mapped (not re-obfuscated) and will not work on most servers.

:::note[Shadow]

If you have the shadow Gradle plugin applied in your build script, **paperweight-userdev** will
detect that and use the shaded JAR as the input for the `reobfJar` task.

The `-dev-all.jar` file in `build/libs` is the shaded, but not re-obfuscated JAR.

:::

You can make the `reobfJar` task run on the default `build` task with:
```kotlin title="build.gradle(.kts)"
tasks.assemble {
  dependsOn(tasks.reobfJar)
}
```

## 1.20.5 and beyond

As of 1.20.5, Paper ships with a Mojang-mapped runtime instead of re-obfuscating the server to Spigot mappings.
Additionally, CraftBukkit classes will no longer be relocated into a versioned package.
This requires plugins to be deobfuscated before loading when necessary.

Most of this process is done automatically by paperweight, but there are some important things to know when using server internals (or "NMS") from now on.

### Default mappings assumption
* By default, all Spigot/Bukkit plugins will be assumed to be Spigot-mapped if they do not specify their mappings namespace in the manifest.
  The other way around, all Paper plugins will be assumed to be Mojang-mapped if they do not specify their mappings namespace in the manifest.
* Spigot-mapped plugins will need to be deobfuscated on first load, Mojang-mapped plugins will not.

### Compiling to Mojang mappings

:::note

This is the preferred option, as the one-time plugin remapping process during server startup will be skipped and it
may allow you to keep version compatibility across smaller updates without changes or additional modules.
However, this makes your plugin incompatible with Spigot servers.

:::

If you want your main output to use Mojang mappings, you need to remove all `dependsOn(reobfJar)` lines and add the following code to your build script:

```kotlin title="build.gradle.kts"
paperweight.reobfArtifactConfiguration = io.papermc.paperweight.userdev.ReobfArtifactConfiguration.MOJANG_PRODUCTION
```

### Compiling to Spigot mappings

If you want your main output to use Spigot mappings, add the following code to your build script:

```kotlin title="build.gradle.kts"
paperweight.reobfArtifactConfiguration = io.papermc.paperweight.userdev.ReobfArtifactConfiguration.REOBF_PRODUCTION
```

This is useful for plugins that have loaders for both Spigot and Paper and want to keep compatibility with both.

:::note

If you are using Gradle with the Groovy DSL, you should instead access the fields via static methods like `getMOJANG_PRODUCTION()`.

:::
