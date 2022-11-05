---
slug: /reference/world-configuration
keywords:
  - paper-world-defaults.yml
  - paper-world.yml
  - world/paper-world.yml
  - paper.yml
  - paper.yml world-settings
---

# Paper Per World Configuration

Configuration options in `paper-world-defaults.yml` are configurable on a per-world basis. For more
information, see the [Configuration Guide](../how-to/configuration.md) For global configuration, see
the [Paper Global Configuration Reference](global-configuration.md)

## anticheat

### anti-xray

:::tip

Recommended configuration for both `engine-mode` `1` and `2` can be found in the
[Configuring Anti-Xray](../how-to/anti-xray.md) guide.

:::

#### enabled

- **default**: `false`
- **description**: Controls the on/off state for the Anti-Xray system.

#### engine-mode

- **default**: `1`
- **description**: Sets the Anti-Xray engine mode. `1` replaces specified blocks (`hidden-blocks`)
  with other "fake" blocks, `stone` (`deepslate` at y < 0), `netherrack`, or `end_stone` based on
  the dimension. In contrast, `2` will replace both `hidden-blocks` and `replacement-blocks` with
  randomly generated `hidden-blocks`.

#### max-block-height

- **default**: `64`
- **description**: Sets the maximum height (`y` coordinate, starting from the bottom of the world)
  to which anti-xray will operate. Only integer multiples of 16 are accepted. All other values will
  be rounded down. The [Minecraft Wiki page about Ore](https://minecraft.fandom.com/wiki/Ore) may be
  helpful in determining the best value for you.

#### update-radius

- **default**: `2`
- **description**: Radius for block updates which will be sent containing real block data when the
  client interacts with a block. Only values `0`, `1`, and `2` are accepted. Values smaller than `0`
  will be rounded up to `0`, while values larger than `2` will be rounded down to `2`. `0` is only
  designed for testing purposes. Do not use it in production.

#### lava-obscures

- **default**: `false`
- **description**: Whether to obfuscate blocks touching lava. Does not work well with non-stone-like
  ore textures. This is because lava, while being mostly opaque, does not cover blocks fully at the
  surface.

#### use-permission

- **default**: `false`
- **description**: Whether to allow players with the `paper.antixray.bypass` permission to bypass
  anti-xray. Checking this permission is disabled by default as legacy permission plugins may
  struggle with the number of checks made. This should only be used with modern permission plugins.

#### hidden-blocks

- **default**:
  `[copper_ore, deepslate_copper_ore, gold_ore, deepslate_gold_ore, iron_ore, deepslate_iron_ore, coal_ore, deepslate_coal_ore, lapis_ore, deepslate_lapis_ore, mossy_cobblestone, obsidian, chest, diamond_ore, deepslate_diamond_ore, redstone_ore, deepslate_redstone_ore, clay, emerald_ore, deepslate_emerald_ore, ender_chest]`
- **description**: With `engine-mode: 1`, these blocks will be replaced by `stone` (`deepslate` at y

    < 0), `netherrack`, or `end_stone`, based on the dimension. All types of air blocks are ignored on
this list.

  With `engine-mode: 2`, these blocks will be randomly placed in the world, replacing both
  `hidden-blocks` and `replacement-blocks`. Tile entities, such as chests or spawners, are not
  allowed on this list. Individual blocks may be added multiple times, increasing their chance of
  being placed. The default block states are placed.

#### replacement-blocks:

- **default**: [stone, oak_planks, deepslate]
- **description**: With `engine-mode: 1`, replacement blocks are not used. Changing this list will
  have no effect.

  With `engine-mode: 2`, both `replacement-blocks` and `hidden-blocks` are randomly replaced by
  `hidden-blocks.` While tile entities are ignored in the `hidden-blocks` list, they may be added to
  the `replacement-blocks` list. All types of air blocks are ignored here.

### obfuscation

#### items

##### hide-durability

- **default**: `false`
- **description**: Controls whether durability information is sent to other players' clients. This
  may break resource packs that rely on durability values when observing other players.

##### hide-itemmeta

- **default**: `false`
- **description**: Controls whether unnecessary item information (such as enchantments, items in a
  shulker box/bundle, etc.) that can give cheat clients an advantage should be sent to other
  players' clients. This may break resource packs that rely on information such as enchantments,
  lore or item names when observing other players.

## chunks

### auto-save-interval

- **default**: `-1`
- **description**: Configures the world saving interval in ticks. Overrides `ticks-per.autosave` in
  `bukkit.yml` for this world. A value of `-1` will use the global `ticks-per.autosave` in
  `bukkit.yml`.

### delay-chunk-unloads-by

- **default**: `10s`
- **description**: Delays chunk unloads by the specified time.

### entity-per-chunk-save-limit

- **default**: `{experience_orb: -1...}`
- **description**: Limits the number of any type of entity that will be saved/loaded per chunk. A
  value of `-1` disables the limit for a specific entity. Any entity may be added to the list,
  beyond the enumerated defaults.

### fixed-chunk-inhabited-time

- **default**: `-1`
- **description**: If `0` or greater, set the chunk inhabited time to a fixed number. Fixed in this
  instance means static or unchanging. This is **not** fixing a bug. The timer is increased when
  chunks are kept loaded because of player activity.

### max-auto-save-chunks-per-tick

- **default**: `24`
- **description**: The maximum number of chunks the auto-save system will save in a single tick.

### prevent-moving-into-unloaded-chunks

- **default**: `false`
- **description**: Sets whether the server will prevent players from moving into unloaded chunks or
  not.

## collisions

### allow-player-cramming-damage

- **default**: `false`
- **description**: Allows players to take damage from cramming when colliding with more entities
  than set in the `maxEntityCramming` gamerule.

### allow-vehicle-collisions

- **default**: `false`
- **description**: Whether vehicles should also be able to collide while `only-players-collide` is
  enabled.

### fix-climbing-bypassing-cramming-rule

- **default**: `false`
- **description**: Sets whether climbing should bypass the entity cramming limit(`maxEntityCramming` game rule). If set to `true`, climbing entities will also be counted toward the entity cramming limit so that they can take suffocation damage.

### max-entity-collisions

- **default**: `8`
- **description**: Instructs the server to stop processing collisions after this value is reached.

### only-players-collide

- **default**: `false`
- **description**: Only calculate collisions if a player is one of the two entities colliding.

## entities

### armor-stands

#### do-collision-entity-lookups

- **default**: `true`
- **description**: Instructs armor stand entities to do entity collision checks.

#### tick

- **default**: `true`
- **description**: Disable to prevent armor stands from ticking. Can improve performance with many
  armor stands.

### behaviour

#### baby-zombie-movement-modifier

- **default**: `0.5`
- **description**: Modifies the speed that baby zombies move at, where `0.5` is 50% faster than the
  mob base speed, and `-0.4` would be 40% slower.

#### disable-chest-cat-detection

- **default**: `false`
- **description**: Allows you to open chests even if they have a cat sitting on top of them.

#### disable-creeper-lingering-effect

- **default**: false
- **description**: Disables creepers randomly leaving behind a lingering area effect cloud.

#### disable-player-crits

- **default**: `false`
- **description**: Instructs the server to disable critical hits in PvP, treating them as normal
  hits instead.

#### door-breaking-difficulty

- **default**: `[HARD, NORMAL, EASY, PEACEFUL]`
- **description**: Takes a list of difficulties at which each entity will attempt to break doors.

#### ender-dragons-death-always-places-dragon-egg

- **default**: `false`
- **description**: Controls whether ender dragons should always drop dragon eggs on death.

#### experience-merge-max-value

- **default**: `-1`
- **description**: Instructs the server to put a maximum value on experience orbs, preventing them
  all from merging down into 1 single orb. A value of `-1` instructs the server to use no max value,
  allowing them to merge down into a single orb. This is especially noticeable when defeating boss
  monsters.

#### mobs-can-always-pick-up-loot

- **default**: `false`
- **description**: Controls whether zombies or skeletons (each configurable individually) will
  always be able to pick up loot. If set to false, the probability that a zombie picks up items
  depends on the world's difficulty (vanilla behavior).

#### nerf-pigmen-from-nether-portals

- **default**: `false`
- **description**: Removes AI from pigmen spawned via nether portals

#### parrots-are-unaffected-by-player-movement

- **default**: `false`
- **description**: Makes parrots "sticky" so they do not fall off a player's shoulder when they
  move. Use crouch to shake them off.

#### phantoms-do-not-spawn-on-creative-players

- **default**: `true`
- **description**: Disables spawning of phantoms on players in creative mode

#### phantoms-only-attack-insomniacs

- **default**: `true`
- **description**: Prevents phantoms from attacking players who have slept

#### piglins-guard-chests

- **default**: `true`
- **description**: If piglins should attempt to guard chests when angered.

#### pillager-patrols

##### disable

- **default**: `false`
- **description**: Disables Pillager patrols and associated AI.

##### spawn-chance

- **default**: `0.2`
- **description**: Modify the spawn changes for patrols.

##### spawn-delay

###### per-player

- **default**: `false`
- **description**: Makes spawn-delay per player.

###### ticks

- **default**: `12000`
- **description**: Delay in ticks between spawn chance.

##### start

###### per-player

- **default**: `false`
- **description**: Makes days per player.

###### day

- **default**: `5`
- **description**: Days between raid spawns.

#### should-remove-dragon

- **default**: `false`
- **description**: Sets whether to remove the dragon if it exists without a portal.

#### spawner-nerfed-mobs-should-jump

- **default**: `false`
- **description**: Determines if spawner nerfed mobs should attempt to float (jump) in water.

#### zombie-villager-infection-chance

- **default**: `-1.0`
- **description**: Sets the change for villager conversion to zombie villager. Set to -1.0 for
  default behavior based on game difficulty. Set to 0.0 to always have villagers die when killed by
  zombies. Set to 100.0 to always convert villagers to zombie villagers.

#### zombies-target-turtle-eggs

- **default**: `true`
- **description**: Sets whether zombies and zombified piglins should target turtle eggs. Setting
  this to false may help with performance, as they won't search for nearby eggs.

### entities-target-with-follow-range

- **default**: `false`
- **description**: Sets whether the server should use follow range when targeting entities

### mob-effects

#### immune-to-wither-effect

- **default**: `true`
- **description**: If the specified entity should be immune to the wither effect.

#### spiders-immune-to-poison-effect

- **default**: `true`
- **description**: If spiders should be immune to poison.

#### undead-immune-to-certain-effects

- **default**: `true`
- **description**: If undead mobs should be immune to regeneration and poison.

### spawning

#### all-chunks-are-slime-chunks

- **default**: `false`
- **description**: Instructs the server to treat all chunks like slime chunks, allowing them to
  spawn in any chunk. This may actually decrease your chances of running into a Slime as they now
  have a much larger potential spawn area.

#### alt-item-despawn-rate

##### enabled

- **default**: `false`
- **description**: Determines if items will have different despawn rates.

##### items

- **default**: `{ cobblestone: 300 }` (a list of item to ticks mappings)
- **description**: Determines how long each respective item despawns in ticks. The item ids are the
  same as those used in the /give command. They can be viewed by enabling advanced item tooltips
  in-game by pressing **F3 + H**; the item id will appear at the bottom of the tooltip that appears
  when you hover over an item.

#### count-all-mobs-for-spawning

- **default**: `false`
- **description**: Determines whether spawner mobs and other misc mobs are counted towards the
  global mob limit.

#### creative-arrow-despawn-rate

- **default**: `-1`
- **description**: The rate, in ticks, at which arrows shot from players in creative mode are
  despawned.

#### despawn-ranges

##### soft

- **default**: `32`
- **description**: The number of blocks away from a player in which each entity type (set
  individually) will be randomly selected to be despawned. Takes effect both horizontally and
  vertically.

##### hard

- **default**: `128`
- **description**: The number of blocks away from a player in which each entity type (set
  individually) will be forcibly despawned. Takes effect both horizontally and vertically.

#### disable-mob-spawner-spawn-egg-transformation

- **default**: `false`
- **description**: Whether to block players from changing the type of mob spawners with a spawn egg.

#### duplicate-uuid

##### mode

- **default**: `saferegen`

- **description**: Specifies the method the server uses to resolve entities with duplicate UUIDs.
  This can be one of the following values:
  - **`saferegen`**: Regenerate a UUID for the entity, or delete it if they are close.
  - **`delete`**: Delete the entity.
  - **`silent`**: Does nothing, not printing logs.
  - **`warn`**: Does nothing, printing logs.

##### safe-regen-delete-range

- **default**: `32`
- **description**: If multiple entities with duplicate UUIDs are within this many blocks, saferegen
  will delete all but 1 of them.

#### filter-nbt-data-from-spawn-eggs-and-related

- **default**: `true`
- **description**: Instructs the server to remove certain NBT data from spawn eggs, falling blocks,
  and other often abused items in creative mode.
- **note**: Some adventure maps may require this to be turned off to function correctly, but we do
  not recommend turning it off on a public server.

#### iron-golems-can-spawn-in-air

- **default**: `false`
- **description**: Sets whether iron golems can spawn in the air. Iron farms may break depending on
  this setting

#### monster-spawn-max-light-level

- **default**: `-1`
- **description**: When set to `-1`, the Vanilla default will be used (=0). Set to `15` or greater
  to revert to pre-1.18 behavior.

#### non-player-arrow-despawn-rate

- **default**: `default`
- **description**: The rate, in ticks, at which arrows shot from non-player entities are despawned.
  The default value instructs the server to use the same default arrow despawn rate from spigot.yml
  that is used for all arrows.

#### per-player-mob-spawns

- **default**: `true`
- **description**: Determines whether the mob limit (in bukkit.yml) is counted per player or for the
  entire server. Enabling this setting results in roughly the same number of mobs, but with a more
  even distribution that prevents one player from using the entire mob cap and provides a more
  single-player like experience.

#### scan-for-legacy-ender-dragon

- **default**: `true`
- **description**: Determines if the server attempts to start the ender dragon fight. Setting this
  to `false` will make the ender dragon not spawn in the end, even with a new world.

#### skeleton-horse-thunder-spawn-chance

- **default**: `0.01`
- **description**: Sets the chance that a "Skeleton Trap" (4 skeleton horsemen) will spawn in a
  thunderstorm.

#### slime-spawn-height

##### slime-chunk

###### maximum

- **default**: `40`
- **description**: Sets the maximum Y position for natural Slime spawn in Slime Chunks.

##### swamp-biome

###### maximum

- **default**: `70`
- **description**: Sets the maximum Y position for natural Slime spawn in Swamp Biomes.

###### minimum

- **default**: `50`
- **description**: Sets the minimum Y position for natural Slime spawn in Swamp Biomes.

#### spawn-limits

- **default**: `-1`
- **description**: The constant used to determine how many of each entity type (set individually)
  will be naturally spawned per world. This is identical to the value set in bukkit.yml, except that
  it can be configured per world. A value of `-1` will use the value in bukkit.yml.

#### wandering-trader

##### spawn-chance-failure-increment

- **default**: `25`
- **description**: How much the spawn chance will be increased on every failed wandering trader
  spawn.

##### spawn-chance-max

- **default**: `75`
- **description**: The maximum chance that a wandering trader will be spawned.

##### spawn-chance-min

- **default**: `25`
- **description**: The minimum chance that a wandering trader will be spawned.

##### spawn-day-length

- **default**: `24000`
- **description**: Time between wandering trader spawn attempts in ticks.

##### spawn-minute-length

- **default**: `1200`
- **description**: The length of the wandering trader spawn minute in ticks.

#### wateranimal-spawn-height

##### maximum

- **default**: `default`
- **description**: The maximum height at which water animals will spawn.
- **note**: The default value defers to Minecraft's default setting, which as of 1.12 is the sea
  level of the world (usually Y: 64).

##### minimum

- **default**: `default`
- **description**: The minimum height at which water animals will spawn.
- **note**: The default value defers to Minecraft's default setting, which as of 1.12 is the sea
  level of the world (usually Y: 64).

## environment

### disable-explosion-knockback

- **default**: `false`
- **description**: Instructs the server to completely block any knockback that occurs as a result of
  an explosion.

### disable-ice-and-snow

- **default**: `false`
- **description**: Disables ice and snow formation. This also causes cauldrons to no longer be
  filled by rain or snow.

### disable-teleportation-suffocation-check

- **default**: `false`
- **description**: Disables the suffocation check the server performs before teleporting a player.
- **note**: While useful to keep your players out of walls, leaving this feature on may allow
  players to teleport through solid materials by logging out in specific locations.

### disable-thunder

- **default**: `false`
- **description**: Disables thunderstorms.

### frosted-ice

#### delay

##### max

- **default**: `40`
- **description**: Maximum RNG value to apply frosted-ice effects at.

##### min

- **default**: `20`
- **description**: Minimum RNG value to apply frosted-ice effects at.

#### enabled

- **default**: `true`
- **description**: Instructs the server to enable (and tick) frosted ice blocks.

### generate-flat-bedrock

- **default**: `false`
- **description**: Instructs the server to generate bedrock as a single flat layer.

### nether-ceiling-void-damage-height

- **default**: `disabled`
- **description**: Sets the level above which players in the nether will take void damage. This is a
  vanilla-friendly way to restrict players from using the nether ceiling as a buildable area.
  Setting to `disabled` disables this feature.

### optimize-explosions

- **default**: `false`
- **description**: Instructs the server to cache entity lookups during an explosion, rather than
  recalculating throughout the process. This speeds up explosions significantly.

### portal-create-radius

- **default**: `16`
- **description**: The maximum range the server will try to create a portal around when generating a
  new portal.

### portal-search-radius

- **default**: `128`
- **description**: The maximum range the server will use to look for an existing nether portal. If
  it can't find one in that range, it will generate a new one.

### portal-search-vanilla-dimension-scaling

- **default**: `true`
- **description**: Whether to apply vanilla dimension scaling to `portal-search-radius`.

### treasure-maps

#### enabled

- **default**: `true`
- **description**: If villagers should trade treasure maps and treasure maps from chests should lead
  to a feature.

#### find-already-discovered

- **description**: Vanilla mechanics normally find the first undiscovered location, which may lead
  to structures that were not fully looted, and can also fail with a world border set. The options
  below allow configuring the default behavior of maps obtained in different ways.

##### loot-tables

- **default**: `default`
- **description**: Overrides the loot table-configured check for undiscovered structures. `default`
  allows loot tables to individually determine if the map should allow discovered locations in its
  search. All vanilla loot tables default to skipping discovered locations so changing this to
  `false` would override that behavior and force them to search discovered locations.

##### villager-trade

- **default**: `false`
- **description**: Instructs the server to target the first treasure location found for maps
  obtained via trading with villagers.

### water-over-lava-flow-speed

- **default**: `5`
- **description**: Sets the speed at which water flows while over lava.

## feature-seeds

### generate-random-seeds-for-all

- **default**: `false`
- **description**: Enables autofilling random seeds for all available features you haven't already
  set a seed to. Using this in a controlled environment is also a good way of receiving a full list
  of features you can set seeds for.

### `<feature-namespace>`

- **description**: Sets the population seed for the specified feature. If set to `-1`, the Vanilla
  population seed stays unchanged and will not be overridden by the autofill option.

## fishing-time-range

### maximum

- **default**: `600`
- **description**: The maximum number of RNG ticks before catching a fish.

### minimum

- **default**: `100`
- **description**: The minimum number of RNG ticks needed to catch a fish.

## fixes

### disable-unloaded-chunk-enderpearl-exploit

- **default**: `true`
- **description**: Prevent enderpearls from storing the thrower when in an unloaded chunk.

### falling-block-height-nerf

- **default**: `disabled`
- **description**: The height at which falling blocks will be removed from the server. A value of `disabled` will disable this feature.

### fix-curing-zombie-villager-discount-exploit

- **default**: true
- **description**: Fixes the [exploit](https://bugs.mojang.com/browse/MC-181190) used to gain
  massive discounts by infecting and curing a zombie villager.

### fix-items-merging-through-walls

- **default**: `false`
- **description**: Whether items should be prevented from merging through walls. Enabling this will
  incur a performance degradation. This is only necessary when `merge-radius.item` (spigot.yml) is
  large enough to merge items through walls.

### prevent-tnt-from-moving-in-water

- **default**: `false`
- **description**: Instructs the server to keep Primed TNT entities from moving in flowing water.

### split-overstacked-loot

- **default**: `true`
- **description**: When set to false, loot tables will not attempt to split items with a stack size
  higher than the maximum into items of smaller stack sizes. This will prevent overstacked items
  from being lost or causing a chunk to become uninhabitable (due to players getting constantly
  kicked because of oversized packets) when a shulker box is broken in survival.

### tnt-entity-height-nerf

- **default**: `disabled`
- **description**: The height at which Primed TNT entities will be removed from the server. A value of `disabled` will disable this feature.

## hopper

### cooldown-when-full

- **default**: `true`
- **description**: Instructs the server to apply a short cooldown when the hopper is full, instead
  of constantly trying to pull new items.

### disable-move-event

- **default**: `false`
- **description**: Completely disables the `InventoryMoveItemEvent` for hoppers. Dramatically
  improves hopper performance but will break protection plugins and any others that depend on this
  event.

### ignore-occluding-blocks

- **default**: `false`
- **description**: Determines if hoppers will ignore containers inside occluding blocks, like a
  hopper minecart inside a sand block. Enabling this will improve performance for hoppers checking
  where to insert items.

## lootables

### auto-replenish

- **default**: `false`
- **description**: Instructs the server to automatically replenish lootable containers. This feature
  is useful for long-term worlds in which players are not expected to constantly explore to generate
  new chunks.

### max-refills

- **default**: `-1`
- **description**: Sets the maximum number of times a lootable may be refilled.
- **note**: The default value will allow a lootable to refill an infinite number of times.

### refresh-max

- **default**: `2d`
- **description**: The maximum amount of time that can pass before a lootable is refilled.

### refresh-min

- **default**: `12h`
- **description**: The minimum amount of time that must pass before a lootable will be eligible to
  be refilled.

### reset-seed-on-fill

- **default**: `true`
- **description**: Resets the loot seed each time the lootable is refilled, effectively randomizing
  the new loot items on each refill.

### restrict-player-reloot

- **default**: `true`
- **description**: Prevents the same players from coming back and re-looting the same containers
  over and over.

## maps

### item-frame-cursor-limit

- **default**: `128`
- **description**: The number of cursors (markers) allowed per map. A large number of cursors may be
  used to lag clients.

### item-frame-cursor-update-interval

- **default**: `10`
- **description**: The interval in ticks at which cursors on maps in item frames are updated.
  Setting this to a number less than 1 will disable updates altogether.

## max-growth-height

### bamboo

#### max

- **default**: `16`
- **description**: Maximum height bamboo will naturally grow to.

#### min

- **default**: `11`
- **description**: Minimum height bamboo will naturally grow to.

### cactus

- **default**: `3`
- **description**: Maximum height cactus blocks will naturally grow to.

### reeds

- **default**: `3`
- **description**: Maximum height sugar cane/reeds blocks will naturally grow to.

## misc

### disable-end-credits

- **default**: `false`
- **description**: Instructs the server to never send the end game credits when leaving the end.

### disable-relative-projectile-velocity

- **default**: `false`
- **description**: Instructs the server to ignore shooter velocity when calculating the velocity of
  a fired arrow.

### disable-sprint-interruption-on-attack

- **default**: `false`
- **description**: Determines if the server will interrupt a sprinting player if they are attacked.

### light-queue-size

- **default**: `20`
- **description**: Sets how large the queue of light updates off the main thread for each world
  should be. Vanilla uses 5, but this causes issues especially with plugins such as WorldEdit.

### max-leash-distance

- **default**: `10.0`
- **description**: Configure the maximum distance of a leash. If the distance to the leashed entity
  is greater, the leash will break.

### redstone-implementation

:::caution

Alternative implementations are ultimately experimental, and as such, could be removed between
updates or even permanently if issues are found.

:::

- **default**: `vanilla`
- **description**: Specifies the redstone implementation that the server uses. Alternative
  implementations can greatly reduce the lag caused by redstone dust by optimizing power
  calculations and reducing the number of block and shape updates emitted. The following
  implementations are available:
  - **vanilla**: The Vanilla redstone implementation.
  - **eigencraft**: The Eigencraft redstone implementation by theosib.
  - **alternate-current**: The Alternate Current redstone implementation by Space Walker.
- **note:** Both the Eigencraft and Alternate Current implementations change the behavior of
  redstone dust. You can read about how behavior is changed in each implementation's respective
  documention:
  - Eigencraft: No official documentation available. However,
    [theosib's comments](https://bugs.mojang.com/browse/MC-81098?focusedCommentId=420777#comment-420777)
    on the Mojira bug tracker give an overview of the Eigencraft implementation.
  - [Alternate Current](https://github.com/SpaceWalkerRS/alternate-current/blob/main/README.md)

### shield-blocking-delay

- **default**: `5`
- **description**: The number of ticks between a player activating their shield and it actually
  blocking damage.

### show-sign-click-command-failure-msgs-to-player

- **default**: `false`
- **description**: Whether commands executed by sign click should show failure messages to players.

### update-pathfinding-on-block-update

- **default**: `true`
- **description**: Controls whether the pathfinding of mobs is updated when a block is updated in
  the world. Disabling this option can improve the server performance significantly, while there is
  almost no noticeable effect on the game mechanics. This is recommended when there are lots of
  entities loaded, and you have automated farms or redstone clocks.

## scoreboards

### allow-non-player-entities-on-scoreboards

- **default**: `false`
- **description**: Instructs the server to treat non-player entities as if they are never on a
  scoreboard when calculating collisions. Enabling this may increase the amount of time the server
  spends calculating entity collisions.

### use-vanilla-world-scoreboard-name-coloring

- **default**: `false`
- **description**: Instructs the server to use the vanilla scoreboard for player nickname coloring.
  Useful when playing on adventure maps made for the vanilla server and client.

## spawn

### allow-using-signs-inside-spawn-protection

- **default**: `false`
- **description**: Allows players to use signs while inside spawn protection.

### keep-spawn-loaded

- **default**: `true`
- **description**: Instructs the server to keep the spawn chunks loaded at all times.

### keep-spawn-loaded-range

- **default**: `10`
- **description**: The range in chunks around spawn to keep loaded.

## tick-rates

### behavior

#### villager

##### validatenearbypoi

- **default**: `-1`
- **description**: Sets the tick rate of the `validatenearbypoi` behavior. of Villager entities

#### `<entity-type>`

##### `<behavior-name>`

- **description**: Sets the behavior tick rate of an entity. `-1` uses Vanilla. See timings for the
  names. Might change between updates!

### container-update

- **default**: `1`
- **description**: The rate, in ticks, at which the server updates containers and inventories.

### grass-spread

- **default**: `1`
- **description**: Sets the delay, in ticks, at which the server attempts to spread grass. Higher
  values will result in a slower spread.

### mob-spawner

- **default**: 1
- **description**: How often mob spawners should tick to calculate available spawn areas and spawn
  new entities into the world. A value of -1 will disable all spawners.

### sensor

#### villager

##### secondarypoisensor

- **default**: `40`
- **description**: Sets the tick rate of the `secondarypoisensor` sensor of Villager entities

#### `<entity-type>`

##### `<sensor-name>`

- **description**: Sets the sensor tick rate of an entity. `-1` uses Vanilla. See timings for
  thenames. Might change between updates!

### unsupported-settings

#### fix-invulnerable-end-crystal-exploit

- **default**: `true`
- **description**: If set to false, the creation of invulnerable end crystals will be allowed. Fixes
  [MC-108513](https://bugs.mojang.com/browse/MC-108513).
