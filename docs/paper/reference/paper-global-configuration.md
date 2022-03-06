---
slug: /paper/reference/paper-global-configuration
keywords:
  - paper.yml
  - paper.yml settings
---

# Paper Global Config

Global configuration options exposed by Paper will affect all worlds on a server, or the server
function itself. For per-world configuration, see the
[Per World Configuration Reference](paper-per-world-configuration.md)

### use-display-name-in-quit-message

- **default**: false
- **description**: Sets whether the server should use the player's display name in quit messages.

### verbose

- **default**: false
- **description**: Sets whether the server should dump all configuration values to the server log on
  startup.

### load-permissions-yml-before-plugins

- **default**: true
- **description**: Loads bukkit's permission.yml file before plugins, allowing them to check
  permissions immediately on enable.

### bungee-online-mode

- **default**: true
- **description**: Instructs the server how to handle player UUIDs and data when behind bungee. Set
  to match your proxy's online-mode setting.

### console-has-all-permissions

- **default**: false
- **description**: Sets whether console command senders have all permissions

### region-file-cache-size

- **default**: 256
- **description**: Sets the maximum size of the region file cache.

### incoming-packet-spam-threshold

- **default**: 300
- **description**: Sets the threshold at which the server will consider incoming packets as spam and
  ignore them.

### max-joins-per-tick

- **default**: 3
- **description**: Sets the maximum amount of players that may join the server in a single tick. If
  more players join, they will be postponed until later ticks to join.

### track-plugin-scoreboards

- **default**: false
- **description**: Whether the server should track plugin scoreboards with only dummy objectives.
  This is a breaking change; however, it provides a much more sensible default value. Enabling this
  with plugins using many scoreboards will incur a performance degradation.

### suggest-player-names-when-null-tab-completions

- **default**: true
- **description**: Instructs the server to return a list of players when tab-completing if the
  plugin has no tab completions of its own.

### use-alternative-luck-formula

