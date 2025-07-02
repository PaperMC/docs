---
title: Frequently asked questions
description: Questions frequently asked by our community, answered by us!
slug: folia/faq
---

## What server types can benefit from Folia?
Server types that naturally spread players out,
like skyblock or SMP, will benefit the most from Folia. The server
should have a sizeable player count, too.

## What hardware will Folia run best on?
Ideally, at least 16 _cores_ (not threads).

## How to best configure Folia?
First, it is recommended that the world is pre-generated so that the number
of chunk system worker threads required is reduced greatly.

The following is a _very rough_ estimation based off of the testing
done before Folia was released on the test server we ran that
had ~330 players peak. So, it is not exact and will require further tuning -
just take it as a starting point.

The total number of cores on the machine available should be
taken into account. Then, allocate threads for:
- netty IO: ~4 per 200-300 players
- chunk system io threads: ~3 per 200-300 players
- chunk system workers if pre-generated, ~2 per 200-300 players
- There is no best guess for chunk system workers if not pre-generated, as
  on the test server we ran we gave 16 threads but chunk generation was still
  slow at ~300 players.
- GC Settings: ???? But, GC settings _do_ allocate concurrent threads, and you need
  to know exactly how many. This is typically through the `-XX:ConcGCThreads=n` flag. Do not
  confuse this flag with `-XX:ParallelGCThreads=n`, as parallel GC threads only run when
  the application is paused by GC and as such should not be taken into account.

After all of that allocation, the remaining cores on the system until 80%
allocation (total threads allocated < 80% of cpus available) can be
allocated to tickthreads (under global config, `threaded-regions.threads`).

The reason you should not allocate more than 80% of the cores is due to the
fact that plugins or even the server may make use of additional threads
that you cannot configure or even predict.

Additionally, the above is all a rough guess based on player count, but
it is very likely that the thread allocation will not be ideal, and you
will need to tune it based on usage of the threads that you end up seeing.

## What commands does Folia disable?
Folia currently disables a handful of commands. These are them:
- Bossbar commands
- Clone commands
- Data commands
- Datapack
- Debug
- Function
- Item commands
- Loot
- Reload
- Return
- Ride
- Rotate
- Schedule
- Scoreboard
- Spectate
- SpreadPlayers
- Tag
- Team
- TeamMsg
- Tick
- Trigger
- Perf
- SaveAll
- Restart
