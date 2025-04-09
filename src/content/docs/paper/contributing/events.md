---
title: Events
description: A guide on how to add new events to Paper.
slug: paper/contributing/events
---

There are several requirements for events in the Paper API.

:::note

Note that while not all existing events may follow these
guidelines, all new and modified events should adhere to them.

:::

All new events should go in the package (sub-package of) `io.papermc.paper.event`.

### Constructors

All new constructors added should be annotated with
[`@ApiStatus.Internal`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/ApiStatus.Internal.html)
to signify that they are not considered API and can change at any time without warning.

Constructors that are being replaced, if they aren't being removed, should be marked with
[`@Deprecated`](jd:java:java.lang.Deprecated) and [`@DoNotUse`](jd:paper:io.papermc.paper.annotation.DoNotUse).

### Mutability
Certain API types are "mutable" which can lead to unexpected behavior within events. Mutable types like
[`Location`](jd:paper:org.bukkit.Location) and [`Vector`](jd:paper:org.bukkit.util.Vector)
should therefore be cloned when returned from a "getter" in an event.

### `HandlerList`
For an event class or any subclass of it to be listened to, a [`HandlerList`](jd:paper:org.bukkit.event.HandlerList)
field must be present with an instance and static method to retrieve it.
See the docs for [`Event`](jd:paper:org.bukkit.event.Event) for specifics.
This field should be static and final and named `HANDLER_LIST`.

Also consider not putting a `HandlerList` on every event, just a "common parent" event so that a plugin can listen to the
parent event and capture any child events but also listen to the child event separately.

### Miscellaneous

* New parameters or method returns of type [`ItemStack`](jd:paper:org.bukkit.inventory.ItemStack)
should not be [`@Nullable`](https://javadoc.io/doc/org.jspecify/jspecify/latest/org/jspecify/annotations/Nullable.html)
in most case and instead accept an empty itemStack.
