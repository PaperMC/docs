---
title: Custom arguments
description: Guide on custom arguments.
slug: paper/dev/command-api/basics/custom-arguments
---

Custom arguments are nothing more than a wrapper around existing argument types, which allow a developer to provide an argument with suggestions and reusable parsing in order to
reduce code repetition.

## Why would you use custom arguments?
As example, if you want to have an argument for a player, which is currently online and an operator, you could use a player argument type, add custom suggestions, and throw a
`CommandSyntaxException` in your `executes(...)` method body. This would look like this:

```java
Commands.argument("player", ArgumentTypes.player())
    .suggests((ctx, builder) -> {
        Bukkit.getOnlinePlayers().stream()
            .filter(ServerOperator::isOp)
            .map(Player::getName)
            .filter(name -> name.toLowerCase(Locale.ROOT).startsWith(builder.getRemainingLowerCase()))
            .forEach(builder::suggest);
        return builder.buildFuture();
    })
    .executes(ctx -> {
        final Player player = ctx.getArgument("player", PlayerSelectorArgumentResolver.class).resolve(ctx.getSource()).getFirst();
        if (!player.isOp()) {
            final Message message = MessageComponentSerializer.message().serialize(text(player.getName() + " is not a server operator!"));
            throw new SimpleCommandExceptionType(message).create();
        }

        ctx.getSource().getSender().sendRichMessage("Player <player> is an operator!",
            Placeholder.component("player", player.displayName())
        );
        return Command.SINGLE_SUCCESS;
    })
```

As you can see, there is a ton of logic not directly involved with the functionality of the command. And if we want to use this same argument on another node, we have to
copy-paste a lot of code. It goes without saying that this would be incredibly tedious.

The solution to this problem are custom arguments. Before going into detail about them, this is how the argument would look when implemented as a custom argument:

```java title="OppedPlayerArgument.java"
@NullMarked
public final class OppedPlayerArgument implements CustomArgumentType<Player, PlayerSelectorArgumentResolver> {

    private static final SimpleCommandExceptionType ERROR_BAD_SOURCE = new SimpleCommandExceptionType(
        MessageComponentSerializer.message().serialize(Component.text("The source needs to be a CommandSourceStack!"))
    );

    private static final DynamicCommandExceptionType ERROR_NOT_OPERATOR = new DynamicCommandExceptionType(name -> {
        return MessageComponentSerializer.message().serialize(Component.text(name + " is not a server operator!"));
    });

    @Override
    public Player parse(StringReader reader) {
        throw new UnsupportedOperationException("This method will never be called.");
    }

    @Override
    public <S> Player parse(StringReader reader, S source) throws CommandSyntaxException {
        if (!(source instanceof CommandSourceStack stack)) {
            throw ERROR_BAD_SOURCE.create();
        }

        final Player player = getNativeType().parse(reader).resolve(stack).getFirst();
        if (!player.isOp()) {
            throw ERROR_NOT_OPERATOR.create(player.getName());
        }

        return player;
    }

    @Override
    public ArgumentType<PlayerSelectorArgumentResolver> getNativeType() {
        return ArgumentTypes.player();
    }

    @Override
    public <S> CompletableFuture<Suggestions> listSuggestions(CommandContext<S> ctx, SuggestionsBuilder builder) {
        Bukkit.getOnlinePlayers().stream()
            .filter(ServerOperator::isOp)
            .map(Player::getName)
            .filter(name -> name.toLowerCase(Locale.ROOT).startsWith(builder.getRemainingLowerCase()))
            .forEach(builder::suggest);
        return builder.buildFuture();
    }
}
```

At a first look, that seems like way more code than it was needed to just do the logic in the command tree itself. So what is the advantage?
The answer becomes apparent rather quickly when we look at how the argument is now declared:

```java
Commands.argument("player", new OppedPlayerArgument())
    .executes(ctx -> {
        final Player player = ctx.getArgument("player", Player.class);

        ctx.getSource().getSender().sendRichMessage("Player <player> is an operator!",
            Placeholder.component("player", player.displayName())
        );
        return Command.SINGLE_SUCCESS;
    })
```

This is way more readable and easy to understand when using a custom argument. And it is reusable! Hopefully, you now have a basic grasp of **why** you should use custom arguments.

## Examining the `CustomArgumentType` interface
The interface is declared as follows:

```java title="CustomArgumentType.java"
package io.papermc.paper.command.brigadier.argument;

@NullMarked
public interface CustomArgumentType<T, N> extends ArgumentType<T> {

    @Override
    T parse(final StringReader reader) throws CommandSyntaxException;

    @Override
    default <S> T parse(final StringReader reader, final S source) throws CommandSyntaxException {
        return ArgumentType.super.parse(reader, source);
    }

    ArgumentType<N> getNativeType();

    @Override
    @ApiStatus.NonExtendable
    default Collection<String> getExamples() {
        return this.getNativeType().getExamples();
    }

    @Override
    default <S> CompletableFuture<Suggestions> listSuggestions(final CommandContext<S> context, final SuggestionsBuilder builder) {
        return ArgumentType.super.listSuggestions(context, builder);
    }
}
```

### Generic types
There are three generic types present in the interface:
- `T`: This is the type of the class that is returned when `CommandContext#getArgument` is called on this argument.
- `N`: The native type of the class which this custom argument extends. Used as the "underlying" argument.
- `S`: A generic type for the command source. Will usually be a `CommandSourceStack`.

