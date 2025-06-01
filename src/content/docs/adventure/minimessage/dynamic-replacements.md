---
title: Dynamic replacements
description: A guide on tag resolvers.
---

MiniMessage has some included `TagResolver` s which can replace tags dynamically when parsing those. Those resolvers can replace a tag with dynamic input such as a string or a formatted number.

## Placeholders

Placeholders replace the tag with a specific text. Those are the most basic replacements:

### Insert a component

You can simply insert a component for the tag with the component placeholder.

```java
MiniMessage.miniMessage().deserialize("<gray>Hello <name> :)", Placeholder.component("name", Component.text("TEST", NamedTextColor.RED)));
```

This will insert the red text component "TEST" for the tag name.

### Insert some unparsed text

Sometimes it's better to not parse dynamic text such as user inputs. For those things MiniMessage provides the unparsed placeholder.
With this method you can sanitize user input without escaping the tags directly.

```java
MiniMessage.miniMessage().deserialize("<gray>Hello <name>", Placeholder.unparsed("name", "<red>TEST :)"));
```

This will insert the text without parsing. The result will be a gray text with `Hello <red>TEST :)`.

### Insert and parse text

When you want to insert a text and allow MiniMessage to parse the tags you can use the parsed placeholder.
The parsed placeholder will insert the replacement before parsing the string. The tags in the placeholder can affect the parsed result after the placeholder.

```java
MiniMessage.miniMessage().deserialize("<gray>Hello <name> :)", Placeholder.parsed("name", "<red>TEST"));
// returns Component.text("Hello ", NamedTextColor.GRAY).append(Component.text("TEST :)", NamedTextColor.RED));
```

This will insert and parse the text.

### Insert a style

When you want to create your own styling tag you can use the styling placeholder.

```java
MiniMessage.miniMessage().deserialize("<my-style>Hello :)</my-style> How are you?",
    Placeholder.styling("my-style", ClickEvent.suggestCommand("/say hello"), NamedTextColor.RED, TextDecoration.BOLD));
// will apply a click even, a red text color and bold decoration to the text
```

This will insert the style with a click event and a red text. Styling placeholders can be used for any style, e.g. colors, text decoration and events.

Create your own styling tags:

```java
Placeholder.styling("fancy", TextColor.color(150, 200, 150)); // will replace the color between "<fancy>" and "</fancy>"
Placeholder.styling("myhover", HoverEvent.showText(Component.text("test"))); // will display your custom text as hover
Placeholder.styling("mycmd", ClickEvent.runCommand("/mycmd is cool")); // will create a clickable text which will run your specified command.
```

:::tip

Styling placeholders can be used to sanitize input from players in click events. Instead of using a parsed placeholder the string can be used directly.

:::


## Formatters

Not everything is a text, sometimes its useful to display a number or a date.
For that you can use the provided formatters from MiniMessage

### Insert a number

You can insert a `Number` by using the number formatter in MiniMessage.

To specify the locale and format of the number the formatter accepts optionally tag arguments.
You can specify the locale and the number format. It's possible to pass both as arguments to the tag but you have provide the locale first.

```java
MiniMessage.miniMessage().deserialize("<gray>Hello my number <no>!", Formatter.number("no", 250.25d));
MiniMessage.miniMessage().deserialize("<gray>Hello my number <no:'#.00'>!", Formatter.number("no", 250.25d));
MiniMessage.miniMessage().deserialize("<gray>Hello my number <no:'de-DE':'#.00'>!", Formatter.number("no", 250.25d));
MiniMessage.miniMessage().deserialize("<gray>Hello my number <no:'de-DE'>!", Formatter.number("no", 250.25d));
```

All those examples are valid and will insert the number as the tag.

Refer to Locale and DecimalFormat for valid locale tags and usable patterns.

:::tip

You can change the style such as the color by a more complex pattern:

```java
MiniMessage.miniMessage().deserialize("<gray>Your current balance is <no:'en-EN':'<green>#.00;<red>-#.00'>.", Formatter.number("no", 250.25d));
```

This will display the balance in red for negative numbers, otherwise the number will be green.

:::


### Insert a date

To insert an instance of an `TemporalAccessor` such as a `LocalDateTime` you can use the date formatter.

The tag resolver requires a tag argument for the format. Refer to DateTimeFormatter for a usable patterns.

```java
MiniMessage.miniMessage().deserialize("<gray>Current date is: <date:'yyyy-MM-dd HH:mm:ss'>!", Formatter.date("date", LocalDateTime.now(ZoneId.systemDefault()));
```

This will display the current date with the specified format. E.g. as `2022-05-27 11:30:25`.

### Insert a choice

To insert a number and format some text based on the number you can use the choice formatter.

This will accept a ChoiceFormat pattern.

```java
MiniMessage.miniMessage().deserialize("<gray>I met <choice:'0#no developer|1#one developer|1<many developers'>!", Formatter.choice("choice", 5));
```

This will format your input based on the provided ChoiceFormat. In this case it will be `I met many developers!`


## Complex placeholders

You can simply create your own placeholders. Take a look at the Formatter and Placeholder class from MiniMessage for examples.

### Examples

Create a custom tag which makes its contents clickable:

```java
TagResolver.resolver("click-by-version", (args, context) -> {
  final String version = args.popOr("version expected").value();
  return Tag.styling(ClickEvent.openUrl("https://jd.advntr.dev/api/ " + version + "/"));
});
// creates a tag to get javadocs of adventure by the version: <click-by-version:'4.14.0'>
```

You can create your own complex placeholders with multiple arguments and their own logic.
