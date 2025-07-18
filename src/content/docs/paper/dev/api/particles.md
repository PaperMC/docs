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
use these arguments behave based on their value.

## Directional particles
This type of particle has initial velocity when spawned. The known list of particles of this type:

:::caution
If your particle count is not `0`, leaving the `extra` parameter unset will default it to `1` (used as particle speed),
resulting in some particles to **shoot in a random direction**.
:::
