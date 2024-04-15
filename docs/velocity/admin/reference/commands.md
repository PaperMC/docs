---
slug: /built-in-commands
description: A list of the built-in commands with explanations.
---

# Built-In Commands

Velocity includes a few commands in the core of the proxy by default. These commands were chosen
based on how generally useful they are to most users.

Of course, you can always install plugins to add more commands if you want.

## `/velocity`

The `/velocity` command contains a number of subcommands to manage the proxy.

### `/velocity plugins`

If the user has the `velocity.command.plugins` permission, they can view all the plugins currently
active on the proxy using `/velocity plugins`, including the name, authors, and version.

### `/velocity version`

If the user has the `velocity.command.info` permission (by default, this is granted to all users),
they can view the version of Velocity running on the proxy.

### `/velocity reload`

If the user has the `velocity.command.reload` permission, the proxy will read and reconfigure itself
from the `velocity.toml` on disk. If there are problems with parsing the file, no changes will be
applied.

### `/velocity dump`

If the user has the `velocity.command.plugins` permission, they can use this command to get an
anonymized dump of details on the proxy. This can be sent to the PaperMC Discord to help us provide
support.

### `/velocity heap`

:::caution

This command generates a heap dump which contains detailed information about your Velocity instance
which can be quite sensitive, be very careful to whom you share the generated heap dump.

:::

If the user has the `velocity.command.heap` permission, they will be able to generate a heap dump
from the running Velocity instance, which will allow a detailed analysis of memory consumption.

The generated heap dump will be found in the `dumps` folder.

## `/server`

If the user has the `velocity.command.server` permission (by default, this is granted to all users),
players can use this command to view and switch to another server.

Executing just `/server` will send the user the name of the server they are currently on, along with
options to move to other servers configured on the proxy.

If a server name has been provided, Velocity will attempt to connect to the server.

## `/shutdown`

When executed from the console, this will gracefully shut down the Velocity proxy. All players will
be disconnected from the proxy and plugins will have a chance to finish up before the proxy shuts
down. An optional reason can be given, either as JSON or with [MiniMessage Format](https://docs.advntr.dev/minimessage/format.html).

## `/glist`

If the user has the `velocity.command.glist` permission (by default, this is granted to nobody),
players can use this command to view the number of players currently on the proxy and use
`/glist all` to get a listing of players per server.

## `/send`

If the user has the `velocity.command.send` permission, they can send other players (or all
players on the proxy) to another server.
