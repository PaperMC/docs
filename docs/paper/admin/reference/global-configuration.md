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

## Types

The following types will be used throughout the configuration file:

| Type      | Description                |
| --------- | -------------------------- |
| `boolean` | A `true` or `false` value. |
| `etc.`    | other types...             |

## Configuration Reference

### async-chunks

| Name    | Type    | Default | Description                                                                                                                                                                                                                                                                                                                                                                                     |
| ------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| threads | integer | `-1`    | The number of threads the server should use for world saving and chunk loading. The default (`-1`) indicates that Paper will utilize half of your system's threads for chunk loading unless otherwise specified. There is also a maximum default of 4 threads used for saving and loading chunks. This can be overridden by adding `-Dpaper.maxChunkThreads=[number]` to your startup arguments |

### chunk-loading

| Name                          | Type    | Default | Description                                                                                                                                                                                                                                            |
| ----------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| autoconfig-send-distance      | boolean | `true`  | Whether to use the client's view distance for the chunk send distance of the server. This will exclusively change the radius of chunks sent to the client and will not affect server-side chunk loading or ticking.                                    |
| enable-frustum-priority       | boolean | `false` | Whether to attempt to load chunks in front of the player before loading chunks to their sides or behind. Due to the client reacting poorly to receiving chunks out of order, this is disabled by default and not generally recommended for use.        |
| global-max-chunk-load-rate    | double  | `-1.0`  | The maximum number of chunks loaded per second for the whole server. Takes priority over `player-max-chunk-load-rate`.                                                                                                                                 |
| global-max-chunk-send-rate    | double  | `-1.0`  | The maximum number of chunks sent per second for the entire server. This may help with server-side peak bandwidth usage.                                                                                                                               |
| global-max-concurrent-loads   | double  | `500.0` | The maximum number of chunk loads processed for the whole server one time. This will override `player-max-concurrent-loads` if exceeded.                                                                                                               |
| max-concurrent-sends          | integer | `2`     | The maximum number of chunks that will be queued to send at any one time. Lower values will help alleviate server-side networking bottlenecks such as anti-xray or compression; however, it is unlikely to help users with a poor internet connection. |
| min-load-radius               | integer | `2`     | The radius of chunks around a player that are not throttled for chunk loading. The number of chunks affected is actually the configured value plus one, as this config controls the number of chunks the client will actually be able to render.       |
| player-max-chunk-load-rate    | double  | `-1.0`  | The maximum number of chunks loaded per second per player.                                                                                                                                                                                             |
| player-max-concurrent-loads   | double  | `20.0`  | The maximum number of chunk loads processed per player at one time.                                                                                                                                                                                    |
| target-player-chunk-send-rate | double  | `100.0` | The maximum number of chunks ever sent to an individual player within one second.                                                                                                                                                                      |

### collisions

| Name                                      | Type    | Default | Description                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable-player-collisions                  | boolean | `true`  | Sets whether the server should allow players to collide with one another. This option can be broken by plugins interacting with the scoreboard. If you are having trouble with this option, try without plugins installed.                                                                                                                                     |
| send-full-pos-for-hard-colliding-entities | boolean | `true`  | Collisions with boats and minecarts are often subject to client/server disagreement, which may cause glitchy behaviour for players. This setting attempts to mitigate this desync by sending precise locations for entities involved in collisions. Having this enabled will use more bandwidth; however, in the majority of cases, this is a worthy tradeoff. |

### commands

