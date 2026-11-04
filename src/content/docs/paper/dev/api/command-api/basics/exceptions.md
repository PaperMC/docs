---
title: Exceptions
description: A guide to command syntax exceptions.
slug: paper/dev/command-api/basics/exceptions
version: "26.3"
---

If a command cannot run with the input it was given, you can throw a `CommandSyntaxException`. The server catches it and sends
its message to the command sender in red, without logging a stack trace. You can throw it in the `executes(...)` method of a command node,
as well as in the `parse` and `convert` methods of [custom arguments](/paper/dev/command-api/basics/custom-arguments).

## Exception types
Instead of constructing a `CommandSyntaxException` yourself, you create an exception type, which holds the message,
and call its `create(...)` method whenever you want to throw the exception. Brigadier provides the following exception types,
all of which implement the `CommandExceptionType` interface:

| Class                                                            | Message                                | Creating an exception                                 |
|------------------------------------------------------------------|----------------------------------------|-------------------------------------------------------|
| `SimpleCommandExceptionType`                                     | A fixed `Message`.                     | `create()`                                            |
| `DynamicCommandExceptionType`                                    | A `Function<Object, Message>`.         | `create(Object)`                                      |
| `Dynamic2CommandExceptionType` to `Dynamic4CommandExceptionType` | A function taking two to four objects. | `create(Object, Object)`, and so on                   |
| `DynamicNCommandExceptionType`                                   | A function taking an `Object[]`.       | `createWithContext(ImmutableStringReader, Object...)` |

:::caution

`DynamicNCommandExceptionType#create(Object, Object...)` does not pass its first argument to the function.
For example, `create("a", "b", "c")` only passes `["b", "c"]`. Use `createWithContext` or one of the other exception types instead.

:::

An exception type can be used to create any number of exceptions, so declare it as a constant and reuse it:

```java
private static final SimpleCommandExceptionType ERROR_NOT_PLAYER = new SimpleCommandExceptionType(
    new LiteralMessage("Only players can use this command!")
);

private static final DynamicCommandExceptionType ERROR_FULL_HEALTH = new DynamicCommandExceptionType(name -> {
    return new LiteralMessage(name + " already has full health!");
});
```

You can then throw them in your command:

```java
Commands.literal("heal")
    .executes(ctx -> {
        if (!(ctx.getSource().getExecutor() instanceof Player player)) {
            throw ERROR_NOT_PLAYER.create();
        }

        final double maxHealth = player.getAttribute(Attribute.MAX_HEALTH).getValue();
        if (player.getHealth() >= maxHealth) {
            throw ERROR_FULL_HEALTH.create(player.getName());
        }

        player.setHealth(maxHealth);
        return Command.SINGLE_SUCCESS;
    });
```

## Using components as messages
`LiteralMessage` only contains plain text. If you want to use a `Component` as the message, convert it using
the [`MessageComponentSerializer`](jd:paper:io.papermc.paper.command.brigadier.MessageComponentSerializer):

```java
private static final DynamicCommandExceptionType ERROR_FULL_HEALTH = new DynamicCommandExceptionType(name -> {
    return MessageComponentSerializer.message().serialize(MiniMessage.miniMessage().deserialize(
        "<gold><name></gold> already has full health!",
        Placeholder.unparsed("name", name.toString())
    ));
});
```

The message is still shown in red, but parts with their own color, like the name above, keep it.

## Showing where the input is invalid
While a custom argument is parsing its input in `parse(StringReader)`, you can use `createWithContext(reader, ...)` instead
of `create(...)`. The exception then remembers the input and the position of the reader's cursor, and the server shows a second
line below the message. This line contains up to 10 characters before the cursor, the rest of the input in red and underlined,
and `<--[HERE]`. Clicking the line puts the command back into the chat box.

The following argument only accepts even numbers. It moves the cursor back to the start of the number before throwing,
so that the whole number is marked, which is also what Brigadier's own argument types do:

