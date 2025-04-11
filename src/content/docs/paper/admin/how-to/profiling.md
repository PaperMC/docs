---
title: Profiling
description: How to profile your Paper server.
slug: paper/profiling
---

Profiling is a way to diagnose performance problems with your server.
A profiler measures certain characteristics of a running server, e.g. how often a method is called
and how much time it takes up in a single tick, how long and often the garbage collector runs and much more.

:::caution

_For profiling to be effective, the issue you are diagnosing must be actively occurring._

:::

If you need help with analyzing a performance issue, please bring a spark report to the
[PaperMC Discord server](https://discord.gg/PaperMC) (#paper-help) for assistance.

## spark

Starting with 1.21, Paper bundles the [spark](https://spark.lucko.me/) profiler, which is the preferred way
to profile Paper.

To start profiling your server, run this command:
```
/spark profiler start --timeout 600
```

After 10 minutes, this will return a URL to a profiler report, which you can analyze yourself or provide
to a developer of a plugin or the Paper support chats.

This is only a fraction of what spark can do, so if you want to learn about the different features of spark
or learn to analyze reports yourself, check out spark's documentation [here](https://spark.lucko.me/docs/).

:::tip

If you want to use a version of spark newer than the bundled one, simply place a standalone spark plugin JAR
into the `plugins` directory and set the [`paper.preferSparkPlugin`](/paper/reference/system-properties#paperprefersparkplugin)
system property to `true`.

If you want to use PlaceholderAPI [placeholders](https://spark.lucko.me/docs/misc/Placeholders)
from the bundled spark version, you need to install the [spark expansion](https://api.extendedclip.com/expansions/spark/)
from PAPI's eCloud (`/papi ecloud download spark` and `/papi reload`).

:::

## Timings

Paper also bundles the [Timings v2](https://timings.aikar.co/) profiler, however Timings has been unmaintained
for multiple years and its reports are difficult to read for beginners. It has been deprecated in favor of
spark and turned off by default in 1.21, see [this discussion](https://github.com/PaperMC/Paper/discussions/10565)
for more information.