| Name                                           | Type    | Default | Description                                                                                                                                                             |
| ---------------------------------------------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fix-target-selector-tag-completion             | boolean | `true`  | Workaround for a client bug preventing entity type tag suggestions from functioning in target selectors. Resolves [MC-235045](https://bugs.mojang.com/browse/MC-235045) |
| suggest-player-names-when-null-tab-completions | boolean | `true`  | Instructs the server to return a list of players when tab-completing when there are no other completions available.                                                     |
| time-command-affects-all-worlds                | boolean | `false` | Whether the `/time` command should act on all worlds or just the sender's current world.                                                                                |

### console

| Name                          | Type    | Default | Description                                                                      |
| ----------------------------- | ------- | ------- | -------------------------------------------------------------------------------- |
| enable-brigadier-completion   | boolean | `true`  | Enables Mojang's Brigadier (advanced) command completions in the server console. |
| enable-brigadier-highlighting | boolean | `true`  | Enables Mojang's Brigadier highlighting in the server console.                   |
| has-all-permissions           | boolean | `false` | Whether the console command sender should have all permissions.                  |

### item-validation

| Name                       | Type                                             | Default | Description                                                                                                                                |
| -------------------------- | ------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| display-name               | integer                                          | 8192    | The maximum length of an item's display name in characters.                                                                                |
| lore-line                  | The maximum length of a lore line in characters. |
| resolve-selectors-in-books | boolean                                          | `false` | Whether to resolve selectors in books. With this enabled, players given creative mode will be able to crash the server in yet another way. |

#### book

| Name   | Type    | Default | Description                                          |
| ------ | ------- | ------- | ---------------------------------------------------- |
| author | integer | `8192`  | The maximum length of a book's author in characters. |
| pages  | integer | `16384` | The maximum length of a book's page in characters.   |
| title  | integer | `8192`  | The maximum length of a book's title in characters.  |

#### book-size

| Name             | Type    | Default | Description                                                                                                                                                              |
| ---------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| page-max         | integer | 2560    | The max number of bytes a single page in a book can contribute to the allowed byte total for a book.                                                                     |
| total-multiplier | double  | 0.98    | Each page has this multiple of bytes from the last page as its contribution to the allowed byte total for a book (with the first page being having a multiplier of 1.0). |

### logging

| Name                          | Type    | Default                                                    | Description                                                                                                                                 |
| ----------------------------- | ------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| deobfuscate-stacktraces       | boolean | `true`                                                     | Whether to deobfuscate stack traces in the server logs.                                                                                     |
| log-player-ip-addresses       | boolean | `true`                                                     | Whether player IP addresses should be logged by the server. This does not impact the ability of plugins to log the IP addresses of players. |
| use-rgb-for-named-text-colors | `true`  | Whether named ANSI colors should be logged with RGB codes. |

### messages

| Name                              | Type        | Default                                                                                                                                                  | Description                                                                                                    |
| --------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| no-permission                     | MiniMessage | `<red>I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error.` | Default message sent to players when they have insufficient permissions for an action.                         |
| use-display-name-in-quit-messages | boolean     | `false`                                                                                                                                                  | Sets whether the server should use the player's display name (set by plugins) or actual name in quit messages. |

#### kick

| Name                        | Type        | Default                                                  | Description                                                                                    |
| --------------------------- | ----------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| authentication-servers-down | MiniMessage | `<lang:multiplayer.disconnect.authservers_down>`         | Message sent to players when Mojang's authentication servers are down.                         |
| connection-throttle         | MiniMessage | `Connection throttled! Please wait before reconnecting.` | Message sent to players when they are unable to join due to having their connection throttled. |
| flying-player               | MiniMessage | `<lang:multiplayer.disconnect.flying>`                   | Message sent to players who are detected flying.                                               |
| flying-vehicle              | MiniMessage | `<lang.multiplayer.disconnect.flying>`                    | Message sent to players who are detected riding a flying vehicle.                              |

### misc

| Name                                   | Type    | Default | Description                                                                                                                                                                                                                               |
| -------------------------------------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fix-entity-position-desync             | boolean | `true`  | Causes the server to lose the same percision that the client does for entities preventing desync. Fixes [MC-4](https://bugs.mojang.com/browse/MC-4)                                                                                       |
| lag-compens-block-breaking             | boolean | `true`  | Whether the server should use time or TPS to determine block break duration. The client assumes the server is always running at 20 TPS, causing disagreement when a block is broken during server lag. This setting prevents this desync. |
| load-permissions-yml-before-plugins    | boolean | `true`  | Loads bukkit's permission.yml file before plugins, allowing them to check information set there immediately on enable.                                                                                                                    |
| max-joins-per-tick                     | integer | `3`     | Sets the maximum amount of players that may join the server in a single tick. If more players join, they will be postponed until later ticks to join but not kicked.                                                                      |
| region-file-cache-size                 | integer | `256`   | The maximum size of the region file cache.                                                                                                                                                                                                |
| use-alternative-luck-formula           | boolean | `false` | Use an [alternative luck formula](https://gist.github.com/aikar/40281f6c73ec9b6fef7588e6461e1ba9) allowing luck to be applied to items that have no quality defined. Makes major changes to fishing formulas.                             |
| use-dimension-type-for-custom-spawners | boolean | `false` | Whether phantoms, wandering traders, etc. should be able to spawn in custom overworlds. Defaults to false in order to match vanilla behavior.                                                                                             |

### packet-limiter

| Name         | Type                     | Default                                                                               | Description                                                         |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| all-packets  | PacketLimit              | `action: KICK, interval: 7.0, max-packet-rate: 500.0`                                 | Limiter applied to all incoming packets sent by players.            |
| kick-message | MiniMessage              | `<lang:disconnect.exceeded_packet_rate>`                                              | Message sent to players when they are kicked by the packet limiter. |
| overrides    | Map<Packet, PacketLimit> | `{ServerboundPlaceRecipePacket: {action: DROP, interval: 4.0, max-packet-rate: 5.0}}` | Override the PacketLimit for a specific packet.                     |

<!-- TODO types -->

### player-auto-save

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| max-per-tick | integer | `-1` | How many players should be saved at most in a single tick. A value of `-1` will set a recommended value based on `player-auto-save-rate` of either `10` or `20`. |
| rate | integer | `-1` | How often player data should be saved in ticks. A value of `-1` will use `ticks-per.autosave` in `bukkit.yml`. |

### proxies

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| proxy-protocol | boolean | `false` | Whether the server should use the proxy protocol to communicate with the proxy. | Whether Paper should receive HAProxy PROXY messages ([PROXY Protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)). This setting is unrelated to BungeeCord IP Forwarding, BungeeGuard, or Velocity Modern Forwarding. Leave this setting off unless you are using HAProxy or another proxy implementing PROXY Protocol. |

#### bungee-cord
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| online-mode | boolean | `true` | Instructs the server how to handle player UUIDs and data when behind bungee. Set to match your proxy's online-mode setting. |

#### velocity
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| enabled | boolean | `false` | Whether the server should accept Velocity Modern Forwarding |
| online-mode | boolean | `false` | Instructs the server how to handle player UUIDs and data when behind velocity. Set to match your proxy's online-mode setting. |
| secret | string | `` | The secret string that is shared by your Velocity proxy and this server. This needs to match your proxy's `forwarding-secret` setting. |

### scoreboards
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| save-empty-scoreboard-teams | boolean | `false` | Some scoreboard plugins leave hundreds of empty scoreboard teams around, dramatically slowing down login times. This sets whether the server should remove those empty teams automatically. |
| track-plugin-scoreboards | boolean | `false` | Whether the server should track plugin scoreboards with only dummy objectives. This is a breaking change; however, it provides a much more sensible default value. Enabling this with plugins using many scoreboards will incur a performance degradation.|


### spam-limiter

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| incoming-packet-threshold | integer | `300` | Sets the threshold at which the server will consider incoming packets as spam and ignore them. |
| recipe-spam-increment | integer | `1` | The number that the recipe spam counter increases by when a player presses a recipe. |
| recipe-spawm-limit | integer | `20` | The number that the recipe spam counter can reach until the server kicks the player for spam. |
| tab-spam-increment | integer | `1` | The number that the internal tab spam counter increases by when a player presses tab in the chat window. |
| tab-spam-limit | integer | `500` | The number that the internal tab spam counter can reach until the server kicks the player for spam. |


### timings
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| enabled | boolean | `true` | Controls the global enable state of the Timings platform. |
| hidden-config-entries | `List<String>` | `[database, settings.bungeecord-address, settings.velocity-support.secret, proxies.velocity.secret]` | Configuration entries to hide in Timings reports. |
| history-interval | integer | `300` | The interval in seconds between individual points in the Timings report. |
| history-length | integer | `3600` | The total amount of data to keep for a single report. This value is validated server-side. Large reports will be rejected. |
| server-name | string | `Unknown Server` | Instructs Timings on what to put in for the server name. |
| server-name-privacy | boolean | `false` | Instructs Timings to hide server name information in reports. |
| url | string | `https://timings.aikar.co` | Specifies the URL of the [Timings Viewer](https://github.com/aikar/timings) server where Timings reports should be uploaded to. |
| verbose | boolean | `true` | Instructs Timings to provide more specific information in its reports. For example, specific entity types causing lag rather than just "entities". |

### unsupported-settings
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| allow-headless-pistons | boolean | `false` | Whether the server should allow the creation of headless pistons. These are often used to break permanent blocks. |
| allow-permanent-block-break-exploits | boolean | `false` | Whether unbreakable blocks can be broken with vanilla exploits. This includes bedrock, end portal frames, end portal blocks, and more. |
| allow-piston-duplication | boolean | `false` | Whether to allow duplication of TNT, carpets, and rails. This does **not** control sand duplication. |
| perform-username-validation | boolean | `true` | Whether the server should validate usernames. While this may allow users with special characters in their name to join, it can also cause issues with commands and plugins. |

### watchdog
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| early-warning-delay | integer | `10000` | The number of milliseconds before the watchdog thread starts printing thread dumps after the server starts hanging. |
| early-warning-every | integer | `5000` | The interval in milliseconds between printed thread dumps while the server is hanging. 