```java title="EvenIntegerArgument.java"
public final class EvenIntegerArgument implements CustomArgumentType<Integer, Integer> {

    private static final DynamicCommandExceptionType ERROR_NOT_EVEN = new DynamicCommandExceptionType(value -> {
        return new LiteralMessage(value + " is not an even number!");
    });

    @Override
    public Integer parse(final StringReader reader) throws CommandSyntaxException {
        final int start = reader.getCursor();
        final int value = reader.readInt();
        if (value % 2 != 0) {
            reader.setCursor(start);
            throw ERROR_NOT_EVEN.createWithContext(reader, value);
        }

        return value;
    }

    @Override
    public ArgumentType<Integer> getNativeType() {
        return IntegerArgumentType.integer();
    }
}
```

Running `/split 7` with this argument shows the following, with the `7` in the second line marked in red:

```
7 is not an even number!
split 7<--[HERE]
```

The second line is only shown for exceptions thrown while the command is being parsed. Exceptions thrown in `executes(...)`
or in `CustomArgumentType.Converted#convert` only show the message, even if they were created with context.

## Built-in exceptions
`CommandSyntaxException.BUILT_IN_EXCEPTIONS` provides the exception types Brigadier uses itself, for example when a number
argument is out of range. On Paper, Vanilla replaces them with translatable messages, so players see them in the language
of their client. You can reuse them in your own code instead of writing your own messages:

```java
throw CommandSyntaxException.BUILT_IN_EXCEPTIONS.integerTooHigh().createWithContext(reader, value, maximum);
```

Note that the exceptions for numbers that are too low or too high take the found value first and the limit second.
The exception above shows `Integer must not be more than <maximum>: found <value>`.

The following table lists all built-in exceptions with their English message:

| Method                                  | Arguments          | Message                                                             |
|-----------------------------------------|--------------------|---------------------------------------------------------------------|
| `doubleTooLow()`                        | `found`, `minimum` | Double must not be less than `minimum`: found `found`               |
| `doubleTooHigh()`                       | `found`, `maximum` | Double must not be more than `maximum`: found `found`               |
| `floatTooLow()`                         | `found`, `minimum` | Float must not be less than `minimum`: found `found`                |
| `floatTooHigh()`                        | `found`, `maximum` | Float must not be more than `maximum`: found `found`                |
| `integerTooLow()`                       | `found`, `minimum` | Integer must not be less than `minimum`: found `found`              |
| `integerTooHigh()`                      | `found`, `maximum` | Integer must not be more than `maximum`: found `found`              |
| `longTooLow()`                          | `found`, `minimum` | Long must not be less than `minimum`: found `found`                 |
| `longTooHigh()`                         | `found`, `maximum` | Long must not be more than `maximum`: found `found`                 |
| `literalIncorrect()`                    | `expected`         | Expected literal `expected`                                         |
| `readerExpectedStartOfQuote()`          |                    | Expected quote to start a string                                    |
| `readerExpectedEndOfQuote()`            |                    | Unclosed quoted string                                              |
| `readerInvalidEscape()`                 | `character`        | Invalid escape sequence '\\`character`' in quoted string            |
| `readerInvalidBool()`                   | `value`            | Invalid boolean: expected 'true' or 'false' but found '`value`'     |
| `readerInvalidInt()`                    | `value`            | Invalid integer '`value`'                                           |
| `readerExpectedInt()`                   |                    | Expected integer                                                    |
| `readerInvalidLong()`                   | `value`            | Invalid long '`value`'                                              |
| `readerExpectedLong()`                  |                    | Expected long                                                       |
| `readerInvalidDouble()`                 | `value`            | Invalid double '`value`'                                            |
| `readerExpectedDouble()`                |                    | Expected double                                                     |
| `readerInvalidFloat()`                  | `value`            | Invalid float '`value`'                                             |
| `readerExpectedFloat()`                 |                    | Expected float                                                      |
| `readerExpectedBool()`                  |                    | Expected boolean                                                    |
| `readerExpectedSymbol()`                | `symbol`           | Expected '`symbol`'                                                 |
| `dispatcherUnknownCommand()`            |                    | Unknown or incomplete command. See below for error                  |
| `dispatcherUnknownArgument()`           |                    | Incorrect argument for command                                      |
| `dispatcherExpectedArgumentSeparator()` |                    | Expected whitespace to end one argument, but found trailing data    |
| `dispatcherParseException()`            | `message`          | Could not parse command: `message`                                  |
