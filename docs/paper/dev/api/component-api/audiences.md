---
slug: /dev/component-api/audiences
description: How to use Adventure's Audiences.
---

# Audiences

Audiences wrap a collection of recipients that can receive messages. They can be used to send messages to individual 
players, groups of players, or even the entire server (including the console).

## Who is an Audience?

All `CommandSender`'s are single audiences. This includes players, the console, and command blocks. `Server`, `Team` and 
`World` are all forwarding audiences. This means that they are made up of multiple audiences. For example, the server is
made up of all online players and the console.

This means that all the Audience methods are available on `CommandSender`'s, `Server`, `Team`, and `World`.

## ForwardingAudience

The `ForwardingAudience` wraps a collection of `Audience` instances and forwards messages to all of them. This is useful
for sending messages to multiple audiences (players) at once.

```java
// Server is a ForwardingAudience which includes all online players and the console
ForwardingAudience audience = Bukkit.getServer();

// To construct an audience from a collection of players, use:
Audience audience = Audience.audience(Audience...);
// If you pass in a single Audience, it will be returned as-is. If you pass in a collection of Audiences, they will be
// wrapped in a ForwardingAudience.
```

## What do Audiences do?

Audiences are used for interacting with players. They can be used to send messages, play sounds, show boss bars, and more.
They are mostly used for sending other parts of the API to players. For example, you can send a `Component` to a player
using `Audience#sendMessage(Component)`.

## Pointers

Audiences can also provide arbitrary information, such as display name or UUID. This is done using the pointer system.

```java
// Get the uuid from an audience member, returning an Optional<UUID>
Optional<UUID> uuid = audience.get(Identity.UUID);

// Get the display name, returning a default
Component name = audience.getOrDefault(Identity.DISPLAY_NAME, Component.text("no display name!"));
```
