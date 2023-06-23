---
slug: /dev/getting-started/paper-plugins
---

# Paper Plugins

Paper plugins allow developers to take advantage of more modern concepts introduced by Mojang, such as datapacks, to
expand the field of what the Paper API is able to introduce.

:::warning[Experimental]

This is experimental and may be subject to change.

:::

- [Bootstrapper](#bootstrapper)
- [Loader](#loaders)
- [Differences](#differences)

## How do I use them?
Similarly to Bukkit plugins, you have to introduce a ``paper-plugin.yml`` file into your jar resources folder.
This can act as a drop in replacement for ``plugin.yml``, allowing you to specifically target the Paper platform.

It should be noted you still have the ability to include both ``paper-plugin.yml``and ``plugin.yml`` in the same jar.

Here is an example configuration.
```yml
name: Paper-Test-Plugin
version: '1.0'
main: io.papermc.testplugin.TestPlugin
description: Paper Test Plugin
api-version: '1.20'
bootstrapper: io.papermc.testplugin.TestPluginBootstrap
loader: io.papermc.testplugin.TestPluginLoader
```

### Dependency Declaration

Paper Plugins change how to declare dependencies in your `paper-plugin.yml`:

```yml
dependencies:
  bootstrap:
    # Lets say that RegistryPlugin has some registry elements that this plugin requires.
    # We don't need this during runtime, so it's not required in the server section. However
    # can be added to both if needed
    RegistryPlugin:
      load: BEFORE
      required: true
      join-classpath: true # Defaults to true
  server:
    # Add a required "RequiredPlugin" dependency, which will load AFTER your plugin.
    RequiredPlugin:
      load: AFTER
      required: true
      # This means that your plugin will not have access to their classpath
      join-classpath: false
```

With Paper Plugins, dependencies are split into two sections:
- `bootstrap` - These are dependencies that you will be using in the [bootstrap](#bootstrapper).
- `server` - These are dependencies that are used for the core functionality of your plugin, whilst the server is running.

Let's Take a look at a Dependency:
```yml
RegistryPlugin:
  load: BEFORE # Defaults to OMIT
  required: true # Defaults to true
  join-classpath: true # Defaults to true
```

- `load`: (`BEFORE`|`AFTER`|`OMIT`) Specifies whether this plugin should before or after **your** plugin.
- `required`: Whether this plugin is required for your plugin to load.
- `join-classpath`: Whether your plugin should have access to their classpath.

:::note[Cyclic Loading]

Note that in certain cases plugins may be able to introduce cyclic loading loops, which will prevent the server from starting.
Please read the [cyclic loading guide](docs/paper/admin/reference/paper-plugins.md#cyclic-plugin-loading) for more information.
:::

Here are a couple of examples:
```yml
# Suppose we require ProtocolLib to be loaded for our plugin
ProtocolLib:
  load: AFTER
  required: true

# Now, we are going to register some details for a shop plugin
# So our plugin should load before the shop plugin
SuperShopsXUnlimited:
  load: AFTER
  required: false

# Now, we are going to need to access a plugins classpath
# So that we can properly interact with it.
SuperDuperTacoParty:
  required: true
  join-classpath: true
```

## What is it used for?
Paper plugins lay down the framework for some future API.
Our goals are to open more modern API that better aligns with Vanilla.
Paper plugins allow us to do just that by making a new way to load plugin resources
before the server has started by using [Bootstrappers](#bootstrapper).

## Bootstrapper
Paper plugins are able to identify their own bootstrapper by implementing ``io.papermc.paper.plugin.bootstrap.PluginBootstrap`` and adding
the class of your implementation to the bootstrapper field in the ``paper-plugin.yml``.
```java
public class TestPluginBootstrap implements PluginBootstrap {

    @Override
    public void bootstrap(@NotNull BootstrapContext context) {

    }

    @Override
    public @NotNull JavaPlugin createPlugin(@NotNull PluginProviderContext context) {
        return new TestPlugin("My custom parameter");
    }

}
```
A Bootstrapper allows you to also override how your plugin is initiated, allowing you to pass values into your plugin constructor.
Currently, bootstrappers do not offer much new API, and are highly experimental. This may be subject to change once more API is introduced.

## Loaders
Paper plugins are able to identify their own plugin loader by implementing ``io.papermc.paper.plugin.loader.PluginLoader`` and adding
the class of your implementation to the loader field in the ``paper-plugin.yml``.

The goal of the plugin loader is the creation of an expected/dynamic environment for the plugin to load into.
This, as of right now, only applies to creating the expected classpath for the plugin, e.g. supplying external libraries to the plugin.
```java
public class TestPluginLoader implements PluginLoader {

    @Override
    public void classloader(@NotNull PluginClasspathBuilder classpathBuilder) {
        classpathBuilder.addLibrary(new JarLibrary(Path.of("dependency.jar")));

        MavenLibraryResolver resolver = new MavenLibraryResolver();
        resolver.addDependency(new Dependency(new DefaultArtifact("com.example:example:version"), null));
        resolver.addRepository(new RemoteRepository.Builder("paper", "default", "https://repo.papermc.io/repository/maven-public/").build());

        classpathBuilder.addLibrary(resolver);
    }
}

```
Currently, you are able to add two different library types, ``JarLibrary``, and ``MavenLibraryResolver``.


## Differences

### Bukkit Serialization System
Paper plugins do not support the serialization system (``org.bukkit.configuration.serialization``) that Bukkit uses. Your classes will **not** be able to be
serialized, vise versa. It is highly recommended to not use this system with Paper plugins.

### Classloading Isolation
Paper plugins have isolated classloaders, meaning that relocating dependencies will not be necessary.
Paper plugins are not able to access each other unless given explicit access by depending on another plugin, etc.
This prevents plugins from accidentally accessing your dependencies, and in general helps minimise issues.

You can declare this visibility inside the [dependencies](#dependency-declaration) section:
```yml
Plugin:
  join-classpath: true # Means you have access to their classpath
```

### Load Order Logic Split
In order to better take advantage of classloading isolation, Paper plugins do **not** use the ``dependencies`` field to determine load order.
This was done for a variety of reasons, mostly to allow better control and allow plugins to properly share classloaders.

See information on [declaring dependencies](#dependency-declaration) for more information on how to declare the load order of your plugin.

### Cyclic Plugin Loading

Cyclic loading describes the phenomena when a plugin loading causes a loop which eventually will cycle back to the original plugin.
With Paper plugins, cyclic loading will attempt to be automatically resolved.

However, if Paper detects a loop that cannot be resolved, you will get an error that looks like this:
```
Circular plugin loading detected!
Circular load order:
 MyPlugin -> MyOtherPlugin -> MyWorldPlugin -> MyPlugin
Please report this to the plugin authors of the first plugin of each loop or join the PaperMC Discord server for further help.
If you would like to still load these plugins, acknowledging that there may be unexpected plugin loading issues, run the server with -Dpaper.useLegacyPluginLoading=true
Failed to start the minecraft server
```

It is up to you to resolve these circular loading issues.
