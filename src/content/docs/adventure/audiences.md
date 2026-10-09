---
title: Audiences
slug: adventure/audiences
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

## Forwarding audiences

A [](jd:adventure:net.kyori.adventure.audience.ForwardingAudience) passes every
action it receives on to other audiences. Its only abstract method is `audiences()`,
so implementing it is enough to turn one of your own types into an audience:

```java title=GameTeam.java
public class GameTeam implements ForwardingAudience {
  private final List<GamePlayer> players = new ArrayList<>();

  // ...

  @Override
  public Iterable<? extends Audience> audiences() {
    return this.players;
  }
}
```

Everything that can be sent to an audience can now be sent to the whole team:

```java
final GameTeam team = /* ... */;
team.sendMessage(Component.text("The game starts in 10 seconds!"));
team.playSound(Sound.sound(Key.key("block.note_block.pling"), Sound.Source.MASTER, 1F, 1F));
```

`audiences()` is called every time an action is forwarded, so members added to
or removed from the backing collection are taken into account automatically.

If you do not need a type of your own,
[`Audience.audience(Iterable<? extends Audience>)`](jd:adventure:net.kyori.adventure.audience.Audience#audience(java.lang.Iterable)),
[`Audience.audience(Audience...)`](jd:adventure:net.kyori.adventure.audience.Audience#audience(net.kyori.adventure.audience.Audience...)),
and the [`Audience.toAudience()`](jd:adventure:net.kyori.adventure.audience.Audience#toAudience())
collector can create a `ForwardingAudience` for you.

A forwarding audience made up of several members has no pointers of its own, so
`get(Identity.UUID)` on the `GameTeam` above would return an empty `Optional`.

### Wrapping a single audience

To wrap exactly one audience, implement [](jd:adventure:net.kyori.adventure.audience.ForwardingAudience$Single)
instead. It forwards pointers as well as actions:

```java title=GamePlayer.java
public class GamePlayer implements ForwardingAudience.Single {
  private final Audience audience;
  private int score;

  public GamePlayer(final Audience audience) {
    this.audience = audience;
  }

  @Override
  public Audience audience() {
    return this.audience;
  }
}
```

This is especially useful in plugins that support more than one platform. The shared
code only works with `GamePlayer`, and each platform module passes in the audience for
its own player type. See [Platforms](/adventure/platform) for how to get one.

### Changing what is forwarded

Many `Audience` methods are convenience overloads that end up calling a smaller set
of methods. `sendMessage(ComponentLike)` calls `sendMessage(Component)` and
`showTitle(Title)` calls `sendTitlePart` once for each part of the title.
`ForwardingAudience` only overrides that smaller set, so that is also all you need
to override to change what your audience does:

```java title=GameTeam.java
public class GameTeam implements ForwardingAudience {
  private static final Component PREFIX = Component.text("[Team] ");

  // ...

  @Override
  public void sendMessage(final Component message) {
    // Also applies to sendMessage(ComponentLike)
    ForwardingAudience.super.sendMessage(PREFIX.append(message));
  }
}
```

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
