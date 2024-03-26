---
slug: /comparisons-to-other-proxies
description: A comparison of Velocity to other proxies.
---

# Comparing With Other Proxies

Presumably, you have learned about what Velocity can do for you. But how does it stack up against
other solutions out there? We're trying to convince you to use Velocity, after all, so this document
may be somewhat biased in our favor.

## Overview

:::danger

**The Paper team strongly recommends using Velocity over Waterfall and BungeeCord**. Waterfall has reached end of life. All future
development by PaperMC is done on Velocity. For more information, see the [announcement](https://forums.papermc.io/threads/1088/).

:::

This is a quick overview of the differences between Velocity and other popular proxy software. Read below for more details.
| Feature                                  | BungeeCord | Waterfall | Velocity |
|------------------------------------------|------------|-----------|----------|
| Resource efficient                       | ❌         | ✅        | ✅✅     |
| Velocity plugins                         | ❌         | ❌        | ✅       |
| BungeeCord plugins                       | ✅         | ✅        | 🟨*      |
| Secure player information forwarding     | ❌         | ❌        | ✅       |
| API supporting modern Minecraft features | ❌         | ❌        | ✅       |
| Actively developed                       | ❓         | ❌        | ✅       |
| Improved mod support                     | ❌         | ❌        | ✅*\*    |

\* _The Velocity API does not support plugins made for BungeeCord/Waterfall, but [Snap](https://hangar.papermc.io/Phoenix616/Snap) can be installed for experimental support.
 Snap is not maintained by, or affiliated with, the Velocity project._

\** _Full Forge support for 1.7 through 1.12.2 and 1.20.2 or higher._

## BungeeCord and derivatives

We can't discuss the full history of Minecraft proxy software deeply – we recommend
[Me4502's excellent article](https://madelinemiller.dev/blog/decade-of-minecraft-multiplayer/) that
covers the multiplayer Minecraft world in great detail.

### BungeeCord

The original author of Velocity, at the time of starting the project, had over 5 years of experience
using BungeeCord, and knew its various quirks inside and out.

There are several reasons why improving BungeeCord was a fool's game:

- BungeeCord is very conservative with regard to API changes. If it breaks some plugin developed 5
  years ago from an inactive developer, you can forget about it.
- The changes that _do_ change the API are often quite particular and niche use cases and changing
  the API in substantial ways is frowned upon (witness the support for RGB colors in `ChatColor`).
- The project is essentially run like a cathedral. In BungeeCord (and its sister project, Spigot),
  the word of md_5 is king. Contributing a simple security fix to BungeeCord earned the primary
  developer of Velocity at least two beratings from md_5.
- BungeeCord is actively hostile to continued support for Minecraft modding.
- We have seen new modding APIs for _Minecraft_ since the first version of BungeeCord released
  in 2012. It's time for a new and improved API that does not make the mistakes the BungeeCord API
  makes, and to draw influence from the new modding APIs that Minecraft now boasts.

### Waterfall

Partly due to experience obtained by the author's own experience with BungeeCord, he founded the
Waterfall project in 2016 as a fork of BungeeCord, modeled after Paper, with the explicit aim of
improving BungeeCord. _We tried the obvious next step_.

Meet [Hyrum's Law](https://www.hyrumslaw.com/):

> With a sufficient number of users of an API, it does not matter what you promise in the contract:
> all observable behaviors of your system will be depended on by somebody.

Here's Hyrum's law in comic format, in case that eases getting the point across:

> [![xkcd #1172](https://imgs.xkcd.com/comics/workflow.png)](https://xkcd.com/1172/)  
> ["Workflow"](https://xkcd.com/1172/) from [xkcd](https://xkcd.com/) by Randal Munroe,
> [licensed](https://xkcd.com/license.html) under
> [CC BY-NC 2.5](https://creativecommons.org/licenses/by-nc/2.5/)

Most BungeeCord plugins are deeply dependent on the specific behaviors and quirks BungeeCord
exposes, which Velocity cannot perfectly emulate. As a result, the number of changes one can make
to BungeeCord and have plugins retain the same behavior is minimal.

Suppose you have play a video game published by Company A. It runs on an operating system made by Company B.
One day, Company B releases a new version of their operating system, and you upgrade to it, only to recoil
in horror as that video game no longer works. (Worse, Studio A might be out of business at that point, so
no patch is forthcoming.) Who do you blame, Company A for producing a defective product, or Company B for
breaking the game? [This isn't a hypothetical](https://devblogs.microsoft.com/oldnewthing/20110131-00/?p=11633).

We can point to one example where
[an attempt](https://github.com/PaperMC/Waterfall/commit/c8eb6aec7bac82fd309fa6d6113b8a0418317b01)
to improve scoreboard handling on 1.13 and above
[was reversed](https://github.com/PaperMC/Waterfall/issues/255) thanks to plugins expecting
BungeeCord's broken behavior. At this point, it is fairly obvious why making a clean break was
better. Given that this happened near the start of the Velocity project's lifetime, it was probably
a quite powerful motivator, although it certainly wasn't the only motivator.

### Hypothetical BungeeCord API-based Velocity

We are compelled to mention this briefly as this was a topic brought up in the early days of the
project. We could have based Velocity on the BungeeCord API (or a derivative thereof, such as the
Waterfall API) instead.

This has the same problems as Waterfall, perhaps more as we would need to emulate _all_ the behavior
of the BungeeCord API independently. The Wine project has been trying over over 3 decades to provide
a shim layer that allows Windows programs to run on Linux and other operating systems. Their efforts
remain ongoing to this day. It is hard to emulate the behavior of another operating system's environment.
The authors of ReactOS have it even worse, trying to emulate all the quirks of Windows, including its
kernel, and they have set their baseline to a version of Windows that was released 2 decades ago. Their
work is even further from completed than Wine's is.

We would have to spend a lot of time pretending that Velocity looked and quacked just like BungeeCord.
We intentionally rejected this approach. It's not worth doing.
