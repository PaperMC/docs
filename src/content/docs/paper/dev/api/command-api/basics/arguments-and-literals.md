---
title: Arguments and literals
description: An extensive guide to command arguments and literals.
slug: paper/dev/command-api/basics/arguments-and-literals
---

:::note

In the [command tree docs](/paper/dev/command-api/basics/command-tree) we have looked at the structure of Brigadier commands and how to build up a command tree.
If you haven't finished reading that yet, we strongly recommend doing that before reading about arguments and literals.

:::

## Introduction

Each `.then(...)` method of an `ArgumentBuilder<CommandSourceStack, ?>` takes in another `ArgumentBuilder<CommandSourceStack, ?>` object. This abstract ArgumentBuilder
has two implementations: `RequiredArgumentBuilder` and `LiteralArgumentBuilder`. When using Brigadier with Paper, we create these objects by running either `Commands.literal(String)`
for the `LiteralArgumentBuilder` or `Commands.argument(String, ArgumentType<T>)` for the `RequiredArgumentBuilder`.

As an explanation to what the difference is, you can picture it like this:
* An argument is a variable input by the user. It is semi-unpredictable, but will always return a valid entry of the object that it is backing.
* A literal is a non-variable input by the user. It is mainly used as a way to define predictable input, since each literal is a new branch on our command tree.

## Literals
In code, literals generally cannot be accessed. Yet, due to the nature of our command tree, we can always know on what literal branch we currently are:
```java
Commands.literal("plant")
    .then(Commands.literal("tree")
        .executes(ctx -> {
            /* Here we are on /plant tree */
        })
    )
    .then(Commands.literal("grass")
        .executes(ctx -> {
             /* Here we are on /plant grass */
        }));
```

:::tip

You may notice the usage of the `executes` method. This method declares logic to our branches. If a branch has no `executes` method defined, it will not be executable.
For more information about execution logic, [click here](/paper/dev/command-api/basics/executors).

:::

## Arguments
Arguments are slightly more complex. They also define a new branch in a tree, but they are not directly predictable. Each argument is created using `Commands.argument(String, ArgumentType<T>)`.
That method returns a `RequiredArgumentBuilder`. The T type parameter declares the return type of the argument, which you can then use inside your `executes` method. That means that
if you put in an `ArgumentType<Integer>`, you can retrieve the value of that argument as an integer, requiring no manual parsing! There are a few build-in, primitive argument types
that we can use for arguments:

|               Name                | Return value  |   Possible Input    |                                           Description                                            |
|-----------------------------------|---------------|---------------------|--------------------------------------------------------------------------------------------------|
| BoolArgumentType.bool()           | Boolean       | true/false          | Only allows a boolean value                                                                      |
| IntegerArgumentType.integer()     | Integer       | 253, -123, 0        | Any valid integer                                                                                |
| LongArgumentType.longArg()        | Long          | 25418263123783      | Any valid long                                                                                   |
| FloatArgumentType.floatArg()      | Float         | 253.2, -25.0        | Any valid float                                                                                  |
| DoubleArgumentType.doubleArg()    | Double        | 4123.242, -1.1      | Any valid double                                                                                 |
| StringArgumentType.word()         | String        | letters-and+1234567 | A single word. May only contain letters and numbers and these characters: `+`, `-`, `_`, and `.` |
| StringArgumentType.string()       | String        | "with spaces"       | A single word, or, if quoted, any valid string with spaces                                       |
| StringArgumentType.greedyString() | String        | unquoted spaces     | The literal written input. May contain any characters. Has to be the last argument               |

### Boolean argument type and argument parsing
A boolean argument is used for retrieving, well, a boolean. An example usage for that might be a `/serverflight` command which allows for enabling and disabling server flight
with `/serverflight true` and `/serverflight false`:

```java title="ServerFlightCommand.java"
Commands.literal("serverflight")
    .then(Commands.argument("allow", BoolArgumentType.bool())
        .executes(ctx -> {
            boolean allowed = ctx.getArgument("allow", boolean.class);
            /* Toggle server flying */
        })
    );
```

Here, you can see how one would access an argument in-code. The first parameter for the `Commands.argument(String, ArgumentType)` method takes in the node name. This is not required
by literals, as their name is the same as their value. But here we need a way to access the argument. The parameter of the executes-lambda has a method called
`T getArgument(String, Class<T>)`. The first parameter is the name of the method we want to retrieve. The second parameter is the return value of the argument. As we are using
a boolean argument, we put in `boolean.class` and retrieve the argument value as such.

