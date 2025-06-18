---
title: Paper plugins
description: A development guide for how to write Paper-specific plugins.
slug: paper/dev/getting-started/paper-plugins
sidebar:
  badge:
    text: Experimental
    variant: danger
---

Paper plugins allow developers to take advantage of more modern concepts introduced by Mojang, such as datapacks, to
expand the field of what the Paper API is able to introduce.

:::danger[Experimental]

This is experimental and may be subject to change.

:::

- [Bootstrapper](#bootstrapper)
- [Loader](#loaders)
- [Differences](#differences)

## How do I use them?
Similarly to Bukkit plugins, you have to introduce a `paper-plugin.yml` file into your JAR resources folder.
This will not act as a drop-in replacement for `plugin.yml`, as some things, as outlined in this guide, need to be declared differently.

It should be noted that you still have the ability to include both `paper-plugin.yml` and `plugin.yml` in the same JAR.

Here is an example configuration:
```yaml replace
name: Paper-Test-Plugin
version: '1.0'
main: io.papermc.testplugin.TestPlugin
description: Paper Test Plugin
api-version: '\{LATEST_PAPER_RELEASE}'
bootstrapper: io.papermc.testplugin.TestPluginBootstrap
loader: io.papermc.testplugin.TestPluginLoader
```

### Dependency declaration

Paper plugins change how to declare dependencies in your `paper-plugin.yml`:

```yml
dependencies:
  bootstrap:
    # Let's say that RegistryPlugin registers some data that your plugin needs to use
    # We don't need this during runtime, so it's not required in the server section.
    # However, can be added to both if needed
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

With Paper plugins, dependencies are split into two sections:
- `bootstrap` - These are dependencies that you will be using in the [bootstrap](#bootstrapper).
- `server` - These are dependencies that are used for the core functionality of your plugin, whilst the server is running.

Let's take a look at a dependency:
```yml
RegistryPlugin:
  load: BEFORE # Defaults to OMIT
  required: true # Defaults to true
  join-classpath: true # Defaults to true
```

- `load` (`BEFORE`|`AFTER`|`OMIT`): Whether this plugin should load before or after **your** plugin. Note: `OMIT` has undefined ordering behavior.
- `required`: Whether this plugin is required for your plugin to load.
- `join-classpath`: Whether your plugin should have access to their classpath. This is used for plugins that need to access other plugins internals directly.

:::note[Cyclic Loading]

Note that in certain cases, plugins may be able to introduce cyclic loading loops, which will prevent the server from starting.
Please read the [cyclic loading guide](#cyclic-plugin-loading) for more information.

:::

Here are a couple of examples:
```yml
# Suppose we require ProtocolLib to be loaded for our plugin
ProtocolLib:
  load: BEFORE
  required: true

# Now, we are going to register some details for a shop plugin
# So the shop plugin should load after our plugin
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
Paper plugins lay down the framework for some future API. Our goals are to open more modern API that better aligns
with Vanilla. Paper plugins allow us to do just that by making a new way to load plugin resources before the server
has started by using [bootstrappers](#bootstrapper).

## Bootstrapper
Paper plugins are able to identify their own bootstrapper by implementing
[`PluginBootstrap`](jd:paper:io.papermc.paper.plugin.bootstrap.PluginBootstrap)
and adding the class of your implementation to the bootstrapper field in the `paper-plugin.yml`.
```java title="TestPluginBootstrap.java"
public class TestPluginBootstrap implements PluginBootstrap {

  @Override
  public void bootstrap(BootstrapContext context) {

  }

  @Override
  public JavaPlugin createPlugin(PluginProviderContext context) {
    return new TestPlugin("My custom parameter");
  }

}
```
A bootstrapper also allows you to change the way your plugin is initialized, allowing you to pass values into your plugin constructor.
Currently, bootstrappers do not offer much new API and are highly experimental. This may be subject to change once more API is introduced.

## Loaders
Paper plugins are able to identify their own plugin loader by implementing
[`PluginLoader`](jd:paper:io.papermc.paper.plugin.loader.PluginLoader)
and adding the class of your implementation to the loader field in the `paper-plugin.yml`.

The goal of the plugin loader is the creation of an expected/dynamic environment for the plugin to load into.
This, as of right now, only applies to creating the expected classpath for the plugin, e.g. supplying external libraries to the plugin.
```java title="TestPluginLoader.java"
public class TestPluginLoader implements PluginLoader {

  @Override
  public void classloader(PluginClasspathBuilder classpathBuilder) {
    classpathBuilder.addLibrary(new JarLibrary(Path.of("dependency.jar")));

    MavenLibraryResolver resolver = new MavenLibraryResolver();
    resolver.addDependency(new Dependency(new DefaultArtifact("com.example:example:version"), null));
    resolver.addRepository(new RemoteRepository.Builder("paper", "default", "https://repo.papermc.io/repository/maven-public/").build());

    classpathBuilder.addLibrary(resolver);
  }
}
```
Currently, you are able to add two different library types:
[`JarLibrary`](jd:paper:io.papermc.paper.plugin.loader.library.impl.JarLibrary) and
[`MavenLibraryResolver`](jd:paper:io.papermc.paper.plugin.loader.library.impl.MavenLibraryResolver).

:::danger

If you wish to resolve libraries from Maven Central, use a mirror, as using Maven Central directly as a CDN is against the Maven Central Terms of Service, and users of your plugin may hit rate limits.

You should use Paper's default mirror, configured by the [`PAPER_DEFAULT_CENTRAL_REPOSITORY`](/paper/reference/system-properties#paper_default_central_repository) environment variable and [`org.bukkit.plugin.java.LibraryLoader.centralURL`](/paper/reference/system-properties#orgbukkitpluginjavalibraryloadercentralurl) system property:
```java
resolver.addRepository(new RemoteRepository.Builder("central", "default", MavenLibraryResolver.MAVEN_CENTRAL_DEFAULT_MIRROR).build());
```

Using the Maven Central repository (i.e. `*.maven.org` or `*.maven.apache.org`) will cause a warning to be shown in the console.

:::

## Differences

### Bukkit serialization system
Paper plugins still support the serialization system (`org.bukkit.configuration.serialization`) that Bukkit uses. However, custom classes will not be
automatically registered for serialization. In order to use [`ConfigurationSection#getObject`](jd:paper:org.bukkit.configuration.ConfigurationSection#getObject(java.lang.String,java.lang.Class)),
you **must** call [`ConfigurationSerialization#registerClass(Class)`](jd:paper:org.bukkit.configuration.serialization.ConfigurationSerialization#registerClass(java.lang.Class))
before you attempt to fetch objects from configurations.

### Classloading isolation
Paper plugins are not able to access each other unless given explicit access by depending on another plugin, etc. This
helps prevent Paper plugins from accidentally accessing each other's dependencies, and in general helps ensure that
plugins are only able to access what they explicitly depend on.

Paper plugins have the ability to bypass this, being able to access OTHER plugins' classloaders by adding a `join-classpath` option to their `paper-plugin.yml`.

```yml
Plugin:
  join-classpath: true # Means you have access to their classpath
```

Note, other Paper plugins will still be unable to access your classloader.

### Load order logic split
In order to better take advantage of classloading isolation, Paper plugins do **not** use the `dependencies` field to determine load order.
This was done for a variety of reasons, mostly to allow better control and allow plugins to properly share classloaders.

See [declaring dependencies](#dependency-declaration) for more information on how to declare the load order of your plugin.

### Commands
Paper plugins do not use the `commands` field to register commands. This means that you do not need to include all
of your commands in the `paper-plugin.yml` file. Instead, you can register commands using the
[Brigadier Command API](/paper/dev/command-api/basics/introduction).

### Cyclic plugin loading

Cyclic loading describes the phenomenon when a plugin loading causes a loop that eventually cycles back to the original plugin.
Unlike Bukkit plugins, Paper plugins will not attempt to resolve cyclic loading issues.

```d2
style.fill: transparent
direction: right

A -> B
B -> C
C -> D
D -> A
```

However, if Paper detects a loop that cannot be resolved, you will get an error that looks like this:
```
[ERROR]: [LoadOrderTree] =================================
[ERROR]: [LoadOrderTree] Circular plugin loading detected:
[ERROR]: [LoadOrderTree] 1) Paper-Test-Plugin1 -> Paper-Test-Plugin -> Paper-Test-Plugin1
[ERROR]: [LoadOrderTree]    Paper-Test-Plugin1 loadbefore: [Paper-Test-Plugin]
[ERROR]: [LoadOrderTree]    Paper-Test-Plugin loadbefore: [Paper-Test-Plugin1]
[ERROR]: [LoadOrderTree] Please report this to the plugin authors of the first plugin of each loop or join the PaperMC Discord server for further help.
[ERROR]: [LoadOrderTree] =================================
```

It is up to you to resolve these cyclical loading issues.
