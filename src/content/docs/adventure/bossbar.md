---
title: Boss bars
description: A guide to Adventure BossBars.
---

## Constructing a BossBar

Boss Bars are composed of:
  * A component used for the title of the boss bar
  * A number from 0 to 1 used to determine how full the boss bar should be
  * A color, will be downsampled for clients &lt;1.9
  * An overlay that determines the amount of visual segments on the boss bar


**Examples:**

```java
private @Nullable BossBar activeBar;

public void showMyBossBar(final @NonNull Audience target) {
  final Component name = Component.text("Awesome BossBar");
  // Creates a red boss bar which has no progress and no notches
  final BossBar emptyBar = BossBar.bossBar(name, 0, BossBar.Color.RED, BossBar.Overlay.PROGRESS);
  // Creates a green boss bar which has 50% progress and 10 notches
  final BossBar halfBar = BossBar.bossBar(name, 0.5f, BossBar.Color.GREEN, BossBar.Overlay.NOTCHED_10);
  // etc..
  final BossBar fullBar = BossBar.bossBar(name, 1, BossBar.Color.BLUE, BossBar.Overlay.NOTCHED_20);

  // Send a bossbar to your audience
  target.showBossBar(fullBar);

  // Store it locally to be able to hide it manually later
  this.activeBar = fullBar;
}

public void hideActiveBossBar(final @NonNull Audience target) {
  target.hideBossBar(this.activeBar);
  this.activeBar = null;
}
```

## Changing an active BossBar

Boss bars are mutable and listen for changes on their object,
the in-game view will change automatically without having to manually refresh it!

Therefore, if this boss bar is currently active

```java
final BossBar bossBar = BossBar.bossBar(Component.text("Cat counter"), 0, BossBar.Color.RED, BossBar.Overlay.PROGRESS);
```

and `BossBar.name()` with a component is called

```java
final Component newText = Component.text("Duck counter");
bossBar.name(newText);
```

the boss bar will be updated automatically. The same thing goes for `progress`, `color` and `overlay`.
