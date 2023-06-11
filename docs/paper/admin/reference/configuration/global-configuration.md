---
slug: /reference/global-configuration
keywords:
  - paper-global.yml
  - paper.yml
  - paper.yml settings
---

# Paper Global Config

Global configuration options exposed by Paper will affect all worlds on a server, or the server
function itself. For per-world configuration, see the
[Per World Configuration Reference](world-configuration.md)

## chunk-loading

### autoconfig-send-distance

- **default**: `true`
- **description**: Whether to use the client's view distance for the chunk send distance of the
  server. This will exclusively change the radius of chunks sent to the client and will not affect
  server-side chunk loading or ticking.

### enable-frustum-priority

- **default**: `false`
- **description**: Whether to attempt to load chunks in front of the player before loading chunks to
  their sides or behind. Due to the client reacting poorly to receiving chunks out of order, this is
  disabled by default and not generally recommended for use.

### global-max-chunk-load-rate

- **default**: `-1.0`
- **description**: The maximum number of chunks loaded per second for the whole server. Takes
  priority over `player-max-chunk-load-rate`.

### global-max-chunk-send-rate

- **default**: `-1.0`
- **description**: The maximum number of chunks sent per second for the entire server. This may help
  with server-side peak bandwidth usage.

### global-max-concurrent-loads

- **default**: `500.0`
- **description**: The maximum number of chunk loads processed for the whole server one time. This
  will override `player-max-concurrent-loads` if exceeded.

### max-concurrent-sends

- **default**: `2`
- **description**: The maximum number of chunks that will be queued to send at any one time. Lower
  values will help alleviate server-side networking bottlenecks such as anti-xray or compression;
  however, it is unlikely to help users with a poor internet connection.

### min-load-radius

- **default**: `2`
- **description**: The radius of chunks around a player that are not throttled for chunk loading.
  The number of chunks affected is actually the configured value plus one, as this config controls
  the number of chunks the client will actually be able to render.

### player-max-chunk-load-rate

- **default**: `-1.0`
- **description**: The maximum number of chunks loaded per second per player.

### player-max-concurrent-loads

- **default**: `20.0`
- **description**: The maximum number of chunk loads processed per player at one time.

### target-player-chunk-send-rate

- **default**: `100.0`
- **description**: The maximum number of chunks sent to an individual player within one second.

## chunk-system

### gen-parallelism

- **default**: `default`
- **description**: Sets whether the server should use parallel chunk generation. The `default` value
  will be used as `true`. Possible options are `true`, `on` and `enable` to make the server use the
  system and `false`, `off` or `disabled` to disable.

### io-threads

- **default**: `-1`
- **description**: Sets the number of threads to be used for read and write operations with chunks.
  If any value below zero is set, only one thread will be used.

### worker-threads

- **default**: `-1`
- **description**: Sets the number of threads to be used for parallel chunk generation. If any value below
  zero is set, the server will determine the best number depending on the number of available CPU cores.
  This is capped at a quarter of available processors and can be less for systems with very few processors.
  _(Note: Hyper-Threaded threads **do not** count)_.

## collisions

### enable-player-collisions

- **default**: `true`
- **description**: Sets whether the server should allow players to collide with one another. This
  option can be broken by plugins interacting with the scoreboard. If you are having trouble with
  this option, try without plugins installed.

### send-full-pos-for-hard-colliding-entities

- **default**: `true`
- **description**: Collisions with boats and minecarts are often subject to client/server
  disagreement, which may cause glitchy behaviour for players. This setting attempts to mitigate
  this desync by sending precise locations for entities involved in collisions. Having this enabled
  will use more bandwidth; however, in the majority of cases, this is a worthy tradeoff.

## commands

### fix-target-selector-tag-completion

