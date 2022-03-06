---
slug: /velocity/developers/command-api
---

# The Command API

The Command API lets you create commands that can be executed by a player connected to the proxy or
the console.

## Creating a command

Each command class needs to implement a `Command` subinterface. The choice depends on the type of
arguments and the granularity of suggestions provided to the client. These include:

### `BrigadierCommand`

Internally, Velocity uses the [Brigadier](https://github.com/Mojang/brigadier) library to register
and dispatch command actions. You can register your own `CommandNode`s by wrapping them in a
`BrigadierCommand`. Let's see an example of a command that will tell whoever executes the command
"Hello World" in light blue text.

```java
package com.example.velocityplugin;

import com.mojang.brigadier.builder.LiteralArgumentBuilder;
import com.mojang.brigadier.tree.LiteralCommandNode;
import com.velocitypowered.api.command.BrigadierCommand;
import com.velocitypowered.api.command.CommandSource;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;

@Plugin(id = "helloworld")
public class HelloWorldPlugin {

    public void createBrigadierCommand() {
        LiteralCommandNode<CommandSource> helloNode = LiteralArgumentBuilder
            .<CommandSource>literal("test")
            .executes(context -> {
                Component message = Component.text("Hello World", NamedTextColor.AQUA);
                context.getSource().sendMessage(message);
                return 1; // indicates success
            })
            .build();

        // BrigadierCommand implements Command
        BrigadierCommand command = new BrigadierCommand(helloNode);
    }
}
```

Brigadier commands have full backwards-compatibility with 1.12.2 and lower versions.

Custom plugin command argument types are not supported in Velocity, as they would require the client
to also support them. We recommend sticking to the predefined Brigadier types provided.

### `SimpleCommand`

Modelled after the convention popularized by Bukkit and BungeeCord, a `SimpleCommand` has three
methods: one for when the command is executed, one to provide suggestions for tab completion, and
one to check a `CommandSource` has permission to use the command. All methods receive a
`SimpleCommand.Invocation` object, which contains the `CommandSource` that executed the command and
the arguments as an array of strings. The previous example can also be implemented using this
interface:

```java
package com.example.velocityplugin;

import com.velocitypowered.api.command.CommandSource;
import com.velocitypowered.api.command.SimpleCommand;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;

public final class TestCommand implements SimpleCommand {

    @Override
    public void execute(final Invocation invocation) {
        CommandSource source = invocation.source();
        // Get the arguments after the command alias
        String[] args = invocation.arguments();

        source.sendMessage(Component.text("Hello World!").color(NamedTextColor.AQUA));
    }

    @Override
    public boolean hasPermission(final Invocation invocation) {
        return invocation.source().hasPermission("command.test");
    }
}
```

It's important to note `invocation.arguments()` doesn't include the command alias (e.g. `teleport`
for `/teleport foo bar`). In the event that no arguments are specified, an empty array will be
passed, rather than a null array.

If a player or the console executes the following command: `/stats Player2 kills`, the first
argument will be `Player2`, which we can access using `invocation.arguments()[0]` and the second
argument will be `kills`.

### `RawCommand`

There's certain cases where you don't need to process the arguments. These may include:

- A `/say` style command, where the arguments contain the message as a string; or
- You're using an external command framework to process your commands.

A raw command indicates the proxy to pass the command alias and its arguments directly without
further processing. Let's see an example of a command that echoes the received input:

```java
package com.example.velocityplugin;

import com.velocitypowered.api.command.RawCommand;
import net.kyori.adventure.text.Component;

public final class EchoCommand implements RawCommand {

    @Override
    public void execute(final Invocation invocation) {
        invocation.source().sendMessage(Component.text(invocation.arguments()));
    }

    @Override
    public boolean hasPermission(final Invocation invocation) {
        return invocation.source().hasPermission("command.echo");
    }
}
```

## Registering a command

Now that we have created a command, we need to register it in order for it to work. To register
commands, you use the Command Manager. We get the command manager by executing
`proxyServer.getCommandManager()` with the proxy instance, or by injecting it using the `@Inject`
annotation in the main class. The register method requires two parameters, the command metadata and
the command object.

The `CommandMeta` contains the case-insensitive aliases and more advanced features. The Command
Manager provides a meta builder via the `#metaBuilder(String alias)` method.

```java
CommandMeta meta = commandManager.metaBuilder("test")
    // Specify other aliases (optional)
    .aliases("otherAlias", "anotherAlias")
    .build();
```

Finally,

```java
commandManager.register(meta, new TestCommand());
```

If you're registering a `BrigadierCommand`, you may prefer to use the `#register(BrigadierCommand)`
method or `#metaBuilder(BrigadierCommand)` to specify additional aliases.
