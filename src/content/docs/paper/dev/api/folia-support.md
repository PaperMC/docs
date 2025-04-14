---
title: Supporting Paper and Folia
description: How to support both Folia and Paper within your plugin.
slug: paper/dev/folia-support
---

![](https://assets.papermc.io/brand/folia.png)

[Folia](https://github.com/PaperMC/Folia) is a fork of Paper, which is currently maintained by the PaperMC team.
It adds the ability to split the world into regions as outlined [here](/folia/reference/overview) in more depth.

# Checking for Folia

Depending on what platform your plugin is running on, you may need to implement features differently. For this, you can
use this utility method to check if the current server is running Folia:

```java
private static boolean isFolia() {
    try {
        Class.forName("io.papermc.paper.threadedregions.RegionizedServer");
        return true;
    } catch (ClassNotFoundException e) {
        return false;
    }
}
```

## Schedulers

In order to support Paper and Folia, you must use the correct scheduler. Folia has different types of schedulers
that can be used for different things. They are:

- [Global](#global-scheduler)
- [Region](#region-scheduler)
- [Async](#async-scheduler)
- [Entity](#entity-scheduler)

If you use these schedulers when running Paper, they will be internally handled to provide the same functionality as if you were
running Folia.

### Global scheduler
The tasks that you run on the global scheduler will be executed on the global region, see [here](/folia/reference/overview#global-region) for
more information. You should use this scheduler for any tasks that do not belong to any particular region. These can be fetched with:
```java
GlobalRegionScheduler globalScheduler = server.getGlobalRegionScheduler();
```

### Region scheduler
The region scheduler will be in charge of running tasks for the region that owns a certain location. Do not use this scheduler for
operations on entities, as this scheduler is tied to the region. Each entity has its [own scheduler](#entity-scheduler)
which will follow it across regions. As an example, let's say I want to set a block to a beehive:
```java
Location locationToChange = ...;
RegionScheduler scheduler = server.getRegionScheduler();

scheduler.execute(plugin, locationToChange, () -> {
    locationToChange.getBlock().setType(Material.BEEHIVE);
});
```

We pass the location as a parameter to the [`RegionScheduler`](jd:paper:io.papermc.paper.threadedregions.scheduler.RegionScheduler)
as it needs to work out which region to execute on.

### Async scheduler
The async scheduler can be used for running tasks independent of the server tick process. This can be fetched with:
```java
AsyncScheduler asyncScheduler = server.getAsyncScheduler();
```

### Entity scheduler
Entity schedulers are used for executing tasks on an entity. These will follow the entity wherever it goes, so you must use
these instead of the region schedulers.
```java
EntityScheduler scheduler = entity.getScheduler();
```
