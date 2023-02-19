---
slug: /dev/getting-started/paper-plugins
---

# Paper Plugins

Paper plugins allow developers to take advantage of more modern concepts introduced by mojang, such as datapacks, to 
expand the field of what the Paper API is able to introduce.

:::info Experimental

This is experimental and may be subject to change.

:::

- [Bootstrapper](#bootstrapper)
- [Loader](#loaders)
- [Differences](#differences)

## How do I use them?
Similarly to Bukkit plugins, you have to introduce a ``paper-plugin.yml`` file into your jar resources folder.
Here is an example configuration.
```yml
name: Paper-Test-Plugin
version: ${version}
main: io.papermc.testplugin.TestPlugin
description: Paper Test Plugin
author: PaperMC
api-version: ${apiversion}
load: STARTUP
bootstrapper: io.papermc.testplugin.TestPluginBootstrap
loader: io.papermc.testplugin.TestPluginLoader
defaultPerm: FALSE
permissions:
dependencies:
```

## What is it used for?
Paper plugins lay down the framework for some future api.


## Bootstrapper
Paper plugins are able to identify their own bootstrapper by implementing ``io.papermc.paper.plugin.bootstrap.PluginBootstrap`` and adding
the class of your implementation to the bootstrapper field in the ``paper-plugin.yml``.
```java
public class TestPluginBootstrap implements PluginBootstrap {

    @Override
    public void bootstrap(@NotNull PluginProviderContext context) {
        
    }

    @Override
    public @NotNull JavaPlugin createPlugin(@NotNull PluginProviderContext context) {
        return new TestPlugin("My custom parameter");
    }
    
}
```
A Bootstrapper allow you to also override how your plugin is initiated, allowing you to pass values into your plugin constructor.
Currently, bootstrappers do not offer much new api, and are highly experimental. This may be subject to change once more api is more introduced.

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
Paper plugins do not support the serialization system (``org.bukkit.configuration.serialization``) that bukkit uses. Your classes will not be able to be
serialized, vise versa. It is highly recommended to not use this system with Paper Plugins.

### Classloading Isolation
Paper plugins have isolated classloaders, meaning that relocating dependencies will not be necessary. Paper plugin are not able to access each other unless given explicit access
by depending on another plugin, etc. This prevents plugins from accidentally accessing your dependencies, and in general helps ensure that plugins are only able to access your plugin
if they explicitly say that they're depending on it.

Paper plugins have the ability to bypass this, being able to access OTHER plugins classloaders by adding 
```yml
has-open-classloader: true
```
to your ``paper-plugin.yml``. Note, other plugins will still be unable to access your classloader.