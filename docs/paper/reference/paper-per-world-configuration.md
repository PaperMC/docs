---
slug: /paper/reference/paper-per-world-configuration
keywords:
  - paper.yml
  - paper.yml world-settings
---

# Paper Per World Config

World settings are configured on a per-world basis. The child-node _default_ is used for all worlds
that do not have their own specific settings. For more information about how per world configuration
of Paper works, see the [Per World Configuration Guide](../how-to/per-world-configuration.md). For
global config, see the [Paper Global Configuration Reference](paper-global-configuration.md)

### disable-teleportation-suffocation-check

- **default**: false
- **description**: Disables the suffocation check the server performs before teleporting a player.
- **note**: While useful to keep your players out of walls, leaving this feature on may allow
  players to teleport through solid materials by logging out in specific locations.

### max-auto-save-chunks-per-tick

- **default**: 24
- **description**: The maximum number of chunks the auto-save system will save in a single tick.

### per-player-mob-spawns

- **default**: true
- **description**: Determines whether the mob limit (in bukkit.yml) is counted per player or for the
  entire server. Enabling this setting results in roughly the same number of mobs, but with a more
  even distribution that prevents one player from using the entire mob cap and provides a more
  single-player like experience.

### baby-zombie-movement-modifier

- **default**: 0.5
- **description**: Modifies the speed that baby zombies move at, where 0.5 is 50% faster than the
  mob base speed, and -0.4 would be 40% slower.

### optimize-explosions

- **default**: false
- **description**: Instructs the server to cache entity lookups during an explosion, rather than
  recalculating throughout the process. This speeds up explosions significantly.

### fixed-chunk-inhabited-time

- **default**: -1
- **description**: If 0 or greater, set the chunk inhabited time to a fixed number.
- **note**: The timer is increased when chunks are kept loaded because of player activity.

### use-vanilla-world-scoreboard-name-coloring

- **default**: false
- **description**: Instructs the server to use the vanilla scoreboard for player nickname coloring.
- **note**: Useful when playing on adventure maps made for the vanilla server and client.

### experience-merge-max-value

- **default**: -1
- **description**: Instructs the server to put a maximum value on experience orbs, preventing them
  all from merging down into 1 single orb.
- **note**: The default value instructs the server to use no max value, allowing them to merge down
  into a single orb. This is especially noticeable when defeating boss monsters.

### prevent-moving-into-unloaded-chunks

- **default**: false
- **description**: Sets whether the server will prevent players from moving into unloaded chunks or
  not.

### count-all-mobs-for-spawning

- **default**: false
- **description**: Determines whether spawner mobs and other misc mobs are counted towards the
  global mob limit.

### delay-chunk-unloads-by

- **default**: 10s
- **description**: Delays chunk unloads by the specified time

### falling-block-height-nerf

- **default**: 0
- **note**: Values less than 1 will disable this feature.
- **description**: The height at which falling blocks will be removed from the server.

### tnt-entity-height-nerf

- **default**: 0
- **note**: Values less than 1 will disable this feature.
- **description**: The height at which Primed TNT entities will be removed from the server.

### filter-nbt-data-from-spawn-eggs-and-related

- **default**: true
- **description**: Instructs the server to remove certain NBT data from spawn eggs, falling blocks,
  and other often abused items in creative mode.
- **note**: Some adventure maps may require this to be turned off to function correctly, but we do
  not recommend turning it off on a public server.

### max-entity-collisions

- **default**: 8
- **description**: Instructs the server to stop processing collisions after this value is reached.

### disable-creeper-lingering-effect

- **default**: false
- **description**: Disables creepers randomly leaving behind a lingering area effect cloud.

### duplicate-uuid-resolver

- **default**: saferegen

- **description**: Specifies the method the server uses to resolve entities with duplicate UUIDs.
  This can be one of the following values:
  - **saferegen**: Regenerate a UUID for the entity, or delete it if they are close.
  - **delete**: Delete the entity.
  - **silent**: Does nothing, not printing logs.
  - **warn**: Does nothing, printing logs.

### duplicate-uuid-saferegen-delete-range

- **default**: 32
- **description**: If multiple entities with duplicate UUIDs are within this many blocks, saferegen
  will delete all but 1 of them.

### phantoms-do-not-spawn-on-creative-players

