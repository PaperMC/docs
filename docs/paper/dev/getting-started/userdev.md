---
slug: /dev/userdev
sidebar_label: Paperweight Userdev
---

# paperweight-userdev

**paperweight** is the name of Paper's custom build tooling. The **paperweight-userdev** Gradle plugin part of that
provides access to internal code (also known as NMS) during development.

:::note

This guide is written using the Kotlin DSL for Gradle and assumes you have some basic knowledge of Gradle.
If you want to see a fully-functioning plugin that uses **paperweight-userdev**,
check out this [example plugin](https://github.com/PaperMC/paperweight-test-plugin).

:::

## Why this is useful
The Paper server jars we provide on the downloads page through the API are **paperclip** jars. These
use Spigot's mappings, which are essentially some type names, but fully obfuscated fields and methods.
This can make it hard to work with in a development environment. This plugin lets you use fully deobfuscated
types, names and fields during development, and then remaps your plugin, so it can still be used with the obfuscated
server.

:::caution

The re-obfuscation does not apply to reflection. Look at something like [this library](https://github.com/jpenilla/reflection-remapper) to be able to
use non-obfuscated names in reflection.

:::

## Adding the plugin
Add the plugin to your `build.gradle.kts` file.
```kotlin
plugins {
    id("io.papermc.paperweight.userdev") version "1.5.5" // the latest version can be found on the Gradle Plugin Portal
}
```

:::info[Snapshots]

**paperweight-userdev** releases are available through the Gradle plugin portal, but if you
want to use SNAPSHOT versions, you must add Paper's maven repo to `settings.gradle.kts` with:
```kotlin
pluginManagement {
    repositores {
        maven("https://repo.papermc.io/repository/maven-public/")
    }
}
```

:::

## Adding the dev-bundle dependency
If you try to load your Gradle project now, you will receive an error saying you have to declare
a dev bundle dependency. You can do that by adding to your `dependencies` block in your `build.gradle.kts`
file.

```kotlin
dependencies {
    // Other Dependencies
    paperweight.paperDevBundle("1.20.1-R0.1-SNAPSHOT")
}
```
:::tip

You can remove any dependency for the Paper API, as the dev bundle includes that.

:::

## Gradle Tasks

### reobfJar

This task creates a plugin jar that is re-obfuscated to Spigot's runtime mappings.
This means it will work on standard Paper servers.

The output will be inside the `build/libs` folder. The jar whose filename includes `-dev`
is mojang-mapped (not re-obfuscated) and will not work on most servers.

:::info[Shadow]

If you have the shadow Gradle plugin applied in your build script, **paperweight-userdev** will
detect that and use the shaded jar as the input for the `reobfJar` task.

The `-dev-all.jar` file in `build/libs` is the shaded, but not re-obfuscated jar.

:::

You can make the `reobfJar` task run on the default `build` task with:
```kotlin
tasks.assemble {
    dependsOn(reobfJar)
}
```

