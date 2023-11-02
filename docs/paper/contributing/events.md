---
slug: /contributing/events
description: A guide on how to add new events to Paper.
---

# Events
There are several requirements for events in the Paper API.

:::note

Note that while not all existing events may follow these
guidelines, all new and modified events should adhere to them.

:::

All new events should go in the package (sub-package of) `io.papermc.paper.event`.

### Constructors

All new constructors added should be annotated with `ApiStatus.Internal` to signify that they are not considered
API and can change at any time without warning.

Constructors that are being replaced, if they aren't being removed, should be marked with `Deprecated` and `DoNotUse`.

### Mutability
Certain API types are "mutable" which can lead to unexpected behavior within events. Mutable types like
`Location` and `Vector` should therefore be cloned when returned from a "getter" in an event.

### HandlerList
For an event class or any subclass of it to be listened to, a `HandlerList` field must be present with an instance and static method
to retrieve it. See the docs for [Event](https://jd.papermc.io/paper/1.20/org/bukkit/event/Event.html) for specifics. This field should be static and
final and named `HANDLER_LIST`.

Also consider not putting a `HandlerList` on every event, just a "common parent" event so that a plugin can listen to the 
parent event and capture any child events but also listen to the child event separately.

### Miscellaneous

* New parameters or method returns of type `ItemStack` should be `@NotNull`.
