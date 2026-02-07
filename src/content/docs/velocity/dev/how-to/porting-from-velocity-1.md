---
title: Porting your plugin from Velocity 1.x.x
description: How to port your plugin from Velocity 1.x.x to modern API.
slug: velocity/dev/porting-plugins-from-velocity-1
---

Velocity 3.0.0 includes important API changes from the Velocity 1.x.x series. **Please read this
document very carefully**.

## Minimum supported Java version bump

Velocity 3.5.x and above now requires Java 21 and above.

## Removal of legacy dependencies

We removed all support for the old `text` 3 library. For `text` 3.x.x (and all the APIs that depend
on it), direct equivalents are available in [Adventure](/adventure/), which was
introduced in Velocity 1.1.0.

`toml4j`, deprecated in Velocity 1.1.0 (as it is no longer maintained), has not been removed to
provide more time for plugins to migrate to Configurate. However, you should prepare to either
switch to Configurate or shade `toml4j` into your plugin directly.

## New asynchronous event system

Velocity 3.0.0 contains a backport of Velocity Polymer's event system, which differs from Velocity
1.x.x's event system in a number of ways. Velocity 1.x.x's event model forced all events to be
executed asynchronously on a fixed-size thread pool, which has proven over time to be a flawed
model.

Existing event handlers will continue to work unmodified on Velocity 3.0.0, as all event handlers
are assumed to be asynchronous blocking handlers by default. However, there are some new APIs
introduced for handling continuations - see the [event API page](/velocity/dev/event-api) for more
information. However, you are encouraged to migrate your event listeners to the new event API
paradigms.