### Methods
| Method declaration                                                                                                              | Description                                                                                                                                                                   |
|---------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ArgumentType<N> getNativeType()`                                                                                               | Here, you declare the underlying argument type, which is used as a base for client-side argument validation.                                                                  |
| `T parse(final StringReader reader) throws CommandSyntaxException`                                                              | This method is used if `T parse(StringReader, S)` is not overridden. In here, you can run conversion and validation logic.                                                    |
| `default <S> T parse(final StringReader reader, final S source)`                                                                | If overridden, this method will be preferred to `T parse(StringReader)`. It serves the same purpose, but allows including the source in the parsing logic.                    |
| `default Collection<String> getExamples()`                                                                                      | This method should **not** be overridden. It is used internally to differentiate certain argument types while parsing.                                                        |
| `default <S> CompletableFuture<Suggestions> listSuggestions(final CommandContext<S> context, final SuggestionsBuilder builder)` | This method is the equivalent of `RequiredArgumentBuilder#suggests(SuggestionProvider<S>)`. You can override this method in order to send your own suggestions to the client. |

### A very basic implementation
```java
package io.papermc.commands;

import com.mojang.brigadier.StringReader;
import com.mojang.brigadier.arguments.ArgumentType;
import com.mojang.brigadier.arguments.StringArgumentType;
import io.papermc.paper.command.brigadier.argument.CustomArgumentType;
import org.jspecify.annotations.NullMarked;

@NullMarked
public class BasicImplementation implements CustomArgumentType<String, String> {

    @Override
    public String parse(StringReader reader) {
        return reader.readUnquotedString();
    }

    @Override
    public ArgumentType<String> getNativeType() {
        return StringArgumentType.word();
    }
}
```

Notice the use of `reader.readUnquotedString()`. In addition to allowing existing argument types to parse your argument,
you can also manually read input. Here, we read an unquoted string, the same as a word string argument type.

## `CustomArgumentType.Converted<T, N>`
In case that you need to parse the native type to your new type, you can instead use the `CustomArgumentType.Converted` interface.
This interface is an extension to the `CustomArgumentType` interface, which adds two new, overridable methods:

```java
T convert(N nativeType) throws CommandSyntaxException;

default <S> T convert(final N nativeType, final S source) throws CommandSyntaxException {
    return this.convert(nativeType);
}
```

These methods work similarly to the `parse` methods, but they instead provide you with the parsed, native type instead of a `StringReader`.
This reduced the need to manually do string reader operations and instead directly uses the native type's parsing rules.

## Error handling during the suggestions phase
In case you are looking for the ability to make the client show currently typed input as red to display invalid input, it should be noted that this is **not possible** with
custom arguments. The client is only able to validate arguments it knows about and there is no way to throw a `CommandSyntaxException` during the suggestions phase. The only way to
achieve that is by using **literals**, but those cannot be modified dynamically during server runtime.

![](./assets/ice-cream-invalid.png)

## Example: Ice-cream argument
A practical example on how you can use a custom argument to your advantage could be a classical enum-type argument. In our case, we use this
`IceCreamFlavor` enum:

```java title="IceCreamFlavor.java"
package io.papermc.commands.icecream;

import org.jspecify.annotations.NullMarked;

@NullMarked
public enum IceCreamFlavor {
    VANILLA,
    CHOCOLATE,
    STRAWBERRY;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
```

We then can use a converted custom argument type in order to convert between a word string argument and our enum type, like this:

```java title="IceCreamArgument.java"
package io.papermc.commands.icecream;

@NullMarked
public class IceCreamArgument implements CustomArgumentType.Converted<IceCreamFlavor, String> {

    private static final DynamicCommandExceptionType ERROR_INVALID_FLAVOR = new DynamicCommandExceptionType(flavor -> {
        return MessageComponentSerializer.message().serialize(Component.text(flavor + " is not a valid flavor!"));
    });

    @Override
    public IceCreamFlavor convert(String nativeType) throws CommandSyntaxException {
        try {
            return IceCreamFlavor.valueOf(nativeType.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ignored) {
            throw ERROR_INVALID_FLAVOR.create(nativeType);
        }
    }

    @Override
    public <S> CompletableFuture<Suggestions> listSuggestions(CommandContext<S> context, SuggestionsBuilder builder) {
        for (IceCreamFlavor flavor : IceCreamFlavor.values()) {
            String name = flavor.toString();

            // Only suggest if the flavor name matches the user input
            if (name.startsWith(builder.getRemainingLowerCase())) {
                builder.suggest(flavor.toString());
            }
        }

        return builder.buildFuture();
    }

    @Override
    public ArgumentType<String> getNativeType() {
        return StringArgumentType.word();
    }
}
```

Finally, we can just declare our command like this, and we are done! And again, you can just directly get the argument as a ready `IceCreamFlavor`
type without any additional parsing in the `executes(...)` method, which makes custom argument types very powerful.

```java
Commands.literal("icecream")
    .then(Commands.argument("flavor", new IceCreamArgument())
        .executes(ctx -> {
            final IceCreamFlavor flavor = ctx.getArgument("flavor", IceCreamFlavor.class);

            ctx.getSource().getSender().sendRichMessage("<b><red>Y<green>U<aqua>M<light_purple>!</b> You just had a scoop of <flavor>!",
                Placeholder.unparsed("flavor", flavor.toString())
            );
            return Command.SINGLE_SUCCESS;
        })
    )
    .build();
```

![](./assets/ice-cream.png)
