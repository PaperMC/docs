---
slug: /velocity/comparisons-to-other-proxies
---

# Comparing With Other Proxies

Presumably, you've read up about what Velocity can do for you. But how does it stack up against
other solutions out there? We're biased, so we'll try to be as honest as possible by fully
acknowledging our bias in advance. We are the developers of Velocity and we're trying to convince
you to use Velocity, after all.

## BungeeCord and derivatives

We can't treat the full history of Minecraft proxy software with justice – we recommend
[Me4502's excellent article](https://madelinemiller.dev/blog/decade-of-minecraft-multiplayer/) that
covers the multiplayer Minecraft world in great detail. Needless to say, Velocity was influenced by
a desire to avoid all the faults we perceived that needed to be resolved with BungeeCord.

### BungeeCord

There are several reasons why we can't just "improve BungeeCord":

- BungeeCord is very conservative with regard to API changes. If it breaks some plugin developed 5
  years ago from an inactive developer, you can forget about it.
- The changes that _do_ change the API are often quite particular and niche use cases and changing
  the API in substantial ways is frowned upon (witness the support for RGB colors in `ChatColor`).
- The project is essentially run like a cathedral. In BungeeCord (and its sister project, Spigot),
  the word of md_5 is king. Contributing a simple security fix to BungeeCord earned the primary
  developer of Velocity at least two beratings.
- BungeeCord is actively hostile to continued support for Minecraft modding.
- We have seen new modding APIs for _Minecraft_ since the first version of BungeeCord released
  in 2012. It's time for a new and improved API that does not make the mistakes the BungeeCord API
  makes, and to draw influence from the new modding APIs that Minecraft now boasts.

### Waterfall

The founder of the Velocity project also founded the Waterfall project. The natural question, then,
is why they couldn't just have improved Waterfall. Why start on a new API with no plugins lined up
and a very uncertain chance of success, let alone an user base willing to take their chances on such
new software, when you can have access to the rich plugin ecosystem that BungeeCord boasts?

Unfortunately, that attempt fell to the scythe of [Hyrum's Law](https://www.hyrumslaw.com/):

> With a sufficient number of users of an API, it does not matter what you promise in the contract:
> all observable behaviors of your system will be depended on by somebody.

Here's Hyrum's law in comic format, in case that eases getting the point across:

> [![xkcd #1172](https://imgs.xkcd.com/comics/workflow.png)](https://xkcd.com/1172/)  
> ["Workflow"](https://xkcd.com/1172/) from [xkcd](https://xkcd.com/) by Randal Munroe,
> [licensed](https://xkcd.com/license.html) under
> [CC BY-NC 2.5](https://creativecommons.org/licenses/by-nc/2.5/)

Most BungeeCord plugins are deeply dependent on the specific behaviors and quirks BungeeCord
exposes, which Velocity cannot perfectly emulate. I'll use an example of a video game. One day, a
game studio A publishes a video game X that you really like. You run it on operating system Y made
by company B, and it works great. Sometime after, studio A goes out of business. You are sad but
continue life because at least game X works just fine. One day, company B releases a new version of
operating system Y. You upgrade to it and discover that your game doesn't work. Who are you going to
blame, company B for breaking the game, or company A for shipping a defective project? Chances are,
the average consumer will blame company B. This isn't new —
[witness Raymond Chen, who documents the sad compatibility history of Windows, saying essentially the same thing](https://devblogs.microsoft.com/oldnewthing/20110131-00/?p=11633)
.

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

This is a fool's ploy. Let us revisit the video game example from earlier. One day, you discover a
new operating system, Z. You really like it more than operating system Y, and it has tool T that can
run programs meant for operating system Y. You install it and your favorite game, X. You then launch
game X to be disappointed with all the glitched out textures and borderline broken gameplay. You
feel quite hurt by it. This is a real world example too, just substitute Y for "Windows", Z for "any
Linux distribution", and T for "Wine", and there you have it. We would essentially have to have a
convincing decoy to pretend Velocity looked and smelled like a BungeeCord implementation to a
plugin, while not actually being based on BungeeCord. This would force us to introduce ever more
elaborate decoys to pretend to be bug-for-bug and binary compatible with BungeeCord, which would
force us to spend time on ensuring compatibility with every BungeeCord plugin ever rather than
delivering new features. At that point, Velocity winds up just being a slightly better optimized
Waterfall.
