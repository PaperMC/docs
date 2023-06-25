# Supporting Paper and Folia

![](/img/folia.png)

[Folia](https://github.com/PaperMC/Folia) is a fork of Paper, which is currently maintained by the PaperMC team. 
It adds the ability to split the world into regions as outlined [here](/folia/reference/overview) in more depth.

# Checking for Folia:

Depending on what platform your plugin is running on, you may need to implement features differently. For this, you can
use this utility method to check if the current server is running folia:

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

In order to support Paper and Folia, you must use the correct scheduler. Folia has many different type of schedulers 
that can be used for different things. They are:

- [Global Scheduler](#global-scheduler)
- [Region Scheduler](#region-scheduler)
- [Async Scheduler](#async-scheduler)
- [Entity Scheduler](#entity-scheduler)

When using these schedulers when running on Paper, they will be internally handled to provide the same functionality as if you were
running Paper.

### Global Scheduler
The tasks that you run on the Global Scheduler will be executed on the global region, see [here](/folia/reference/overview#global-region) for
more information. You should use this scheduler for any tasks that do not belong to any particular region. These can be fetched with:
```java
GlobalRegionScheduler globalScheduler = Bukkit.getGlobalRegionScheduler();
// or
GlobalRegionScheduler globalScheduler = server.getGlobalRegionScheduler();
```


### Region Scheduler
The region scheduler will be in charge of running tasks for the region that owns a certain location. Do not use this scheduler for 
operations on entities, as this scheduler is tied to the region. Each entity has its [own scheduler](#entity-scheduler)
which will follow it across regions. As an example, Let's say I want to set a block as beehive:
```java
Location locationToChange = ...;
RegionScheduler scheduler = Bukkit.getRegionScheduler();

scheduler.execute(plugin, locationToChange, () -> {
    locationToChange.getBlock().setType(Material.BEEHIVE);
});
```

We pass the location as a parameter to the `RegionScheduler` as it needs to work out which region to execute on.

### Async Scheduler
The Async Scheduler can be used for running tasks independent of the server tick process. This can be fetched with:
```java
AsyncScheduler asyncScheduler = Bukkit.getAsyncScheduler();
// Or
AsyncScheduler asyncScheduler = server.getAsyncScheduler();
```

### Entity Scheduler
Entity schedulers are used for executing tasks on an entity. These will follow the entity wherever it goes, so you must use
these instead of the region schedulers.
```java
EntityScheduler scheduler = entity.getScheduler();
```



