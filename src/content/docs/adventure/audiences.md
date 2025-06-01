---
title: Audiences
description: A guide to Adventure Audiences.
---

An audience, at its core, is a grouping of 0 or more viewers of some content.
The concept of an audience is where Adventure makes its most clear break from
other Minecraft platforms.

As an API, `Audience` is designed to be a universal interface for any player,
command sender, console, or otherwise who can receive text, titles, boss bars,
and other Minecraft media. This allows extending audiences to cover more than
one individual receiver - possible "audiences" could include a team, server,
world, or all players that satisfy some predicate (such as having a certain
permission). The universal interface also allows reducing boilerplate by
gracefully degrading functionality if it is not applicable. For instance, it
does not make much sense to send a boss bar to a command sender, and you can't
send titles to Minecraft 1.7 clients.

You will normally get audience instances from one of the [Platforms](/adventure/platform).
The Adventure API includes two audience implementations itself: one that does not
support any action (and thus does nothing). `Audience.empty()`, and one that
forwards an action to each member in the audience, `Audience.audience()` and related
methods, along with the `ForwardingAudience` that implements the forwarding logic
for you.

Most users using will primarily use this API to show content created by other parts
of the API.

## Pointers

Audiences can also provide arbitrary information, such as display name or UUID.
This is done using the pointer system.

Examples:

```java
// get the uuid from an audience member, returning an Optional<UUID>
audience.get(Identity.UUID);

// get the display name, returning a default
audience.getOrDefault(Identity.DISPLAY_NAME, Component.text("no display name!"));
```
