---
slug: /dev/userdev
---

# Paperweight Userdev

**Userdev** is Paper's custom gradle plugin which provides access to non-api code (also called internals, or NMS)
during development. It provides a fully deobfuscated (with Mojang's mappings) environment for development
as well as the ability to re-obfuscate any internals used so the plugin will work in a standard server.

This guide is written using the Kotlin DSL for gradle and assumes you have some basic knowledge of gradle.
If you want to see a fully-functioning plugin that uses **userdev**,
check out this [example plugin](https://github.com/PaperMC/paperweight-test-plugin).


## Adding the plugin
Add the userdev gradle plugin to your `build.gradle.kts` file.
```kotlin
plugins {
    id("io.papermc.paperweight.userdev") version "1.5.5" // TODO auto fetch latest version
}
```

#### Snapshots
If you want access to snapshot builds of **userdev**, you need to add Paper's repo to your
`settings.gradle.kts` with:
```kotlin
pluginManagement {
    repositories {
        maven("https://repo.papermc.io/repository/maven-public/")
    }
}
```

## Adding the devbundle dependency
If you try to load your gradle project now, you will receive an error saying you have to declare
a dev bundle dependency. You can do that by adding to your `dependencies` block in your `build.gradle.kts`
file.

```kotlin
dependencies {
    // other deps
    paperweight.paperDevBundle("1.20.1-R0.1-SNAPSHOT")
}
```

You can remove any dependency for the Paper API, as the dev bundle includes that.

## Final steps
You can get a reobfuscated plugin jar with the `reobfJar` gradle task. You can also
make the reobf'd jar built during the `build` task with:
```kotlin
tasks.assemble {
    dependsOn(reobfJar)
}
```

## Extras
### Shadow
**Userdev** will automatically detect if the `shadow` gradle plugin is installed, and use that jar
as the input for its `reobfJar` task.

