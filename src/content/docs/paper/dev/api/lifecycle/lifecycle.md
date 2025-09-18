---
title: Lifecycle API
description: An introduction to Paper's Lifecycle API.
slug: paper/dev/lifecycle
sidebar:
  label: Introduction
---

The lifecycle API can be used for lifecycle-related registration. It is currently used by the
Brigadier command API. It is planned to be used for the Registry Modification API as well.
Generally, systems that are initialized very early in the startup process can take advantage of this
event system.

## LifecycleEventManager

The [LifecycleEventManager](jd:paper:io.papermc.paper.plugin.lifecycle.event.LifecycleEventManager) is tied
to either a [Plugin](jd:paper:org.bukkit.plugin.Plugin) instance or a
[BootstrapContext](jd:paper:io.papermc.paper.plugin.bootstrap.BootstrapContext) depending on where you access it from. For example in your plugin's main class:

```java title="TestPlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
}
```

Or, with a bootstrapper:

```java title="TestPluginBootstrap.java"
@Override
public void bootstrap(BootstrapContext context) {
    final LifecycleEventManager<BootstrapContext> lifecycleManager = context.getLifecycleManager();
}
```

## LifecycleEvents

After obtaining the correct `LifecycleEventManager`, create an event handler by selecting an
event type from [LifecycleEvents](jd:paper:io.papermc.paper.plugin.lifecycle.event.types.LifecycleEvents):
```java title="TestPlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
    PrioritizedLifecycleEventHandlerConfiguration<LifecycleEventOwner> config = LifecycleEvents.SOME_EVENT.newHandler((event) -> {
        // Handler for the event
    });
}
```

### Configuration

Each handler created can be configured in several ways. The available configuration options
depend on the event type itself and will vary from event type to event type.

#### Priority

Setting the priority of a handler can determine where it runs relative to other handlers
on the same event type. The lower the number, the earlier it will be run. The default priority
is 0.

#### Monitor

Marking the handler as a monitor will cause it to be called after all other non-monitor handlers
have been called. Only use this to inspect some state in the event. Do not modify any state in
the handler.

The priority and monitor state are exclusive options, setting one will reset the other.

```java title="TestPlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
    PrioritizedLifecycleEventHandlerConfiguration<LifecycleEventOwner> config = LifecycleEvents.SOME_EVENT.newHandler((event) -> {
        // Handler for the event
    });
    config.priority(10); // sets a priority of 10
    // or
    config.monitor(); // marks the handler as a monitor
}
```

### Registering

Once the handler has been configured, it can be registered with the lifecycle manager:

```java title="TestPlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
    PrioritizedLifecycleEventHandlerConfiguration<LifecycleEventOwner> config = LifecycleEvents.SOME_EVENT.newHandler((event) -> {
        // Handler for the event
    }).priority(10);
    lifecycleManager.registerEventHandler(config);
}
```
There is also a shorthand way to register just the handler without doing any configuration:

```java title="TestPlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
    lifecycleManager.registerEventHandler(LifecycleEvents.COMMANDS, (event) -> {
        // Handler for the event
    });
}
```

:::note

Some event types have special behaviors that restrict certain mechanics. The reloading plugins
functionality (via `/bukkit:reload` or `Server#reload()`) is disabled if plugins register handlers
in certain situations. This is due to the plugin reloads having to fully unload the plugin and its
classes which is an issue if an event has to run while the plugin is unloaded.

:::

## Why does this exist?

We already have an event system, why do we need another one? This is a fair question. The answer is
that some of these events fire well before `JavaPlugin` instances are created, before the
`MinecraftServer` instance is created, right at the very start of server startup. These can be
before all the registries have been initialized which is one of the first things to happen on a Vanilla
server. The existing Bukkit event system is not designed to exist at this time, and modifying it to
support this environment is more trouble than just having a separate system for specific events that
can fire during this early initialization.

:::note[Technical Explanation]

Here is an ever-expanding list of specific reasons why we can't just modify the existing event
system to support this new need for events:

- You cannot have generics on Bukkit events because there is 0 compile time checking since they are
  registered reflectively. This is a problem because the events are mostly going to follow a very
  similar pattern, specifically the registry modification events. If we can’t use generics, there’s
  going to be many useless classes.

- Another reason is that the existing system has priorities, but always has them. With the lifecycle
  events, there may be some events for which we do not want to support priorities (it would
  be based purely on plugin load order then).

- Exists too late. `HandlerList` and event registration all use the `Plugin` instance which does not exist,
  and cannot exist, during the bootstrapper. Changing this would require a substantial rewrite of the
  existing system and probably confuse API users who expect all `RegisteredListeners` to have a
  Plugin attached.

- A new system lets us use interfaces and server implementations for events which dramatically
  simplifies them. With the Bukkit system you could kind of do this with a server impl event
  extending the API event, but interfaces are more flexible.

- A new system lets us enforce, at compile time, which events you can register where based on the
  context of the registration. So you can’t even register a handler for an event in the wrong spot,
  that will be a compiler error thanks to our implementation using Generics.

:::
