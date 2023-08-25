---
slug: /contributing/events
---

# Events
There are several requirements for events in the Paper API. Note that while not all existing events may follow these
guidelines, all new and modified events should adhere to them.

* New events should go in the package (or sub-package of) `io.papermc.paper.event`. 
* A `HandlerList` field in an event should be private and static and have the proper capitalization (HANDLER_LIST)
* New constructors should be annotated with `ApiStatus.Internal` to further signify that they are not considered API.
* Constructors that are being replaced, if they aren't being removed, should be marked as `Deprecated` and `DoNotUse`.
* [Mutability](#mutability)
* All `ItemStack` parameters should be marked as `@NotNull`.


### Mutability
Certain API types are "mutable" which can lead to unexpected behavior within events. Mutable types like
`Location` and `Vector` should therefore be cloned when returned from a "getter" in an event.


### HandlerList
An event type is only valid for event-handler registration if that type or a super-type has the `HandlerList` field and methods on it.
Consider not putting a `HandlerList` on every event, just a "common parent" event so that a plugin can listen to the 
parent event and capture any child events but also listen to the child event separately.