- **default**: true
- **description**: Disables spawning of phantoms on players in creative mode

### phantoms-only-attack-insomniacs

- **default**: true
- **description**: Prevents phantoms from attacking players who have slept

### water-over-lava-flow-speed

- **default**: 5
- **description**: Sets the speed at which water flows while over lava.

### grass-spread-tick-rate

- **default**: 1
- **description**: Sets the delay, in ticks, at which the server attempts to spread grass. Higher
  values will result in a slower spread.

### use-faster-eigencraft-redstone

- **default**: false
- **description**: Instructs the server to use a faster redstone implementation, which may
  drastically help with performance in redstone.

### nether-ceiling-void-damage-height

- **default**: 0
- **description**: Sets the level above which players in the nether will take void damage. This is a
  vanilla-friendly way to restrict players from using the nether ceiling as a buildable area.
  Setting to 0 disables this feature.

### keep-spawn-loaded

- **default**: true
- **description**: Instructs the server to keep the spawn chunks loaded at all times.

### armor-stands-do-collision-entity-lookups

- **default**: true
- **description**: Instructs armor stand entities to do entity collision checks.

### parrots-are-unaffected-by-player-movement

- **default**: false
- **description**: Makes parrots "sticky" so they do not fall off a player's shoulder when they
  move. Use crouch to shake them off.

### only-players-collide

- **default**: false
- **description**: Only calculate collisions if a player is one of the two entities colliding.

### allow-vehicle-collisions

- **default**: false
- **description**: Whether vehicles should also be able to collide while `only-players-collide` is
  enabled.

### allow-non-player-entities-on-scoreboards

- **default**: false
- **description**: Instructs the server to treat non-player entities as if they are never on a
  scoreboard.
- **note**: Enabling this value may increase the amount of time the server spends calculating entity
  collisions.

### portal-search-radius

- **default**: 128
- **description**: The maximum range the server will use to look for an existing nether portal. If
  it can't find one in that range, it will generate a new one.

### portal-create-radius

- **default**: 16
- **description**: The maximum range the server will try to create a portal around when generating a
  new portal

### portal-search-vanilla-dimension-scaling

- **default**: true
- **description**: Whether to apply vanilla dimension scaling to `portal-search-radius`.

### disable-thunder

- **default**: false
- **description**: Disables thunderstorms.

### skeleton-horse-thunder-spawn-chance

- **default**: 0.01
- **description**: Sets the chance that a "Skeleton Trap" (4 skeleton horsemen) will spawn in a
  thunderstorm.

### disable-ice-and-snow

- **default**: false
- **description**: Disables ice and snow formation. This also causes cauldrons to no longer be filled by rain or snow.

### disable-explosion-knockback

- **default**: false
- **description**: Instructs the server to completely block any knockback that occurs as a result of
  an explosion.

### keep-spawn-loaded-range

- **default**: 10
- **description**: The range in chunks around spawn to keep loaded.

### container-update-tick-rate

- **default**: 1
- **description**: The rate, in ticks, at which the server updates containers and inventories.

### map-item-frame-cursor-update-interval

- **default**: 10
- **description**: The interval in ticks at which cursors on maps in item frames are updated.
  Setting this to a number less than 1 will disable updates altogether.

### fix-items-merging-through-walls

- **default**: false
- **description**: Whether items should be prevented from merging through walls. Enabling this will
  incur a performance degradation. This is only necessary when `merge-radius.item` (spigot.yml) is
  large enough to merge items through walls.

### prevent-tnt-from-moving-in-water

- **default**: false
- **description**: Instructs the server to keep Primed TNT entities from moving in flowing water.

### show-sign-click-command-failure-msgs-to-player

- **default**: false
- **description**: Whether commands executed by sign click should show failure messages to players.

### spawner-nerfed-mobs-should-jump

- **default**: false
- **description**: Determines if spawner nerfed mobs should attempt to float (jump) in water.

### enable-treasure-maps

- **default**: true
- **description**: Allows villagers to trade treasure maps.

### treasure-maps-return-already-discovered

- **default**: false
- **description**: Instructs the server to target the first treasure location found, rather than the
  first undiscovered one. Vanilla mechanics normally find the first undiscovered location, which may
  lead to structures that were not fully looted, and can also fail with a world border set. Enabling
  this will make the map simply find the closest target structure, regardless of whether it has been
  loaded or not already.

