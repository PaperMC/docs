---
title: Migrating from Adventure 4.x to 5.x
slug: adventure/migration/adventure-4.x
description: Move from Adventure 4.x to 5.x.
---

With the release of Adventure 5.0, some breaking changes have been introduced from the Adventure 4.x series.
This page documents the changes made and how you as a developer can migrate your code.

## A modern codebase
One of the main goals for Adventure 5.0 was to migrate to a more modern codebase.
The minimum version of Java required to use Adventure is now Java 21.

By updating to Java 21, Adventure has taken advantage of sealed classes and interfaces.
Almost every interface/class that was annotated with `@ApiStatus.NonExtendable` has now been made sealed.
This means that you can no longer extend these classes, although you shouldn't have been doing that in the first place!
One relatively common incorrect usage was to create custom `Component` implementations.
This is now no longer possible, and you should instead be using the `VirtualComponent` API.

Another side effect of wanting a modern codebase is that the `adventure-extra-kotlin` module has been removed.
This module will be re-introduced in a separate repo under a new module in the future.
This will allow for more flexibility working around the more frequent Kotlin updates.

The `adventure-text-serializer-gson-legacy-impl` module has also been removed.
This module has been replaced with the implementation-agnostic `adventure-text-serializer-json-legacy-impl` module.

Finally, Adventure now contains proper `module-info.java` files for those of you using the Java 9+ module system.

## Updated dependencies

Adventure has migrated to using JSpecify for nullness annotations.
These are applied at a module level, so unless otherwise specified, everything should be treated as non-null.

As most of the internal implementation of Adventure is now using records, we no longer have need to use the Examination library for `toString` generation.
The Examination library has been entirely removed from Adventure and is no longer a transitive dependency.

The `adventure-text-logger-slf4j` module has been updated to use SLF4J 2.0.

## Breaking changes

### Click event changes

The `ClickEvent` class is now a typed interface.
The type argument for this click event is the payload type.
This does not change how you construct click events but does make serialization and deserialization easier.

This change also extends to `ClickEvent$Action`, which is now no longer an enum and instead is a typed interface.

### Component construction changes

All component construction methods now only accept `StyleBuilderApplicable` as additional parameters for styling.
This allows for more flexibility in how you construct components and also reduces the number of methods used to create components.
This change will only require a recompile, as all existing methods of constructing components will translate to the new methods seamlessly.

Regarding forward-compatibility (e.g., running code compiled against Adventure 4.x on Adventure 5.x), the old methods will continue to work.
During the 5.x series, we will maintain the old methods as invisible synthetic methods.
This means that old code compiled against Adventure 4.x will work, but the methods will not be visible in your IDE.

This period of migration will end in Adventure 6.0 with the removal of the invisible synthetic methods.

## Removal of deprecated methods and classes
A number of methods and classes have been deprecated in across the Adventure 4.x series.
This section documents the removals that have been made and how you can migrate your code, if applicable.

* **`BuildableComponent` has been removed.**\
  You can now obtain a `ComponentBuilder` directly from a `Component` using `Component#toBuilder`.
  A breaking side effect of this change is that `NBTComponent` now only accepts one type argument, rather than two.
* **Legacy chat signing/identifying methods have been removed.**\
  Although legacy versions still use these features, they did not have enough usage to warrant their continued existence in Adventure.
  Generally speaking, you should migrate to using signed messages if you intend to send identified/chat messages.
  * **The `MessageType` enum has been removed entirely.**\
    Chat messages are now identified when sending a signed message.
    All other messages are system messages.
  * **All `Audience#sendMessage` methods that accept an `Identity` or `Identified` have been removed.**\
    Prefer sending signed messages instead.
* **Boss bar percent has been removed.**\
  This includes the max/min percent constants and methods to change/get the percent.
  You should instead be using the progress constants/methods.
* **`of` style static methods have been removed.**\
  These methods have been deprecated for some time, and each has named replacements.
* **Custom click payload data has been removed.**\
  As custom click payloads contain NBT, you should instead be using the `nbt` method.
  This includes the custom click event constructor methods that accept strings instead of NBT.
* **`ClickEvent#create(Action, String)` has been removed.**\
  As click events can now hold data other than strings, this method has been removed.
  If you were using this method, you should migrate to the `create` method that accepts a payload or use the direct construct methods (e.g. `ClickEvent#openUrl(String)`).
* **`ClickEvent#value` has been removed.**\
  As noted above, click events can now hold data other than strings.
  Therefore, this method has been removed in favor of the `payload` method.
* **`AbstractComponent` has been removed.**\
  As this class was primarily an implementation detail, it has been removed with no replacement.
* **Non-builder component joining has been removed.**\
  This includes the `Component#join` family of methods that do not accept a `JoinConfiguration`.
  You should instead be using `Component#textOfChildren` or `join` methods that accept a `JoinConfiguration`.
* **`Component#detectCycle(Component)` has been removed.**\
  As components are immutable, this method is not required and has therefore been removed with no replacement.
* **Non-builder component text replacement has been removed.**\
  This includes the `Component#replace[First]Text` family of methods that do not accept a `TextReplacementConfig`.
  You should instead be using the `replaceText` methods that accept a `TextReplacementConfig`.
* **`TranslationRegistry` has been removed.**\
  Registries have been replaced with the more powerful `TranslationStore`.
  See static methods on `TranslationStore` for a compatible replacement.
* **`JSONComponentConstants` has been removed.**\
  This has been replaced with `ComponentTreeConstants` from the `adventure-text-serializer-commons` module.
* **`PlainComponentSerializer` has been removed.**\
  This has been replaced with the equivalent `PlainTextComponentSerializer` class.
* **`ClickEvent$Action#payloadType` has been removed.**\
  As click event actions are now typed, this field is no longer required.
* **Typos have been removed.**\
  Some incorrectly spelt/named methods, such as `Argument#numeric` and `ComponentSerializer#deseializeOrNull`, have been removed.
  These methods have been deprecated, and correctly spelt/named methods have been available for a while.