### Number arguments
All of the number arguments (like `IntegerArgumentType.integer()`) have three overloads:

|                     Overload                      |                        Description                        |
|---------------------------------------------------|-----------------------------------------------------------|
| `IntegerArgumentType.integer()`                   | Any value between Integer.MIN_VALUE and Integer.MAX_VALUE |
| `IntegerArgumentType.integer(int min)`            | Any value between min and Integer.MAX_VALUE               |
| `IntegerArgumentType.integer(int min, int max)`   | Any value between min and max                             |

This is particularly useful for filtering out too high or too low input. As an example, we can define a `/flyspeed` command. As the
[`Player#setFlySpeed(float value)`](jd:paper:org.bukkit.entity.Player#setFlySpeed(float)) method only
accepts floats between -1 and 1, where -1 is an inverse direction, it would make sense to limit the values between 0 and 1 for in-bounds, non-negative speed values.
This can be achieved with the following command tree:

```java title="FlightSpeedCommand.java"
Commands.literal("flyspeed")
    .then(Commands.argument("speed", FloatArgumentType.floatArg(0, 1.0f))
        .executes(ctx -> {
            float speed = ctx.getArgument("speed", float.class);
            /* Set player's flight speed */
            return Command.SINGLE_SUCCESS;
        })
    );
```

:::tip

Some arguments can have special ways of being retrieved. Most notably, all of the Brigadier-provided arguments (the ones mentioned on this page)
have a resolver to get their own argument value. For the float argument, this would look like this:

```java
float speed = FloatArgumentType.getFloat(ctx, "speed");
```

It generally does not matter whether you use `ctx.getArgument` or `FloatArgumentType.getFloat`, since it goes through the same logic, but in future documentation,
primitive values might be retrieved using their own parsers.

These parsers for Brigadier-native arguments exist. All of these take in `(CommandContext<?> context, String name)` as method parameters:
- `BoolArgumentType.getBool`
- `IntegerArgumentType.getInteger`
- `LongArgumentType.getLong`
- `FloatArgumentType.getFloat`
- `DoubleArgumentType.getDouble`
- `StringArgumentType.getString`

:::

Now, if we input a valid float between 0 and 1, the command would execute correctly:
![](./assets/valid-float.png)

But if we input a too small or too big float, it would throw an error **on the client**:
![](./assets/small-float.png)
![](./assets/big-float.png)

This is the main advantage of native arguments: The client itself performs simple error checking on the arguments, which makes user experience whilst running a command
way better, as they can see invalid input without sending the command to the server.

### String arguments
There is three string arguments: `word`, `string`, and `greedyString`.

The `word` string argument is the simplest one of these. It only accepts a single word consisting of alphanumerical characters and these special characters: `+`, `-`, `_`, and `.`.
* ✅ `.this_is_valid_input.`
* ❌ `this is invalid input`
* ❌ `"also_invalid"`
* ✅ `-10_numbers_are_valid`
* ❌ `@_@`

The `string` argument is slightly more complicated. If unquoted, it follows the same rules as the `word` argument. Only alphanumerical characters and the mentioned special characters.
But if you put your string into quotes, you can enter any combination of unicode characters you want to. Quotes `"` can be escaped using a backslash `\`.
* ✅ `this_is-valid-input`
* ✅ `"\"quotes\""`
* ❌ `this is invalid input`
* ✅ `"this is valid input again"`
* ✅ `"also_valid"`
* ✅ `"紙の神"`

The `greedyString` argument is the only argument which does not perform any parsing. Due to its "greedy" nature, it does not allow any arguments after its declaration. That also means, that
any input is completely valid and it requires no quotes. In fact, quotes are counted as literal characters.
* ✅ `this_is_valid_input`
* ✅ `this is valid as well input`
* ✅ `"this is valid input again"`
* ✅ `also_valid`
* ✅ `紙の神`

Here you can see the arguments in action:
![](./assets/string-arguments.gif)

## Further reference
### Minecraft arguments
Apart from these built-in Brigadier arguments, countless custom arguments are defined by Paper as well. These can be accessed in a static context with the `ArgumentTypes` class. You
can read more about these [here](/paper/dev/command-api/arguments/minecraft).

### Custom arguments
Sometimes you want to define your own, custom arguments. For that you can implement the `CustomArgumentType<T, N>` interface.
You can read more about these [here](/paper/dev/command-api/basics/custom-arguments).