### iron-golems-can-spawn-in-air

- **default**: false
- **description**: Sets whether iron golems can spawn in the air. Iron farms may break depending on
  this setting

### armor-stands-tick

- **default**: true
- **description**: Disable to prevent armor stands from ticking. Can improve performance with many
  armor stands.

### non-player-arrow-despawn-rate

- **default**: -1
- **note**: The default value instructs the server to use the same default arrow despawn rate from
  spigot.yml that is used for all arrows.
- **description**: The rate, in ticks, at which arrows shot from non-player entities are despawned.

### creative-arrow-despawn-rate

- **default**: -1
- **description**: The rate, in ticks, at which arrows shot from players in creative mode are
  despawned.

### entities-target-with-follow-range

- **default**: false
- **description**: Sets whether the server should use follow range when targeting entities

### zombies-target-turtle-eggs

- **default**: true
- **description**: Sets whether zombies and zombified piglins should target turtle eggs. Setting
  this to false may help with performance, as they won't search for nearby eggs.

### zombie-villager-infection-chance

- **default**: -1.0

- **description**: Sets the change for villager conversion to zombie villager. Set to -1.0 for
  default behavior based on game difficulty. Set to 0.0 to always have villagers die when killed by
  zombies. Set to 100.0 to always convert villagers to zombie villagers.

### all-chunks-are-slime-chunks

- **default**: false
- **description**: Instructs the server to treat all chunks like slime chunks, allowing them to
  spawn in any chunk.
- **note**: This may actually decrease your chances of running into a Slime as they now have a much
  larger potential spawn area.

### slime-spawn-height

- swamp-biome
  - maximum
    - **default**: 70
    - **description**: Sets the maximum Y position for natural Slime spawn in Swamp Biomes.
  - minimum
    - **default**: 50
    - **description**: Sets the minimum Y position for natural Slime spawn in Swamp Biomes.
- slime-chunk
  - maximum
    - **default**: 40
    - **description**: Sets the maximum Y position for natural Slime spawn in Slime Chunks.

### mob-spawner-tick-rate

- **default**: 1
- **description**: How often mob spawners should tick to calculate available spawn areas and spawn
  new entities into the world. A value of -1 will disable all spawners.

### light-queue-size

- **default**: 20
- **description**: Sets how large the queue of light updates off the main thread for each world
  should be. Vanilla uses 5, but this causes issues especially with plugins such as WorldEdit.

### auto-save-interval

- **default**: -1
- **note**: Default value instructs the world to use Bukkit's default.
- **description**: Instructs this world to use a specific value for auto-save instead of bukkit's
  global value.

### game-mechanics

- scan-for-legacy-ender-dragon

  - **default**: true
  - **description**: Determines whether the server searches for the ender dragon when loading older
    worlds.

- disable-pillager-patrols

  - **default**: false
  - **description**: Disables Pillager patrols and associated AI.

- disable-unloaded-chunk-enderpearl-exploit

  - **default**: true
  - **description**: Prevent enderpearls from storing the thrower when in an unloaded chunk.

- disable-chest-cat-detection

  - **default**: false
  - **description**: Allows you to open chests even if they have a cat sitting on top of them.

- nerf-pigmen-from-nether-portals

  - **default**: false
  - **description**: Removes AI from pigmen spawned via nether portals

- disable-player-crits

  - **default**: false
  - **description**: Instructs the server to disable critical hits in PvP, treating them as normal
    hits instead.

- disable-sprint-interruption-on-attack

  - **default**: false
  - **description**: Determines if the server will interrupt a sprinting player if they are
    attacked.

- shield-blocking-delay

  - **default**: 5
  - **description**: The number of ticks between a player activating their shield and it actually
    blocking damage.

- disable-end-credits

  - **default**: false
  - **description**: Instructs the server to never send the end game credits when leaving the end.

- disable-relative-projectile-velocity

  - **default**: false
  - **description**: Instructs the server to ignore shooter velocity when calculating the velocity
    of a fired arrow.

- disable-mob-spawner-spawn-egg-transformation

  - **default**: false
  - **description**: Whether to block players from changing the type of mob spawners with a spawn
    egg.

