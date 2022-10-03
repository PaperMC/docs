---
slug: /dev/project-setup
---

# Paper Project Setup

As the Paper team primarily uses [IntelliJ IDEA](https://www.jetbrains.com/idea/), this guide will be focused on that IDE. 
However, the steps below should be applicable to other IDEs as well, with some minor changes.


### Creating a new project

Open your IDE and select the option to create a new project. 
In Intellij, you will get the option to select the type of project you want to create. 
Select `Gradle - Kotlin DSL` and click `Create`.

You will land into the `build.gradle.kts` file where you can add your dependencies.

### Adding Paper as a dependency

To add Paper as a dependency, you will need to add the Paper repository to your `build.gradle.kts` file as well as the dependency itself.

```kotlin
repositories {
    mavenCentral()
    maven("https://repo.papermc.io/repository/maven-public/")
}

dependencies {
    compileOnly("io.papermc.paper:paper-api:1.19.2-R0.1-SNAPSHOT")
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(17))
}
```

:::info

To see the versions of Paper you want to use, visit our [Downloads](https://www.papermc.io/downloads) page.

:::

### Setting up the `src` directory

:::note

If your project creates a `src` directory automatically, you can skip this step.

:::

To set up the `src` directory, you will need to create a new directory called `src` and then create a new directory called `main` inside of it.
Inside of `main`, create two new directories called `java` and `resources`.

It should look like this:

```
...
example-plugin
├── build.gradle.kts
├── settings.gradle.kts
└── src
    └── main
        ├── java
        └── resources
...
```

### Setting up the `java` directory

You will place your Java source files in the `java` directory. You first need to create some packages to organize your code.
For this example, we will create three packages called `io.papermc.testplugin` and then create a class called `ExamplePlugin` inside of it.

```
...
example-plugin
├── build.gradle.kts
├── settings.gradle.kts
└── src
    └── main
        ├── java
        │   └── io
        │       └── papermc
        │           └── testplugin
        │               └── ExamplePlugin.java
        └── resources
...
```

### The _main_ class

The main class is the entry point to your plugin and will be the only class that extends `JavaPlugin` in your plugin. 
This is an example of what your `ExamplePlugin` class could look like:

```java
package io.papermc.testplugin;

import net.kyori.adventure.text.Component;
import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class ExamplePlugin extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        Bukkit.getPluginManager().registerEvents(this, this);
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        event.getPlayer().sendMessage(Component.text("Hello, " + event.getPlayer().getName() + "!"));
    }

}
```

### Setting up the `resources`

The `resources` directory is where you will place your plugin's `plugin.yml` file. See the [Plugin YML](/paper/dev/plugin-yml) page for more information.

### Conclusion

You should now have a project set up with Paper as a dependency.
All you have left to do now is to compile your plugin and run it on a paper server.

:::note

If you want to streamline the process of testing a plugin, you can use the [Run-Paper](https://github.com/jpenilla/run-paper) Gradle task.
It will automatically download a paper server and run it for you.

:::

:::info
    
If you are using IntelliJ, you can use the Gradle GUI `Build` menu to compile your plugin - found on the top right of your IDE.
The output jar of your plugin will be in the `build/libs` directory.

:::