- **default**: false
- **description**: Use an alternative
  [luck formula by Aikar](https://gist.github.com/aikar/40281f6c73ec9b6fef7588e6461e1ba9), allowing
  luck to be applied to items that have no quality defined. Makes major changes to fishing formulas.

### chunk-tasks-per-tick

- **default**: 1000
- **description**: How many chunk tasks may be done in the middle of ticks for all worlds. This is
  helpful to rendering and chunk generation.

### enable-player-collisions

- **default**: true
- **description**: Sets whether the server should allow players to collide with one another.
- **warning**: This setting can be broken by plugins interacting with the scoreboard, double-check
  plugins when troubleshooting this value.

### player-auto-save-rate

- **default**: -1
- **description**: Set how often players should be saved. A value of -1 means it will pick a
  recommended value for you.

### max-player-auto-save-per-tick

- **default**: -1
- **description**: How many players should be saved at most in a single tick. A value of -1 means it
  will pick a recommended value for you.

### save-empty-scoreboard-teams

- **default**: false
- **description**: Some scoreboard plugins leave hundreds of empty scoreboard teams around,
  dramatically slowing down login times. This sets whether the server should remove those empty
  teams automatically.

### lag-compensate-block-breaking

- **default**: true
- **description**: Whether the server should use time or TPS to determine block break duration. The
  client assumes the server is always running at 20 TPS, causing disagreement when a block is broken
  during server lag. This setting prevents this desync.

### send-full-pos-for-hard-colliding-entities

- **default**: true
- **description**: Collisions with boats and minecarts are often subject to client/server
  disagreement, which may cause glitchy behaviour for players. This setting attempts to mitigate
  this desync by sending precise locations for entities involved in collisions. Having this enabled
  will use more bandwidth; however, in the majority of cases, this is a worthy tradeoff.

### velocity-support

- enabled

  - **default**: false
  - **description**: Set this to true if this server is behind a
    [Velocity](https://www.velocitypowered.com/) proxy. If this is true, do not enable the
    bungeecord setting in spigot.yml.

- online-mode

  - **default**: true
  - **description**: Instructs the server how to handle player UUIDs and data when behind velocity.
    Set to match your proxy's online-mode setting.

- secret
  - **default**: `` (empty string)
  - **description**: The secret string that is shared by your Velocity proxy and this server. This
    needs to match your proxy's `forwarding-secret` setting.

### unsupported-settings

- allow-perm-block-break-exploits

  - **default**: false
  - **description**: Sets whether unbreakable blocks can be broken with vanilla exploits. This
    includes bedrock, end portal frames, end portal blocks, and more.

- allow-piston-duplication

  - **default**: false
  - **description**: If set to true, will allow duplication of TNT, carpets and rails. Introduced in
    1.15.2, build #358.

- allow-headless-pistons

  - **default**: false
  - **description**: If set to true, pistons may in some cases become headless. This is often used
    to break permanent blocks.

- perform-username-validation
  - **default**: true
  - **description**: If set to false, usernames will not be validated. While this may allow users
    with special characters in their name to join, it can also cause issues with commands and
    plugins.

### watchdog

- early-warning-every

  - **default**: 5000
  - **description**: The interval in milliseconds between printed thread dumps while the server is
    hanging.

- early-warning-delay
  - **default**: 10000
  - **description**: The number of milliseconds before the watchdog thread starts printing thread
    dumps after the server starts hanging.

### spam-limiter

- tab-spam-increment

  - **default**: 1
  - **description**: The number that the internal tab spam counter increases by when a player
    presses tab in the chat window.

- tab-spam-limit

  - **default**: 500
  - **description**: The number that the internal tab spam counter can reach until the server kicks
    the player for spam.

- recipe-spam-increment

  - **default**: 1
  - **description**: The number that the recipe spam counter increases by when a player presses a
    recipe.

- recipe-spam-limit
  - **default**: 20
  - **description**: The number that the recipe spam counter can reach until the server kicks the
    player for spam.

### book-size

- page-max

  - **default**: 2560
  - **description**: The max number of bytes a single page in a book can contribute to the allowed
    byte total for a book.

- total-multiplier
  - **default**: 0.98
  - **description**: Each page has this multiple of bytes from the last page as its contribution to
    the allowed byte total for a book (with the first page being having a multiplier of 1.0).

### async-chunks

- threads
  - **default**: -1
  - **description**: The number of threads the server should use for world saving and loading. The
    default `-1` indicates that Paper will utilize half your system's threads for chunk loading
    unless otherwise specified. There is also a maximum default of 4 threads used for saving and
    loading chunks. This can be overridden by adding `-Dpaper.maxChunkThreads=[number of threads]`
    to your JVM flags (and of course replacing `[number of threads]` with the number of threads you
    desire).

### messages

- no-permission

  - **default**: '&cI''m sorry, but you do not have permission to perform this command. Please
    contact the server administrators if you believe that this is in error.'
  - **description**: The message the server sends to requesters with insufficient permissions.

- kick

  - authentication-servers-down
    - **default**: '' (empty string)
    - **note**: The default value instructs the server to send the vanilla translatable kick
      message.
    - **description**: Message to kick a player with when they are disconnected because the Mojang
      authentication servers are down.
  - connection-throttle

    - **default**: Connection throttled! Please wait before reconnecting.
    - **description**: Message to use when kicking a player when their connection is throttled.

  - flying-player
    - **default**: Flying is not enabled on this server
    - **description**: Message to use when kicking a player for flying.
  - flying-vehicle
    - **default**: Flying is not enabled on this server
    - **description**: Message to use when kicking a player's vehicle for flying.

## timings

- enabled

  - **default**: true
  - **description**: Controls the global enable state of the Timings platform.

- verbose

  - **default**: true
  - **description**: Instructs Timings to provide more specific information in its reports. For
    example, specific entity types causing lag rather than just "entities".

- url

  - **default**: `https://timings.aikar.co/`
  - **description**: Specifies the URL of the [Timings Viewer](https://github.com/aikar/timings)
    server where Timings reports should be uploaded to.

- server-name-privacy

  - **default**: false
  - **description**: Instructs Timings to hide server name information in reports.

- hidden-config-entries

  - **default**: { database, settings.bungeecord-addresses, settings.velocity-support.secret }
  - **description**: Configuration entries to hide in Timings reports.

- history-interval

  - **default**: 300
  - **description**: The interval in seconds between individual points in the Timings report.

- history-length

  - **default**: 3600
  - **description**: The total amount of data to keep for a single report.
  - **warning**: This value is validated server-side, massive reports will be rejected by the report
    site.

- server-name
  - **default**: Unknown Server
  - **description**: Instructs timings on what to put in for the server name.

### console

- enable-brigadier-highlighting

  - **default**: true
  - **description**: Enables Mojang's Brigadier highlighting in the server console.

- enable-brigadier-completions
  - **default**: true
  - **description**: Enables Mojang's Brigadier command completions in the server console.

### item-validation

- display-name

  - **default**: 8192
  - **description**: Overrides Spigot's limit on item display name length.

- loc-name

  - **default**: 8192
  - **description**: Overrides Spigot's limit on translatable item name length.

- lore-title

  - **default**: 8192
  - **description**: Overrides Spigot's limit on lore title length.

- book
  - title
    - **default**: 8192
    - **description**: Overrides Spigot's limit on book title length.
  - author
    - **default**: 8192
    - **description**: Overrides Spigot's limit on book author length.
  - page
    - **default**: 16384
    - **description**: Overrides Spigot's limit on individual book page length.

### chunk-loading

- min-load-radius

  - **default**: 2
  - **description**: The radius of chunks around a player that are not throttled for chunk loading.
    Effectively, this radius will be unaffected by the `chunk-loading.max-concurrent-sends` setting.
    The number of chunks affected is actually the configured value plus one, as this config controls
    the chunks the client will actually be able to render. A value of -1 will disable this feature.

- max-concurrent-sends

  - **default**: 2
  - **description**: The maximum number of chunks that will be queued to send at any one time. Lower
    values will help alleviate server-side networking bottlenecks such as anti-xray or compression;
    however, it is unlikely to help users with a poor internet connection. A value of -1 will not
    disable this limit. Use a large number instead.

- autoconfig-send-distance

  - **default**: true
  - **description**: Whether to use the client's view distance for the chunk send distance of the
    server. This will exclusively change the radius of chunks sent to the client and will not affect
    ticking or non-ticking view distance. Assuming no plugin has explicitly set the send distance
    and the client's view distance is less than the server's send distance, the client's view
    distance will be used.

- target-player-chunk-send-rate

  - **default**: 100.0
  - **description**: The maximum number of chunks ever sent to an individual player within one
    second. A value of -1 will disable this limit.

- global-max-chunk-send-rate

  - **default**: -1
  - **description**: The maximum number of chunks sent per second for the entire server. This may
    help with server-side peak bandwidth usage. A value of -1 will disable this limit.

- enable-frustum-priority

  - **default**: false
  - **description**: Whether to attempt to load chunks in front of the player before loading chunks
    to their sides or behind. Due to the client reacting poorly to receiving chunks out of order,
    this is disabled by default.

- global-max-chunk-load-rate

  - **default**: -1.0
  - **description**: The maximum number of chunks loaded per second for the whole server. A value of
    -1 will disable this limit.

- player-max-concurrent-loads

  - **default**: 4.0
  - **description**: The maximum number of chunk loads processed per player at one time. A value of
    -1 will not disable this. Use a large number instead.

- global-max-concurrent-loads
  - **default**: 500.0
  - **description**: The maximum number of chunk loads processed for the whole server one time. This
    will override `player-max-concurrent-loads` if exceeded. A value of -1 will disable this limit.

### packet-limiter

- kick-message

  - **default**: &cSent too many packets
    - **description**: The message players are kicked with for sending too many packets.

- limits
  - all
  - **description**: This section applies to all incoming packets. You may not define an action in
    this section, it will always kick the player if the limit is violated.
  - interval
    - **default**: 7.0
    - **description**: The interval, in seconds, for which `max-packet-rate` should apply.
  - max-packet-rate
    - **default**: 500.0
    - **description**: The number of any packet allowed per player within the interval.
  - PacketPlayInAutoRecipe:
    - **description**: This section applies specific limits for each packet, based on the packets
      name as shown in timings, or its class name for more advanced users. PacketPlayInAutoRecipe is
      used by default because this packet is very expensive to process, and may allow malicious
      actors to crash your server if unmitigated.
    - interval
      - **default**: 4.0
      - **description**: The interval, in seconds, for which `max-packet-rate` should apply for this
        packet.
    - max-packet-rate
      - **default**: 5.0
      - **description**: The number of packets allowed within the interval before action is
        executed.
    - action
      - **default**: DROP
      - **description**: The action to take once the limit has been violated. Possible values are
        `DROP` which will ignore packets over the limit, and `KICK` which will kick players for
        exceeding the limit.

### log-player-ip-addresses

- **default**: true
- **description**: When set to false, player IP addresses in the server logs will be replaced with
  `<ip address withheld>`. This doesn't affect log messages generated by plugins.