- fix-curing-zombie-villager-discount-exploit
  - **default**: true
  - **description**: Fixes the [exploit](https://bugs.mojang.com/browse/MC-181190) used to gain
    massive discounts by infecting and curing a zombie villager.

### pillager-patrols

- spawn-chance
  - **default**: 0.2
  - **description**: Modify the spawn changes for patrols.
- spawn-delay
  - per-player
    - **default**: false
    - **description**: Makes spawn-delay per player.
  - ticks
    - **default**: 12000
    - **description**: Delay in ticks between spawn chance.
- start
  - per-player
    - **default**: false
    - **description**: Makes days per player.
  - day
    - **default**: 5
    - **description**: Days between raid spawns.

### max-growth-height

- cactus

  - **default**: 3
  - **description**: Maximum height cactus blocks will naturally grow to.

- reeds

  - **default**: 3
  - **description**: Maximum height sugar cane/reeds blocks will naturally grow to.

- bamboo
  - **max**
    - **default**: 16
    - **description**: Maximum height bamboo will naturally grow to.
- **min**
  - **default**: 11
  - **description**: Minimum height bamboo will naturally grow to.

### fishing-time-range

- MinimumTicks
  - **default**: 100
  - **description**: The minimum number of RNG ticks needed to catch a fish.
- MaximumTicks
  - **default**: 600
  - **description**: The maximum number of RNG ticks before catching a fish.

### despawn-ranges

- monster
  - soft
    - **default**: 32
    - **description**: The number of blocks away from a player in which monsters will be randomly
      selected to be despawned.
  - hard
    - **default**: 128
    - **description**: The number of blocks away from a player in which monsters will be forcibly
      despawned.
- creature
  - soft
    - **default**: 32
    - **description**: The number of blocks away from a player in which creatures will be randomly
      selected to be despawned.
  - hard
    - **default**: 128
    - **description**: The number of blocks away from a player in which creatures will be forcibly
      despawned.
- ambient
  - soft
    - **default**: 32
    - **description**: The number of blocks away from a player in which ambient entities will be
      randomly selected to be despawned.
  - hard
    - **default**: 128
    - **description**: The number of blocks away from a player in which ambient entities will be
      forcibly despawned.
- underground_water_creature
  - soft
    - **default**: 32
    - **description**: The number of blocks away from a player in which underground water creatures
      will be randomly selected to be despawned.
  - hard
    - **default**: 128
    - **description**: The number of blocks away from a player in which underground water creatures
      will be forcibly despawned.
- water_creature
  - soft
    - **default**: 32
    - **description**: The number of blocks away from a player in which water creatures will be
      randomly selected to be despawned.
  - hard
    - **default**: 128
    - **description**: The number of blocks away from a player in which water creatures will be
      forcibly despawned.
- water_ambient

  - soft
    - **default**: 32
    - **description**: The number of blocks away from a player in which water ambient entities will
      be randomly selected to be despawned.
  - hard
    - **default**: 64
    - **description**: The number of blocks away from a player in which water ambient entities will
      be forcibly despawned.

- misc
  - soft
    - **default**: 32
    - **description**: The number of blocks away from a player in which misc entities will be
      randomly selected to be despawned.
  - hard
    - **default**: 128
    - **description**: The number of blocks away from a player in which misc entities will be
      forcibly despawned.

### frosted-ice

- enabled
  - **default**: true
  - **description**: Instructs the server to enable (and tick) frosted ice blocks.
- delay
  - min
    - **default**: 20
    - **description**: Minimum RNG value to apply frosted-ice effects at.
  - max
    - **default**: 40
    - **description**: Maximum RNG value to apply frosted-ice effects at.

### lootables

- auto-replenish
  - **default**: false
  - **description**: Instructs the server to automatically replenish lootable containers.
  - **note**: This feature is useful for long-term worlds in which players are not expected to
    constantly explore to generate new chunks.
- restrict-player-reloot
  - **default**: true
  - **description**: Prevents the same players from coming back and re-looting the same containers
    over and over.
- reset-seed-on-fill
  - **default**: true
  - **description**: Resets the loot seed each time the lootable is refilled, effectively
    randomizing the new loot items on each refill.
- max-refills
  - **default**: -1
  - **description**: Sets the maximum number of times a lootable may be refilled.
  - **note**: The default value will allow a lootable to refill an infinite number of times.
- refresh-min
  - **default**: 12h
  - **description**: The minimum amount of time that must pass before a lootable will be eligible to
    be refilled.
  - **note**: This field uses time-based values. 12s = 12 seconds, 3h = 3 hours, 4d = 4 days.
- refresh-max
  - **default**: 2d
  - **description**: The maximum amount of time that can pass before a lootable is refilled.
  - **note**: This field uses time-based values. 12s = 12 seconds, 3h = 3 hours, 4d = 4 days.

### alt-item-despawn-rate

- enabled
  - **default**: false
  - **description**: Determines if items will have different despawn rates.
- items
  - **default**: { COBBLESTONE: 300 } (a list of mappings)
  - **description**: Determines how long each respective item despawns in ticks. You can use item
    names from [the Material enum](https://papermc.io/javadocs/paper/1.18/org/bukkit/Material.html).

### spawn-limits

- monster
  - **default**: -1
  - **description**: The number of monsters that can spawn per world. This is identical to the value
    set in bukkit.yml, except that it can be configured per world. A value of -1 will use the value
    in bukkit.yml.
- creature
  - **default**: -1
  - **description**: The number of animals that can spawn per world. This is identical to the value
    set for _animals_ in bukkit.yml, except that it can be configured per world. A value of -1 will
    use the value in bukkit.yml.
- water_creature
  - **default**: -1
  - **description**: The number of water animals that can spawn per world. This is identical to the
    value set for _water-animals_ in bukkit.yml, except that it can be configured per world. A value
    of -1 will use the value in bukkit.yml.
- underground_water_creature
  - **default**: -1
  - **description**: The number of water animals that can spawn per world. This is identical to the
    value set for _water-underground-creature_ in bukkit.yml, except that it can be configured per
    world. A value of -1 will use the value in bukkit.yml.
- water_ambient
  - **default**: -1
  - **description**: The number of ambient water creatures that can spawn per world. This is
    identical to the value set for _water-ambient_ in bukkit.yml, except that it can be configured
    per world. A value of -1 will use the value in bukkit.yml.
- ambient
  - **default**: -1
  - **description**: The number of ambient creatures that can spawn per world. This is identical to
    the value set in bukkit.yml, except that it can be configured per world. A value of -1 will use
    the value in bukkit.yml.

### hopper

- cooldown-when-full
  - **default**: true
  - **description**: Instructs the server to apply a short cooldown when the hopper is full, instead
    of constantly trying to pull new items.
- disable-move-event
  - **default**: false
  - **description**: Completely disables the _InventoryMoveItemEvent_ for hoppers. Dramatically
    improves hopper performance but will break protection plugins and any others that depend on this
    event.
- ignore-occluding-blocks
  - **default**: false
  - **description**: Determines if hoppers will ignore containers inside occluding blocks, like a
    hopper minecart inside a sand block. Enabling this will improve performance for hoppers checking
    where to insert items.

### anti-xray

:::tip

More in-depth anti-xray documentation as well as recommended configuration for both engine modes can
be found in
[this guide by stonar96](https://gist.github.com/stonar96/ba18568bd91e5afd590e8038d14e245e).

:::

- enabled
  - **default**: false
  - **description**: Controls the on/off state for the Anti-Xray system.
- engine-mode
  - **default**: 1
  - **description**: Sets the Anti-Xray engine mode. Where 1 is to replace hidden blocks with stone
    and 2 is to replace all blocks with random block data.
- max-block-height
  - **default**: 64
  - **description**: Sets the maximum height at which anti-xray will attempt to hide ores. Only
    multiples of 16 are allowed. Other values will be rounded down to a multiple of 16.
- update-radius
  - **default**: 2
  - **description**: Controls the distance in blocks from air or water that hidden-blocks are hidden
    by the anti-xray engine. The maximum allowed value is 2.
- lava-obscures
  - **default**: false
  - **description**: Whether or not to obfuscate blocks touching lava.
- use-permission
  - **default**: false
  - **description**: Whether or not to allow players with the `paper.antixray.bypass` permission to
    bypass anti-xray. Checking this permission is disabled by default as legacy permission plugins
    may struggle with the number of checks made. This should only be used with modern permission
    plugins.
- hidden-blocks
  - **default**: [copper_ore, deepslate_copper_ore, gold_ore, deepslate_gold_ore, iron_ore,
    deepslate_iron_ore, coal_ore, deepslate_coal_ore, lapis_ore, deepslate_lapis_ore,
    mossy_cobblestone, obsidian, chest, diamond_ore, deepslate_diamond_ore, redstone_ore,
    deepslate_redstone_ore, clay, emerald_ore, deepslate_emerald_ore, ender_chest]
  - **description**: List of blocks to be hidden in engine mode
  - **note**: This list is using Mojang server names, _not_ bukkit names.
- replacement-blocks:
  - **default**: [stone, oak_planks]
  - **description**: List of blocks that should be replaced by hidden-blocks in engine mode 2.
  - **note**: This list is using Mojang server names, _not_ bukkit names.

### viewdistances

:::tip

`no-tick-view-distance` has been replaced by `simulation-distance` in 1.18!

| 1.17                                  | 1.18                                        |
| ------------------------------------- | ------------------------------------------- |
| `view-distance` (`server.proporties`) | `simulation-distance` (`server.properties`) |
| `no-tick-view-distance` (`paper.yml`) | `view-distance` (`server.proporties`)       |

:::

- no-tick-view-distance
- **default**: -1
- **description**: Sets the no-tick view distance. This is the total view distance of the player: a
  'normal' view distance of 5 and a no-tick view distance of 10 would mean 5 view distance is
  ticked, has mobs moving, etc., but the extra 5 (therefore 10 in total) is only visible. A value of
  -1 disables this feature.

### squid-spawn-height

- maximum
  - **default**: 0.0
  - **description**: The maximum height at which squids will spawn.
  - **note**: The default value defers to Minecraft's default setting, which as of 1.12 is the sea
    level of the world (usually Y: 64).

### generator-settings

- flat-bedrock
  - **default**: false
  - **description**: Instructs the server to generate bedrock as a single flat layer.

### should-remove-dragon

- **default**: false
- **description**: Sets whether to remove the dragon if it exists without a portal.

### wandering-trader

- spawn-minute-length
  - **default**: 1200
  - **description**: The length of the wandering trader spawn minute in ticks.
- spawn-day-length
  - **default**: 24000
  - **description**: Time between wandering trader spawn attempts in ticks.
- spawn-chance-failure-increment
  - **default**: 25
  - **description**: How much the spawn chance will be increased on every failed wandering trader
    spawn.
- spawn-chance-min
  - **default**: 25
  - **description**: The minimum chance that a wandering trader will be spawned.
- spawn-chance-max
  - **default**: 75
  - **description**: The maximum chance that a wandering trader will be spawned.

### fix-climbing-bypassing-cramming-rule

- **default**: false
- **description**: Sets whether climbing should bypass the entity cramming limit.

### fix-entity-position-desync

- **default**: true
- **description**: Fixes the issue in which an item's position is desynchronized between the client
  and the server.

### update-pathfinding-on-block-update

- **default**: true
- **description**: Controls whether the pathfinding of mobs is updated when a block is updated in
  the world. Disabling this option can improve the server performance significantly, while there is
  almost no noticeable effect on the game mechanics. This is recommended when there are lots of
  entities loaded, and you have automated farms or redstone clocks.

### ender-dragons-death-always-places-dragon-egg

- **default**: false
- **description**: Controls whether ender dragons should always drop dragon eggs on death.

### max-leash-distance

- **default**: 10.0
- **description**: Configure the maximum distance of a leash. If the distance to the leashed entity
  is greater, the leash will break.

### entity-per-chunk-save-limit

- experience_orb
  - **default**: -1
  - **description**: Limits the number of experience orbs that are saved/loaded per chunks. A value
    of -1 disables this limit
- snowball
  - **default**: -1
  - **description**: Limits the number of snowballs that are saved/loaded per chunk. A value of -1
    disables this limit
- ender_pearl
  - **default**: -1
  - **description**: Limits the number of ender pearls that are saved/loaded per chunk. A value of
    -1 disables this limit
- arrow
  - **default**: -1
  - **description**: Limits the number of arrows that are saved/loaded per chunk. A value of -1
    disables this limit

### unsupported-settings

- fix-invulnerable-end-crystal-exploit
  - **default**: true
  - **description**: If set to false, the creation of invulnerable end crystals will be allowed.
    Fixes [MC-108513](https://bugs.mojang.com/browse/MC-108513).

### portal-search-radius

- **default**: 128
- **description**:

### portal-create-radius

- **default**: 16
- **description**:

### door-breaking-difficulty

- zombie
  - **default**: ['HARD']
  - **description**: Takes a list of difficulties at which zombies are able to break doors
- vindicator
  - **default**: ['NORMAL', 'HARD']
  - **description**: Takes a list of difficulties at which vindicators are able to break doors

### mobs-can-always-pick-up-loot

- zombies
  - **default**: false
  - **description**: Controls whether zombies always pick up loot. If set to false, the probability
    that a zombie picks up items depends on the world's difficulty.
- skeletons
  - **default**: false
  - **description**: Controls whether skeletons always pick up loot. If set to false, the
    probability that a skeleton picks up items depends on the world's difficulty.

### map-item-frame-cursor-limit

- **default**: 128
- **description**: The number of cursors (markers) allowed per map. A large number of cursors may be
  used to lag clients.

### seed-based-feature-search

- **default**: true
- **description**: Whether the server should check if a chunk's biome (determined by world seed) can
  support the desired feature before loading it during feature searches. This dramatically reduces
  the number of chunks loaded during feature searches.
- **note**: This assumes the seed and generator have remained unchanged. If your seed or world
  generator has been changed, features will be located incorrectly.

### seed-based-feature-search-loads-chunks

- **default**: true
- **description**: When set to false, `seed-based-feature-search` will not load the target chunk.
  Instead, it will return the center of the chunk. The more precise location of the feature will be
  returned as the player loads the target chunk. While disabling this will increase performance, it
  may lead to incorrect feature locations being returned. This will impact both the `/locate`
  command, buried treasure maps, and any other game mechanic that relies on feature searches.

### allow-using-signs-inside-spawn-protection

- **default**: false
- **description**: Allows players to use signs while inside spawn protection.

### allow-player-cramming-damage

- **default**: false
- **description**: Allows players to take damage from cramming when colliding with more entities
  than set in the `maxEntityCramming` gamerule.

### anticheat

- obfuscation
  - items
    - hide-itemmeta
      - **default**: false
      - **description**: Controls whether unnecessary item information (such as enchantments, items
        in a shulker box/bundle, etc.) that can give cheat clients an advantage should be sent to
        other players' clients. This may break resource packs that rely on information such as
        enchantments, lore or item names when observing other players.
    - hide-durability
      - **default**: false
      - **description**: Controls whether durability information is sent to other players' clients.
        This may break resource packs that rely on durability values when observing other players.

### tick-rates

- sensor
  - `<entity-type>`
    - `<sensor-name>`: Sets the sensor tick rate of an entity. -1 uses Vanilla. See timings for the
      names. Might change between updates!
  - villager
    - secondarypoisensor
      - **default**: 40
      - **description**: Sets the tick rate of the `secondarypoisensor` sensor of Villager entities
- behavior
  - `<entity-type>`
    - `<behavior-name>`: Sets the behavior tick rate of an entity. -1 uses Vanilla. See timings for
      the names. Might change between updates!
  - villager
    - validatenearbypoi
      - **default**: -1
      - **description**: Sets the tick rate of the `validatenearbypoi` behavior. of Villager
        entities

### feature-seeds

- generate-random-seeds-for-all
  - **default**: false
  - **description**: Enables autofilling random seeds for all available features you haven't already
    set a seed to. Using this in a controlled environment is also a good way of receiving a full
    list of features you can set seeds for.
- `<feature-namespace>`: Sets the population seed for the specified feature. If set to -1, the
  Vanilla population seed stays unchanged and will not be overridden by the autofill option either.

### split-overstacked-loot

- **default**: true
- **description**: When set to false, loot tables will not attempt to split items with a stack size
  higher than the maximum into items of smaller stack sizes. This will prevent overstacked items
  from being lost or causing a chunk to become uninhabitable (due to players getting constantly
  kicked because of oversized packets) when a shulker box is broken in survival.

### monster-spawn-max-light-level

- **default**: -1
- **description**: When set to -1, the Vanilla default will be used (=0). Set to 15 or greater to
  revert to pre-1.18 behavior.
