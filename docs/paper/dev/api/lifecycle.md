---
slug: /dev/lifecycle
description: A guide to Paper's Lifecycle API
---

# Lifecycle API

The lifecycle API can be used for lifecycle-related registration, such as commands, the Registry Modification API and other similar resources.

## LifecycleEventManager

The `LifecycleEventManager` is tied to either a `Plugin` instance or a `BootstrapContext` depending on where you access
it from. For example in your plugin's main class:

```java title="TestPlugin.java"
@Override
public void onEnable() {
  LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
}
```

Or, with a bootstrapper:

```java title="TestPluginBootstrap.java"
@Override
public void bootstrap(@NotNull BootstrapContext context) {
  final LifecycleEventManager<BootstrapContext> lifecycleManager = context.getLifecycleManager();
}
```

## LifecycleEvents & RegistryEvents
