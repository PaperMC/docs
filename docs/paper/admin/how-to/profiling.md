---
slug: /profiling
description: How to profile your Paper server.
---

# Profiling

Profiling is a way to diagnose performance problems with your server.
A profiler measures certain characteristics of a running server, e.g. how often a method is called
and how much time it takes up in a single tick, how long and often the garbage collector runs and much more.

:::warning

_For profiling to be effective, the issue you are diagnosing must be actively occurring._

:::

## Timings

Paper bundles the [Timings v2](https://timings.aikar.co/) profiler, however Timings has been unmaintained
for multiple years and its reports are difficult to read for beginners. It has been deprecated in favor of
Spark and turned off by default in 1.21, see [this discussion](https://github.com/PaperMC/Paper/discussions/10565)
for more information.

## Spark

Starting with 1.21, Paper bundles the [Spark](https://spark.lucko.me/) profiler, which is the preferred way
to profile Paper.

To start profiling your server, run this command:
```
/spark profiler start --timeout 600
```

After 10 minutes, this will return a URL with a profiler report, which you can analyze yourself or provide
to a developer of a plugin or the Paper support chats.

This is only a fraction of what Spark can do, so if you want to learn about the different features of Spark
or learn to analyze reports yourself, check out Spark's documentation [here](https://spark.lucko.me/docs/).

If you need help with analyzing a performance issue, please bring a Spark report to the
[PaperMC Discord server](https://discord.gg/PaperMC) (#paper-help) for assistance.
