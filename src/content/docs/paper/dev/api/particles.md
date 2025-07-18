---
title: Particles
description: A guide to particle spawning
slug: paper/dev/particles
version: "1.21.8"
---

There are two methods to spawn particles:
- [`World.spawnParticle()`](jd:paper:org.bukkit.World#spawnParticle(org.bukkit.Particle,double,double,double,int)) which spawns the particle for all players and
- [`Player.spawnParticle()`](jd:paper:org.bukkit.entity.Player#spawnParticle(org.bukkit.Particle,double,double,double,int)) which spawns the particle only for the player.

Most particles do not require the additional `extra` and `data` fields. This guide explains how the particles **that do**
use these arguments, behave based on their value.

## Directional particles
This type of particle has an initial velocity when spawned. The velocity can be determined in two different ways, however
both take into account the `extra` argument as speed.
:::note
Effective speed varies between particles.
:::

:::caution
Leaving the `extra` parameter unset will default it to `1` (used as particle speed),
likely resulting in unexpected behaviour.
:::

### Random direction
Setting the `count` parameter to anything positive will yield a random direction for the velocity. The offset arguments are used as random
spawn offset from the location.

### Specified direction
To specify the velocity's direction, set the `count` argument to `0` and use the offset arguments as the direction vector.

### List of directional particles
<details>
<summary>Show list</summary>

- BUBBLE,
- BUBBLE_COLUMN_UP,
- CAMPFIRE_COSY_SMOKE,
- CAMPFIRE_SIGNAL_SMOKE,
- CLOUD,
- CRIT,
- DAMAGE_INDICATOR,
- DRAGON_BREATH,
- DUST_PLUME,
- ELECTRIC_SPARK,
- ENCHANTED_HIT,
- END_ROD,
- FIREWORK,
- FLAME,
- FLASH,
- GLOW_SQUID_INK,
- LARGE_SMOKE,
- POOF,
- REVERSE_PORTAL,
- SCRAPE,
- SCULK_CHARGE_POP,
- SCULK_SOUL,
- SHRIEK,
- SMALL_FLAME,
- SMOKE,
- SNEEZE,
- SNOWFLAKE,
- SOUL,
- SOUL_FIRE_FLAME,
- SPIT,
- SPLASH,
- SQUID_INK,
- TOTEM_OF_UNDYING,
- TRIAL_SPAWNER_DETECTION,
- TRIAL_SPAWNER_DETECTION_OMINOUS,
- WAX_OFF,
- WAX_ON,
- WHITE_SMOKE.

</details>

## Dust particles

