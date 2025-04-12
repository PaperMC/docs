---
title: Registration
description: A guide to registering Brigadier commands.
slug: paper/dev/command-api/basics/registration
---

In the previous chapters, we have taken an extensive look at how Brigadier works, but never actually elaborated on how to register commands. So we will be doing that right here!

## The LifecycleEventManager
In Paper, Brigadier commands are registered using the `LifecycleEventManager`. This is a special class which allows us to register commands in such a way that we never have to
worry about handling various server reload events, like `/reload`. Instead, whatever we register using the `LifecycleEventManager`, will be reregistered each time it is required.

But how does one get access to a `LifecycleEventManager` capable of registering commands? There are two "contexts" in which you can use a LifecycleEventManager. The first one,
and preferred one, is in the `PluginBootstrap` class of our plugin.

### Registering inside a plugin bootstrapper

:::note

This requires you to use a [`paper-plugin.yml` plugin](/paper/dev/getting-started/paper-plugins).

If you are not using `paper-plugin.yml`, you can instead [register your commands inside your plugin's main class](#registering-inside-a-plugin-main-class).

:::

We can get access to a `LifecycleEventManager` capable of registering commands by running `context.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, commands -> {})`
inside our bootstrap method, like this:

```java title="CustomPluginBootstrap.java"
public class CustomPluginBootstrap implements PluginBootstrap {

    @Override
    public void bootstrap(BootstrapContext context) {
        context.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, commands -> {
            // register your commands here ...
        });
    }
}
```

A quick recap on what all of this means:
By running `context.getLifecycleManager()`, we get a `LifecycleEventManager<BootstrapContext>` object. We can call
`LifecycleEventManager#registerEventHandler(LifecycleEventType, LifecycleEventHandler)` on that to get our correct lifecycle event. The first parameter declares
the lifecycle event type we want to register stuff for, the second parameter is an interface that looks like this:

```java
@FunctionalInterface
public interface LifecycleEventHandler<E extends LifecycleEvent> {
    void run(E event);
}
```

Due to it being a functional interface, we can, instead of implementing it, just pass in a lambda which has one parameter, `E`, and no return value. The `E` generic type is a
`ReloadableRegistrarEvent<Commands>`, which is thus also the type of our lambda parameter.

The `ReloadableRegistrarEvent<Commands>` class has two methods: `ReloadableRegistrarEvent.Cause cause()` and `Commands registrar()`. The more relevant method for us is
the `registrar` one. With it we can register our commands.


### Registering inside a plugin main class
Getting access to a `LifecycleEventManager` for commands inside our plugin's main class is very similar to how you access it inside the PluginBootstrap class, with the difference
that instead of getting the `LifecycleEventManager` using the `BootstrapContext` provided to us in the bootstrap method of our PluginBootstrap class, we can just retrieve it using
`JavaPlugin#getLifecycleManager`.

```java title="PluginMainClass.java"
public final class PluginMainClass extends JavaPlugin {

    @Override
    public void onEnable() {
        this.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, commands -> {
            // register your commands here ...
        });
    }
}
```

This follows the same concept as the PluginBootstrap one, just that instead of being given a `LifecycleEventManager<BootstrapContext>`, we are instead given a
`LifecycleEventManager<Plugin>`. This doesn't really matter for our use cases, but you might as well be aware of that.
The rest of the methods works the exact same way as with the `PluginBootstrap` parameterized `LifecycleEventManager`.

## Registering commands using the Commands class
Now that we have access to the instance of a `Commands` class via `commands.registrar()` in our event handler, we have access to a few overloads of the `Commands#register`
method.

### Registering a LiteralCommandNode
Most of the time, you will be using a `LiteralArgumentBuilder` to build up your command tree. In order to retrieve a `LiteralCommandNode` from that object, we need to call the
`LiteralArgumentBuilder#build()` method on it:

```java
LiteralArgumentBuilder<CommandSourceStack> command = Commands.literal("testcmd")
    .then(Commands.literal("argument_one"))
    .then(Commands.literal("argument_two"));

LiteralCommandNode<CommandSourceStack> buildCommand = command.build();
```

Or in short:

```java
LiteralCommandNode<CommandSourceStack> buildCommand = Commands.literal("testcmd")
    .then(Commands.literal("argument_one"))
    .then(Commands.literal("argument_two"))
    .build();
```

Now that we have retrieved our `LiteralCommandNode`, we can register it. For that we have multiple overloads, which optionally allow us to set aliases and/or the description.
Registering our "testcmd" might look like this:

```java
this.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, commands -> {
    commands.registrar().register(buildCommand);
});
```

### Registering a BasicCommand
A [`BasicCommand`](jd:paper:io.papermc.paper.command.brigadier.BasicCommand) is a Bukkit-like way of defining commands. Instead of building up a command tree,
we allow all user input and retrieve the arguments as a simple array of strings. This type of commands is particularly useful for very simple, text based commands,
like a `/broadcast` command. You can read up on more details about basic commands [here](/paper/dev/command-api/misc/basic-command).

Assuming you already have your `BasicCommand` object, we can register it like this:

```java
final BasicCommand basicCommand = ...;

this.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, commands -> {
    commands.registrar().register("commandname", basicCommand);
});
```

Similar to the `LiteralCommandNode`, we also have overloads for setting various additional information for our command.

## Further reference
* For a quick reference on the LifecycleEventManager, click [here](/paper/dev/lifecycle).
