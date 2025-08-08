---
title: Introduction
description: A guide to Paper's Brigadier command API.
slug: paper/dev/command-api/basics/introduction
---

Paper's command system is built on top of Minecraft's Brigadier command system. This system provides a powerful and flexible way to define commands and arguments.
It offers many advantages above the previously widely used Bukkit command system:
- Less parsing or error checking required by the developer for arguments.
- Better user experience with client error checking.
- Integration with reload events, allowing the definition of commands usable in datapacks.
- Easier creation of subcommands.

:::note

To see a comparison between the new Brigadier system and the old Bukkit system, [click here](/paper/dev/command-api/misc/comparison-bukkit-brigadier).

:::

## Guide

:::tip

If the Brigadier API seems too complicated, you can start with
[basic commands](/paper/dev/command-api/misc/basic-command). They
provide a simple way of creating commands, with only a small learning curve.

:::

The following sites are worth-while to look through first when learning about Brigadier:
- [The Command Tree](/paper/dev/command-api/basics/command-tree)
- [Arguments and Literals](/paper/dev/command-api/basics/arguments-and-literals)
- [Command Executors](/paper/dev/command-api/basics/executors)
- [Command Registration](/paper/dev/command-api/basics/registration)
- [Command Requirements](/paper/dev/command-api/basics/requirements)
- [Argument Suggestions](/paper/dev/command-api/basics/argument-suggestions)
- [Custom Arguments](/paper/dev/command-api/basics/custom-arguments)

For a reference of more advanced arguments, you should look here:
- [Minecraft Arguments](/paper/dev/command-api/arguments/minecraft)

:::danger[Future pages]

The following pages will be added to the documentation in the future:

- **Tutorial: Creating Utility Commands**
- **The Command Dispatcher**
- **Forks and Redirects**
- **Tutorial: Extending the vanilla execute command**

:::

## Additional support
For support regarding the command API, you can always ask in our [Discord server](https://discord.gg/PaperMC) under the
[`#paper-dev`](https://discord.com/channels/289587909051416579/555462289851940864) channel!
