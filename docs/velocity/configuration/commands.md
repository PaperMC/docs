---
slug: /velocity/built-in-commands
---

# Built-In Commands

Velocity includes a few commands in the core of the proxy by default. These commands were chosen
based on how generally useful they are to most users.

Of course, you can always install plugins to add more commands if you want.

## The `/velocity` command

The `/velocity` command contains a number of subcommands to manage the proxy.

### `/velocity plugins`

If the user has the `velocity.command.plugins` permission, they can view all the plugins currently
active on the proxy using `/velocity plugins`, including the name, authors, and version.

### `/velocity version`

Displays the version of Velocity running on the proxy.

### `/velocity reload`

If the user has the `velocity.command.reload` permission, the proxy will read and reconfigure itself
from the `velocity.toml` on disk. If there are problems with parsing the file, no changes will be
applied.

### `/velocity dump`

:::caution

This command will send some basic information to a web service maintained by the Velocity project
(`dump.velocitypowered.com`). While we anonymize potentially sensitive details in the proxy such as
external IP addresses and all dumps expire after 3 days, we do not take responsibility for any
potential misuse of the data provided. Use this command with caution and after you have considered
the privacy and security concerns.

:::

If the user has the `velocity.command.plugins` permission, they can use this command to get an
anonymized dump of details on the proxy. This can be sent to the Velocity Discord to help us provide
support.

## `/server`

If the user has the `velocity.command.server` permission (by default, this is granted to all users),
players can use this command to view and switch to another server.

Executing just `/server` will send the user the name of the server they are currently on, along with
options to move to other servers configured on the proxy.

If a server name has been provided, Velocity will attempt to connect to the server.

## `/shutdown`

When executed from the console, this will gracefully shut down the Velocity proxy. All players will
be disconnected from the proxy and plugins will have a chance to finish up before the proxy shuts
down. An optional reason can be given, either as JSON or with legacy color codes, in the same format
as the MOTD in `velocity.toml`.

## `/glist`

If the user has the `velocity.command.glist` permission (by default, this is granted to nobody),
players can use this command to view the number of players currently on the proxy and use
`/glist all` to get a listing of players per server.
