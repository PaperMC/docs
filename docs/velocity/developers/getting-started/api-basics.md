---
slug: /velocity/developers/api-basics
---

# Velocity Plugin Basics

Now we will lay the groundwork for your first plugin. We will cover how to create your very first
Velocity plugin.

## Create the plugin class

Create a new class (let's say `com.example.velocityplugin.VelocityTest`) and paste this in:

```java
package com.example.velocityplugin;

import com.google.inject.Inject;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.proxy.ProxyServer;
import org.slf4j.Logger;

@Plugin(id = "myfirstplugin", name = "My First Plugin", version = "0.1.0-SNAPSHOT",
        url = "https://example.org", description = "I did it!", authors = {"Me"})
public class VelocityTest {

    private final ProxyServer server;
    private final Logger logger;

    @Inject
    public VelocityTest(ProxyServer server, Logger logger) {
        this.server = server;
        this.logger = logger;

        logger.info("Hello there! I made my first plugin with Velocity.");
    }
}
```

What did you just do there? There's quite a bit to unpack, so let's focus on the Velocity-specific
bits:

```java
@Plugin(id = "myfirstplugin", name = "My First Plugin", version = "0.1.0-SNAPSHOT",
        url = "awesome.org", description = "I did it!", authors = {"Me"})
public class VelocityTest {
```

This tells Velocity that this class contains your plugin (myfirstplugin) so that it can be loaded
once the proxy starts up. Velocity will detect where the plugin will reside when you compile your
plugin.

Moving on, what's this?

```java
@Inject
public VelocityTest(ProxyServer server, Logger logger) {
    this.server = server;
    this.logger = logger;

    logger.info("Hello there, it's a test plugin I made!");
}
```

This looks like magic! How is Velocity doing this? The answer lies in the `@Inject`, which indicates
that Velocity should inject a ProxyServer and the Logger when constructing your plugin. These two
interfaces will help you out as you begin working with Velocity. We won't talk too much about
dependency injection: all you need to know is that Velocity will do this.

All you need to do is build your plugin, put it in your `plugins/` directory, and try it! Isn't that
nice? In the next section you'll learn more about how to use the API.

## Choosing `@Plugin` Information

Choose your plugin's ID wisely. Other plugins will use this ID to depend on yours. If you change it,
you could break compatibility.

The plugin name is somewhat less important. It will be shown to users as the display name of your
plugin, but tweaking it will not be catastrophic.

For the version, we recommend sticking to semantic versioning - you can read more about this concept
at [semver.org](https://semver.org). Basically, use 3 numbers in your version, such as 1.4.25.
Increment the major number when you make a backwards-incompatible breaking change, increment the
minor number when you add functionality that is backwards compatible, and increment the patch number
when you fix a bug or make an otherwise unnoticeable change in the implementation.

You can also describe your plugin's URL, authors, and description in your `@Plugin` annotation.
Plugin dependencies are also be specified there, but we'll get to that later.

### A word of caution

In Velocity, plugin loading is split into two steps: construction and initialization. The code in
your plugin's constructor is part of the construction phase. There is very little you can do safely
during construction, especially as the API does not specify which operations are safe to run during
construction. Notably, you can't register an event listener in your constructor, because you need to
have a valid plugin registration, but Velocity can't register the plugin until the plugin has been
constructed, causing a "chicken or the egg" problem.

To break this vicious cycle, you should always wait for initialization, which is indicated when
Velocity fires the ProxyInitializeEvent. We can do things on initialization by adding a listener for
this event, as shown below. Note that Velocity automatically registers your plugin main class as a
listener.

```java
@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
    // Do some operation demanding access to the Velocity API here.
    // For instance, we could register an event:
    server.getEventManager().register(this, new PluginListener());
}
```

## Getting your Plugin's Directory

At some point you may need your plugin's directory. To do this, add
`@DataDirectory Path dataDirectory` to your plugin's constructor parameters:

```java
private final Path dataDirectory;

@Inject
public VelocityTest(ProxyServer server, Logger logger, @DataDirectory Path dataDirectory) {
    this.server = server;
    this.logger = logger;
    this.dataDirectory = dataDirectory;
}
```

This will get you a `java.nio.file.Path` of your plugin directory. If you absolutely need a
`java.io.File`, you may use `Path#toFile()`. However, Velocity usually works with `Path`.
