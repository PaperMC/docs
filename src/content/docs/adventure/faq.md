---
title: FAQ
description: Frequently asked questions.
---

We find that there are some issues users come across relatively frequently while applying the Adventure library in certain contexts. These may not be directly related to Adventure itself, but these answers are published here those that ask them:

## Why is my lore in italics?

Components will inherit style from their parent. For example, in the following code snippet, each word will be red, despite red not being explicitly set on the appended component: `text("hi", RED).append(text("also red!"))`.

In vanilla Minecraft, some places where components are rendered have parent styles. For example, lore text has a parent style that makes all text italic. This means that you will need to set italic to false if you do not want any component you are storing in lore to be italic. The `Component.decorationIfAbsent()` method can apply this to existing components without overriding any formatting specifically set by users.

## Messages not sending? Hex colors not working? Events not appearing? Fonts messed up?

- Test on a vanilla client, without any mods or resource packs. Modded clients (such as Badlion), client mods, and even resource packs can break many elements of the modern JSON chat format and mess with incoming chat packets in ways that cause a myriad of issues.
- Try without other plugins/mods. If another plugin/mod is modifying outgoing packets or formatting chat messages, this could cause a loss of formatting in the messages you send. Try without any other plugins to see if any are causing issues.
- For RGB colors, test on a client of at least version *1.16*. Mojang added RGB support in this version. The JSON message format has evolved over time and has had many new additions since its introduction many, many years ago. For a full version history, see [the Minecraft wiki](https://minecraft.wiki/w/Raw_JSON_text_format).

## How can I support both MiniMessage and legacy (§-code) formatting?

If you have legacy in configuration files, or other places, it is suggested that you migrate them once using the legacy deserializer to turn them into a component and then MiniMessage to serialize them into proper MiniMessage format.

There are no working, recommended, or supported ways of using both MiniMessage and legacy color codes and there never will be. Even simple find-and-replace style techniques do not work and will fail to take into account the quirks of style resetting in legacy formatting.

## How can I use Bukkit's PlaceholderAPI in MiniMessage messages?

PlaceholderAPI placeholders are not supported in MiniMessage. However, you can easily create a custom tag resolver that can allow users to use PlaceholderAPI placeholders in MiniMessage strings, like in the following example:

<details>
  <summary>Example</summary>
  Example method to create a MiniMessage placeholder that parses PlaceholderAPI placeholders for a player.

  The tag added is of the format `<papi:[papi_placeholder]>`. For example, `<papi:luckperms_prefix>`.

  Credit to `mbaxter`.

  ```java
  /**
  * Creates a tag resolver capable of resolving PlaceholderAPI tags for a given player.
  *
  * @param player the player
  * @return the tag resolver
  */
  public @NotNull TagResolver papiTag(final @NotNull Player player) {
      return TagResolver.resolver("papi", (argumentQueue, context) -> {
          // Get the string placeholder that they want to use.
          final String papiPlaceholder = argumentQueue.popOr("papi tag requires an argument").value();

          // Then get PAPI to parse the placeholder for the given player.
          final String parsedPlaceholder = PlaceholderAPI.setPlaceholders(player, '%' + papiPlaceholder + '%');

          // We need to turn this ugly legacy string into a nice component.
          final Component componentPlaceholder = LegacyComponentSerializer.legacySection().deserialize(parsedPlaceholder);

          // Finally, return the tag instance to insert the placeholder!
          return Tag.selfClosingInserting(componentPlaceholder);
      });
  }
  ```
</details>

## Why am I getting a `NoSuchFieldError`, `NoSuchMethodError`, `ClassNotFoundException` or similar when updating/using `adventure-platform-*`, `adventure-text-minimessage`, `adventure-api` or other related libraries/tools?

In the case of `adventure-platform-fabric`, you need to make sure you are properly `include()`-`ing` the mod. For legacy platform implementations, you need to make sure you are properly shading and relocating your specific dependencies. Specific issues may include:

- Not shading the correct version of `adventure-api`. You can check your dependency tree to see what or why your build tool is not including the correct version of the API that matches the one used by the platform version you are using.
- Not relocating your dependencies. If you are running on a platform that includes an older version of the API, or another mod/plugin is also not properly relocating their dependencies, you will use their out-of-date version of the API, causing errors.
- Building/running against a native implementation of `adventure-api`.  If you are running on a platform that includes an older version of the API, this could cause issues if the library depends on newer features that are not available in the outdated version of the API, your library will not be able to find these methods, causing errors.
- Relocating `adventure-api` and trying to use native/library methods. If you relocate the API, you will not be able to use any methods that use the API in native implementations or libraries as method signatures will differ. Either shade and relocate this software, or do not use native methods. Alternatively, if you are shading and relocating a library but want to use the API, make sure you are only relocating the packages that you are shading.

Please consult the documentation for your build tool for more information on how to shade, relocate and manage your dependencies. We do not provide one-on-one support for these sorts of issues, as there are far too many project-specific variables that make isolating issues difficult.
