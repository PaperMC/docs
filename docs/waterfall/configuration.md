# Configuration

This page details the various configuration settings exposed by Waterfall. These settings can be
found in waterfall.yml.

If you want information on settings in BungeeCord's config.yml you should see its respective
documentation pages.

## use_netty_dns_resolver

- **default**: `true`
- **description**: Sets whether Netty's async DNS resolver is used for account authentication.

## disable_modern_tab_limiter

- **default**: `true`
- **description**: Disables the tab completion limit for 1.13+ clients.

## log_initial_handler_connections

- **default**: `true`
- **description**: Sets whether to log InitialHandler connections.

## throttling

- tab_complete
  - **default**: `1000`
  - **description**: How often tab-complete packets can be sent in milliseconds.

## game_version

- **default**: `` (empty string)
- **description**: The supported versions displayed to the client. Default is a comma separated list
  of supported versions. For example 1.8.x, 1.9.x, 1.10.x

## disable_tab_list_rewrite

- **default**: `false`
- **description**: This setting disables tablist rewriting, which may resolve issues setting player
  profiles when Waterfall is in offline mode.

## disable_entity_metadata_rewrite

- **default**: `false`
- **description**: This setting disables entity metadata rewriting in favor of sending a join packet
  to the client. It offers a more robust solution for modded environments but can cause plugins to
  break.

## plugin_channel_name_limit

- **default**: `128`
- **description**: The maximum channel identifier length. May be useful for certain broken mods.

## registered_plugin_channels_limit

- **default**: `128`
- **description**: The maximum number of registered plugin channels for a connection. Used by mods
  and some plugins. May be useful to fix certain broken modpacks.
