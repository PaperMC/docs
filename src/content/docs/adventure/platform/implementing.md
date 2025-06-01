---
title: Implementing platforms
description: Implementing Adventure for your own platform.
---

Most users will be here to look at information about existing platform implementations, but for those who are looking to build their own platform integrations, look no further.

While at its core Adventure 'just' provides data structures and serializers, as the game evolves and more functionality is added there are more tunable options and platform hooks
necessary to produce the correct output for the applicable game version. This has led to the introduction of a variety of services that platforms can provide implementations of using
Java's `ServiceLoader` mechanism. Some other behaviors are expected by convention. As there are not that many platforms that integrate with Adventure, this page is an attempt to
cover the common points. Please don't be afraid to ask us questions, and together we can work on fleshing out this page.

## Services

### `ComponentSerializer` services

Most of the serializers (Gson, legacy, etc.) have `Provider` SPI's that allow customizing the default behaviors of serializers. These are most applicable for the Gson/other JSON
serializers where the data structures have changed over time, but the legacy serializer's options can be worth referencing too. See the Javadoc for each serializer for more information.

For any `JSONComponentSerializer` subtype, we have tried to gather relevant tunable options within a single system, keyed by the game's active
[data version](https://minecraft.wiki/w/Data_version). To handle hover events in pre-1.16 game versions, there's the additional `LegacyHoverEventSerializer`
interface. We offer an implementation that uses `adventure-nbt` as a separate submodule, but platforms may wish to use a native NBT library for this instead.
Both of these options should be set on builders in the appropriate `Provider` implementation.

### Data component values

To handle storing platform-specific data on `show_item` hover events, we expose opaque data objects in-API. Platforms should provide logic to convert between different
implementations by providing an implementation of `DataComponentValueConverterRegistry.Provider`. For the most part this is just converting between platform-specific types
and the generic `TagSerializable` and `Removed` types, but platforms should make sure to include converters to `GsonDataComponentValue` (from both platform types
*and* the generic `TagSerializable` that requires parsing SNBT for a conversion to occur).

### Click callbacks

As callbacks are a commonly desired feature, Adventure provides a 'virtual' click event type for callback functions. This action is not persistent between runs, and needs
platforms to register a command to trigger callbacks to execute. This is implemented via the `ClickCallback.Provider` SPI. This command should not be sent as part of the
command tree that clients receive to avoid spamming them.

Platforms implementing the click callback provider must register a command at the appropriate time, and maintain a registry of active callbacks that is added to any time a
callback command is requested. The platform is responsible for ensuring any execution conditions apply and implementing the effects of any `Option`s that may be set on the callback.

### Component logging

`ComponentLogger`, as part of the `adventure-text-logger-slf4j` module, provides a logging interface that extends SLF4J and wraps any existing SLF4J logger (compatible with
v1 and v2). Platforms are responsible for providing the adapter that looks up the appropriate logger by name and serializes components to text.

This should involve performing any translations if necessary. The default behavior of the logger is to serialize to plain text, but platforms may want to look at the
`/serializer/ansi` serializer instead for colored output.

### Boss bars

Boss bars are logistically somewhat complicated. As one of the few holders of mutable state in the library, they have to re-sync any state changes to their viewers.
In order to track viewers and link up to any internal state, the `BossBarImplementation.Provider` SPI allows platforms to provide their own implementation hooks per-bar.

## Conventional behaviors

Some behaviors are expected by platforms beyond what is explicitly required by implementing certain interfaces. These are:

* When implementing `Audience`, any unsupported operations should fail silently.
* When sending components to a player, they should be passed through `GlobalTranslator` before sending to perform any translations (note: `GlobalTranslator` is only for
  custom translations, and should not contain vanilla resource pack translations - they have a different interpolation syntax than `GlobalTranslator` uses)
* There is no specific required list of Adventure modules to distribute with your platform, but we recommend `adventure-api`, `adventure-text-minimessage`,
  `adventure-text-logger-slf4j`, plus whatever serializers are required for the integration. We specifically do not recommend distributing the
  `adventure-text-serializer-legacy` module unless it is necessary for backwards compatibility within your platform.