- **default**: `true`
- **description**: Workaround for a client bug preventing entity type tag suggestions from
  functioning in target selectors. Resolves [MC-235045](https://bugs.mojang.com/browse/MC-235045).

### suggest-player-names-when-null-tab-completions

- **default**: `true`
- **description**: Instructs the server to return a list of players when tab-completing when there
  are no other completions available.

### time-command-affects-all-worlds

- **default**: `false`
- **description**: Whether the `/time` command should act on all worlds or just the sender's current
  world.

## console

### enable-brigadier-completions

- **default**: `true`
- **description**: Enables Mojang's Brigadier (advanced) command completions in the server console.

### enable-brigadier-highlighting

- **default**: `true`
- **description**: Enables Mojang's Brigadier highlighting in the server console.

### has-all-permissions

- **default**: `false`
- **description**: Whether the console command sender has all permissions.

## item-validation

### display-name

- **default**: `8192`
- **description**: The maximum length of an item's display name in characters.

### lore-line

- **default**: `8192`
- **description**: The maximum length of a lore line in characters.

### resolve-selectors-in-books

- **default**: `false`
- **description** Whether to resolve selectors in books. With this enabled, players given creative
  mode will be able to crash the server in yet another way.

### book

#### author

- **default**: `8192`
- **description**: The maximum length of a book's author in characters.

#### page

- **default**: `16384`
- **description**: The maximum length of a book's page in characters.

#### title

- **default**: `8192`
- **description**: The maximum length of a book's title in characters.

### book-size

#### page-max

- **default**: `2560`
- **description**: The max number of bytes a single page in a book can contribute to the allowed
  byte total for a book.

#### total-multiplier

- **default**: `0.98`
- **description**: Each page has this multiple of bytes from the last page as its contribution to
  the allowed byte total for a book (with the first page being having a multiplier of `1.0`).

## logging

### deobfuscate-stacktraces

- **default**: `true`
- **description**: Whether to remap Spigot mapped stacktraces to Mojang mappings in logging. Has no
  impact on Mojang mapped servers.

### log-player-ip-addresses

- **default**: `true`
- **description**: Whether player IP addresses should be logged by the server. This does not impact
  the ability of plugins to log the IP addresses of players.

### use-rgb-for-named-text-colors

- **default**: `true`
- **description**: Whether named ANSI colors should be logged with RGB codes.

## messages

### no-permission

- **default**:
  `<red>I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error.`
- **description**: Default message sent to players when they have insufficient permissions for an
  action. Plugins may override this for their commands.

### use-display-name-in-quit-message

- **default**: `false`
- **description**: Whether the server should use the player's display name (set by plugins) or
  actual name in quit messages.

### kick

#### authentication-servers-down

- **default**: `<lang:multiplayer.disconnect.authservers_down>`
- **description**: Message sent to players when Mojang's authentication servers are unreachable.

#### connection-throttle

- **default**: `Connection throttled! Please wait before reconnecting.`
- **default**: Message sent to players when they are unable to join due to having their connection
  throttled. Throttle configurable in `bukkit.yml`.

#### flying-player

- **default**: `<lang:multiplayer.disconnect.flying>`
- **description**: Message sent to players who are detected flying.

#### flying-vehicle

- **default**: `<lang:multiplayer.disconnect.flying>`
- **description**: Message sent to players who are detected riding a flying vehicle.

## misc

### fix-entity-position-desync

- **default**: `true`
- **description**: Causes the server to lose the same precision that the client does for entities
  preventing desync. Fixes [MC-4](https://bugs.mojang.com/browse/MC-4).

### lag-compensate-block-breaking

- **default**: `true`
- **description**: Whether the server should use time or TPS to determine block break duration. The
  client assumes the server is always running at 20 TPS, causing disagreement when a block is broken
  during server lag. This setting prevents this desync.

### load-permissions-yml-before-plugins

- **default**: `true`
- **description**: Loads bukkit's permission.yml file before plugins, allowing them to check
  information set there immediately on enable.

### max-joins-per-tick

- **default**: `3`
- **description**: Sets the maximum amount of players that may join the server in a single tick. If
  more players join, they will be postponed until later ticks to join but not kicked. This is not
  related to connection throttling found in `bukkit.yml`.

### region-file-cache-size

- **default**: `256`
- **description**: The maximum size of the region file cache.

### use-alternative-luck-formula

- **default**: `false`
- **description**: Use an
  [alternative luck formula](https://gist.github.com/aikar/40281f6c73ec9b6fef7588e6461e1ba9)
  allowing luck to be applied to items that have no quality defined. Makes major changes to fishing
  formulas.

### use-dimension-type-for-custom-spawners

- **default**: `false`
- **description**: Whether phantoms, wandering traders, etc. should be able to spawn in custom
  overworlds. Defaults to false in order to match vanilla behavior.

## packet-limiter

### all-packets

#### action

- **default**: `KICK`
- **description**: The action to take once the limit has been violated. Possible values are `DROP`
  which will ignore packets over the limit, and `KICK` which will kick players for exceeding the
  limit.

#### interval

- **default**: `7.0`
- **description**: The interval, in seconds, for which `max-packet-rate` should apply.

#### max-packet-rate

- **default**: `500.0`
- **description**: The number of packets allowed per player within the interval.

### kick-message

- **default**: `<red><lang:disconnect.exceeded_packet_rate>`
- **description**: The message players are kicked with for sending too many packets.

### overrides

- **default**: `ServerboundPlaceRecipePacket`, `DROP`, `4.0`, `5.0`
- **description**: Override the global configuration for any individual named packet. You can find
the names of every packet as they are displayed on timings. For more experienced users, packets
named here use Mojang mappings regardless of the server.
<!-- For more information about overrides, see the [Packet Limiter Guide]... -->

## player-auto-save

### max-per-tick

- **default**: `-1`
- **description**: How many players should be saved at most in a single tick. A value of `-1` will
  set a recommended value based on `player-auto-save.rate` of either `10` or `20`.

### rate

- **default**: `-1`
- **description**: How often player data should be saved in ticks. A value of `-1` will use
  `ticks-per.autosave` in `bukkit.yml`.

## proxies

### proxy-protocol

- **default**: `false`
- **description**: Whether the server should process
  [PROXY Protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) messages. This is
  completely unrelated to Velocity or BungeeCord. Only enable this if you are using HAProxy or
  similar.

### bungee-cord

#### online-mode

- **default**: `true`
- **descriptions**: Instructs the server how to handle player UUIDs and data when behind BungeeCord.
  Always set to match your proxy's online-mode setting.

### velocity

#### enabled

- **default**: `false`
- **description**: Whether the server should accept Velocity Modern Forwarding.

#### online-mode

- **default**: `false`
- **description**: Instructs the server how to handle player UUIDs and data when behind Velocity.
  Always set to match your proxy's online-mode setting.

#### secret

- **default**: ` `
- **description**: The secret string that is shared by your Velocity proxy and this server. This
  needs to match your proxy's secret as defined in the `forwarding.secret` file.

## scoreboards

### save-empty-scoreboard-teams

- **default**: `false`
- **description**: Some scoreboard plugins leave hundreds of empty scoreboard teams around,
  dramatically slowing down login times. This sets whether the server should remove those empty
  teams automatically.

### track-plugin-scoreboards

- **default**: `false`
- **description**: Whether the server should track plugin scoreboards with only dummy objectives.
  This is a breaking change; however, it provides a much more sensible default value. Enabling this
  with plugins using many scoreboards will incur a performance degradation.

## spam-limiter

### incoming-packet-threshold

- **default**: `300`
- **description**: Sets the threshold at which the server will consider incoming packets spam and
  ignore them.

### recipe-spam-increment

- **default**: `1`
- **description**: The number that the recipe spam counter increases by when a player presses a
  recipe.

### recipe-spam-limit

- **default**: `20`
- **description**: The number that the recipe spam counter can reach until the server kicks the
  player for spam.

### tab-spam-increment

- **default**: `1`
- **description**: The number that the internal tab spam counter increases by when a player presses
  tab in the chat window.

### tab-spam-limit

- **default**: `500`
- **description**: The number that the internal tab spam counter can reach until the server kicks
  the player for spam.

## timings

### enabled

- **default**: `true`
- **description**: Controls the global enable state of Timings.

### hidden-config-entries

- **default**:
  `[database, settings.bungeecord-address, settings.velocity-support.secret, proxies.velocity.secret]`
- **description**: Configuration entries to hide in Timings reports.

### history-interval

- **default**: `300`
- **description**: The interval in seconds between individual points in the Timings report.

### history-length

- **default**: `3600`
- **description**: The total amount of data to keep for a single report. This value is validated
  server-side. Large reports will be rejected.

### server-name

- **default**: `Unknown Server`
- **description**: Instructs Timings on what to put in for the server name.

### server-name-privacy

- **default**: `false`
- **description**: Instructs Timings to hide server name information in reports.

### url

- **default**: `https://timings.aikar.co`
- **description**: Specifies the URL of the [Timings Viewer](https://github.com/aikar/timings)
  server where Timings reports are sent.

### verbose

- **default**: `true`
- **description**: Instructs Timings to provide more specific information in its reports. For
  example, specific entity types causing lag rather than just "entities".

## unsupported-settings

### allow-headless-pistons

- **default**: `false`
- **description**: Whether the server should allow the creation of headless pistons. These are often
  used to break permanent blocks.

### allow-permanent-block-break-exploits

- **default**: `false`
- **description**: Whether unbreakable blocks can be broken with vanilla exploits. This includes
  bedrock, end portal frames, end portal blocks, and more.

### allow-piston-duplication

- **default**: `false`
- **description**: Whether to allow duplication of TNT, carpets, and rails. This does not control
  sand duplication.

### perform-username-validation

- **default**: `true`
- **default**: Whether the server should validate usernames. While this may allow users with special
  characters in their name to join, it can also cause issues with commands and plugins.

## watchdog

### early-warning-delay

- **default**: `10000`
- **description**: The number of milliseconds before the watchdog thread starts printing thread
  dumps after the server starts hanging.

### early-warning-every

- **default**: `5000`
- **description**: The interval in milliseconds between printed thread dumps while the server is
  hanging.
