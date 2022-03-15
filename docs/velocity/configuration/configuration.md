---
slug: /velocity/configuration
---

# Configuring Velocity

Velocity is designed to be easy to configure and set up. Every Velocity file is stored in
`velocity.toml`, located in the directory where you started the proxy. Velocity uses the
[TOML](https://github.com/toml-lang/toml) file format, as it is easy to understand and avoids
pitfalls of YAML and other configuration formats common in the community.

An up-to-date version of the default configuration can be found on
[GitHub](https://github.com/PaperMC/Velocity/blob/dev/3.0.0/proxy/src/main/resources/default-velocity.toml).

## Data types

There are a few "special" data types in the Velocity configuration.

### Chat

Chat messages may be provided in legacy color code format or in JSON format.

RGB support (using the `&#rrggbb` format) is available and JSON messages are deserialized for
Minecraft 1.16.

### Address

An address is a pairing of an IP address or hostname, and a port, separated by a colon (`:`). For
instance, `127.0.0.1:25577` and `server01.example.com:25565` are valid addresses.

## Root section

These settings mostly cover the basic, most essential settings of the proxy.

| Setting Name                  | Type    | Description                                                                                                                                                                                                      |
| ----------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config-version`              | String  | This is the current config version used by Velocity. You should not alter this setting.                                                                                                                          |
| `bind`                        | Address | This tells the proxy to accept connections on a specific IP. By default, Velocity will listen for connections on all IP addresses on the computer on port 25577.                                                 |
| `motd`                        | Chat    | This allows you to change the message shown to players when they add your server to their server list. You can use legacy Minecraft color codes or JSON chat.                                                    |
| `show-max-players`            | Integer | This allows you to customize the number of "maximum" players in the player's server list. Note that Velocity doesn't have a maximum number of players it supports.                                               |
| `player-info-forwarding-mode` | Enum    | See [Configuring player information forwarding](../getting-started/forwarding.md) for more information.                                                                                                          |
| `forwarding-secret`           | String  | This setting is used as a secret to ensure that player info forwarded by Velocity comes from your proxy and not from someone pretending to run Velocity. See the "Player info forwarding" section for more info. |
| `announce-forge`              | Boolean | This setting determines whether Velocity should present itself as a Forge/FML-compatible server. By default, this is disabled.                                                                                   |
| `kick-existing-players`       | Boolean | Allows restoring the vanilla behavior of kicking users on the proxy if they try to reconnect (e.g. lost internet connection briefly).                                                                            |
| `ping-passthrough`            | String  | Allows forwarding nothing (the default), the `MODS` (for Forge), the `DESCRIPTION`, or everything (`ALL`) from the `try` list (or forced host server connection order).                                          |

## `server` section

| Setting Name  | Type    | Description                                                                                                                |
| ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| A server name | Address | This makes the proxy aware of a server that it can connect to.                                                             |
| `try`         | Array   | This specifies what servers Velocity should try to connect to upon player login and when a player is kicked from a server. |

## `forced-hosts` section

| Setting Name | Type     | Description                                                                                                                                       |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| A host name  | Hostname | This configures the proxy to create a forced host for the specified hostname. An array of servers to try for the specified hostname is the value. |

## `advanced` section

| Setting name                               | Type    | Description                                                                                                                                                                                             |
| ------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `compression-threshold`                    | Integer | This is the minimum size (in bytes) that a packet must be before the proxy compresses it. Minecraft uses 256 bytes by default.                                                                          |
| `compression-level`                        | Integer | This setting indicates what `zlib` compression level the proxy should use to compress packets. The default value uses the default zlib level.                                                           |
| `login-ratelimit`                          | Integer | This setting determines the minimum amount of time (in milliseconds) that must pass before a connection from the same IP address will be accepted by the proxy. A value of `0` disables the rate limit. |
| `connection-timeout`                       | Integer | This setting determines how long the proxy will wait to connect to a server before timing out.                                                                                                          |
| `read-timeout`                             | Integer | This setting determines how long the proxy will wait to receive data from the server before timing out.                                                                                                 |
| `proxy-protocol`                           | Boolean | This setting determines whether or not Velocity should receive HAProxy PROXY messages. If you don't use HAProxy, leave this setting off.                                                                |
| `tcp-fast-open`                            | Boolean | This setting allows you to enable TCP Fast Open support in Velocity. Your proxy must run on Linux kernel >=4.14 for this setting to apply.                                                              |
| `bungee-plugin-message-channel`            | Boolean | This setting allows you to enable or disable support for the BungeeCord plugin messaging channel.                                                                                                       |
| `show-ping-requests`                       | Boolean | This setting allows you to log ping requests sent by clients to the proxy.                                                                                                                              |
| `announce-proxy-commands`                  | Boolean | This setting allows you to enable or disable explicitly sending proxy commands to the client (for Minecraft 1.13+ tab completion).                                                                      |
| `failover-on-unexpected-server-disconnect` | Boolean | This setting allows you to determine if the proxy should failover or disconnect the user in the event of an unclean disconnect.                                                                         |
| `log-command-executions`                   | Boolean | Determines whether or not the proxy should log all commands run by the user.                                                                                                                            |

## `query` section

| Setting name   | Type    | Description                                                                                                  |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `enabled`      | Boolean | Whether or not Velocity should reply to Minecraft query protocol requests. You can usually leave this false. |
| `port`         | Number  | Specifies which port that Velocity should listen on for GameSpy 4 (Minecraft query protocol) requests.       |
| `map`          | String  | Specifies the map name to be shown to clients.                                                               |
| `show-plugins` | Boolean | Whether or not Velocity plugins are included in the query responses.                                         |

## `metrics` section

| Setting name  | Type    | Description                                                                                         |
| ------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `enabled`     | Boolean | Whether or not Velocity should send metrics to bStats.                                              |
| `id`          | UUID    | A randomly generated UUID that uniquely identifies your Velocity server. Do not alter this setting. |
| `log-failure` | Boolean | Whether or not Velocity should log whenever it fails to connect to bStats.                          |
