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

import com.mojang.brigadier.Command;
import com.mojang.brigadier.builder.LiteralArgumentBuilder;
import com.mojang.brigadier.tree.LiteralCommandNode;
import com.velocitypowered.api.command.BrigadierCommand;
import com.velocitypowered.api.command.CommandSource;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;

public final class TestBrigadierCommand {

    public static BrigadierCommand createBrigadierCommand() {
        LiteralCommandNode<CommandSource> helloNode = LiteralArgumentBuilder
            .<CommandSource>literal("test")
            // Here you can filter the subjects that can execute the command.
            // This is the ideal place to do "hasPermission" checks
            .requires(source -> source.hasPermission("test.permission"))
            // Here you can add the logic that will be used in
            // the execution of the "/test" command without any argument
            .executes(context -> {
                // Here you get the subject that executed the command
                CommandSource source = context.getSource();

                Component message = Component.text("Hello World", NamedTextColor.AQUA);
                source.sendMessage(message);

                // Returning Command.SINGLE_SUCCESS means that the execution was successful
                // Returning BrigadierCommand.FORWARD will send the command to the server
                return Command.SINGLE_SUCCESS;
            })
            // Using the "then" method you can add subarguments to the command.
            // For example, this subcommand will be executed when using the command "/test subcommand"
            .then(LiteralArgumentBuilder.<CommandSource>literal("argument"))
            .build();

        // BrigadierCommand implements Command
        return new BrigadierCommand(helloNode);
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
import java.util.concurrent.CompletableFuture;
import java.util.List;
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

    // This method allows you to control who can execute the command.
    // If the possible executor does not have the necessary permission or requirement,
    // the command execution will be sent directly to the server where it is located,
    // completely hiding the command from the proxy including its visibility among
    // the available commands and its execution
    @Override
    public boolean hasPermission(final Invocation invocation) {
        return invocation.source().hasPermission("command.test");
    }

    // With this method you can control the suggestions to send
    // to the CommandSource according to the arguments
    // it has already written or other requirements you need
    @Override
    public List<String> suggest(final Invocation invocation) {
        return List.of();
    }

    // Here you can offer argument suggestions in the same way as the previous method,
    // but asynchronously. It is recommended to use this method instead of the previous one
    // especially in cases where you make a more extensive logic to provide the suggestions
    @Override
    public CompletableFuture<List<String>> suggestAsync(final Invocation invocation) {
        return CompletableFuture.completedFuture(List.of());
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
package com.example.velocityplugin;

import com.google.inject.Inject;
import com.velocitypowered.api.command.BrigadierCommand;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.proxy.ProxyServer;

@Plugin(id = "helloworld")
public final class HelloWorldPlugin {
    private final ProxyServer proxy;

    @Inject
    public HelloWorldPlugin(ProxyServer proxy) {
        this.proxy = proxy;
    }

    @Subscribe
    public void onProxyInitialize(ProxyInitializeEvent event) {
        CommandManager commandManager = proxy.getCommandManager();
        // Here you can add meta for the command, as aliases and the plugin to which it belongs (RECOMMENDED)
        CommandMeta commandMeta = commandManager.metaBuilder("test")
            // This will create new alias por the command "/test"
            // with the same arguments and functionality
            .aliases("otherAlias", "anotherAlias")
            .plugin(this)
            .build();

        // You can replace this with "new EchoCommand()" or "new TestCommand()"
        // SimpleCommand simpleCommand = new TestCommand();
        // RawCommand rawCommand = new EchoCommand();
        // The registration is done in the same way, since all 3 interfaces implement "Command"
        BrigadierCommand commandToRegister = TestBrigadierCommand.createBrigadierCommand();

        // Finally...
        commandManager.register(meta, commandToRegister);
    }
}
```

If you're registering a `BrigadierCommand`, you may prefer to use the `#register(BrigadierCommand)`
method or `#metaBuilder(BrigadierCommand)` to specify additional aliases.
