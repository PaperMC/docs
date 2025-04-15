---
title: MiniMessage Translator
description: A guide on the MiniMessage translator.
---

:::note

For more information about both Minecraft and Adventure's localization systems, see `localization`.

:::

MiniMessage provides a `Translator` implementation that allows you to use MiniMessage as translation strings.
It also provides automatic support for argument placeholders, letting you use simple translatable components throughout your codebase.

## Creating a MiniMessage translator

To start, create an implementation of the `MiniMessageTranslator` and register it to the `GlobalTranslator`.
This can be done using `GlobalTranslator.translator().addSource(myMiniMessageTranslator)`.
For an example of how to create your own `MiniMessageTranslator`, see the below code block.

```java
public class MyMiniMessageTranslator extends MiniMessageTranslator {

  public MyMiniMessageTranslator() {
    // By default, the standard MiniMessage instance will be used.
    // You can specify a custom one in the super constructor.
    super(MiniMessage.miniMessage());
  }

  @Override
  public @Nullable String getMiniMessageString(final @NotNull String key, final @NotNull Locale locale) {
    // Creating a custom MiniMessage translator is as simple as overriding this one method.
    // All you need to do is return a MiniMessage string for the provided key and locale.
    // In this example we will hardcode this, but you could pull it from a resource bundle, a properties file, a config file or something else entirely.
    if (key.equals("mykey") && locale == Locale.US) {
      return "<red>Hello, <name>! Today is <day_of_week>."
    } else {
      // Returning null "ignores" this translation.
      return null;
    }
  }
}
```

### MiniMessage translation store

In order to make managing a `MiniMessageTranslator` easier, we also provide a `TranslationStore` implementation using MiniMessage strings.
For documentation on how to use translation stores, see `localization`.

Note that the `MiniMessageTranslationStore` contains the same methods as the message format translation store for populating a translation store using resource bundles.

## Using a MiniMessage translator

The MiniMessage translator will automatically turn translatable component arguments into a custom tag.
This tag will be `<arg:index>` or `<argument:index>` where `index` is the zero indexed position of the argument.
For example, this component `Component.translatable(key, Component.text("Kezz"))` with the MiniMessage string `Hello, <arg:0>!` will produce "Hello, Kezz!".

You can also use the `Argument` class to create named tags for ease of use.
For example, this component `Component.translatable(key, Argument.component("name", Component.text("Kezz"))` will produce the string "Hello, Kezz!"
when used with either `Hello, <arg:0>!` or `Hello, <name>!`.

Finally, you can also add entirely custom tags or tag resolvers to the deserialization by using the rest of the methods on `Argument`.
For a full list, please see the Javadocs for the `Argument` class.
