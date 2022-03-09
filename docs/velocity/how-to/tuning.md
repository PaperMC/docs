---
slug: /velocity/tuning
---

# Tuning Velocity

Velocity comes with good performance out of the box. We go in deep, starting from smart algorithmic
choices, making strategic usage of native libraries, all the way to the JVM level, optimizing the
proxy so that the JVM will make better decisions when optimizing the code.

## Host the proxy on Linux

Velocity comes with high-performance, specially tuned native libraries for compression and
encryption, along with including native transports from Netty. However, due to support constraints,
the compiled natives are only verified to work on Linux x86_64 and aarch64. While Velocity does not
require the natives to work, you will suffer from degraded performance. For this reason, we strongly
recommend that all production deployments of Velocity run on x86-64 Linux.

## Allocate server resources appropriately

You should always make sure to allocate the correct amount of heap, network bandwidth, and get the
right CPU for the amount of players you want to have on your proxy at a given time. For instance, it
is unlikely you'll be able to get 1,000 players on a Raspberry Pi Zero, but you'll have a much
better chance if you have a recent high-end server CPU from Intel or AMD.

There is no "one-size-fits-all" hardware recommendation, only general guidelines for the amount of
players you can expect:

- Prefer lots of cores but lower clock speeds. Unlike the Minecraft server, Velocity can actually
  benefit from the extra cores and single-threaded performance is not as important.
- You should always have enough memory to run Velocity, including room for JVM overhead and for your
  operating system. For a rough minimum recommended memory amount, double the size of the proxy heap
  and then add 2GB. For instance, for a proxy with a 2GB heap, plan on getting at least 6GB of
  memory.
- Disk speed is unimportant. A solid-state drive is nice to have but not strictly required.
  Likewise, disk capacity is unimportant as well.

### Special notes regarding speculative execution security vulnerabilities

Starting in 2018, a number of security vulnerabilities with regard to
[speculative execution](https://en.wikipedia.org/wiki/Speculative_execution) used by modern CPUs
have been discovered.

The mitigations to these vulnerabilities can have painful performance implications, especially on
processors vulnerable to Meltdown and further compounded if running in a virtual machine. Velocity,
as a network application, is particularly sensitive to the performance hits that the mitigations
introduce.

To minimize these hits, we recommend hosting your proxy on a machine with a CPU that has mitigations
against Spectre and Meltdown. Processors released in 2019 and onwards typically contain mitigations
to protect against Spectre and Meltdown.

If you are using a CPU vulnerable to Spectre and/or Meltdown and are willing to risk security for
performance, it is also possible to disable Spectre/Meltdown mitigations depending on the operating
system you use. Note however that you disable these security mitigations _at your own risk_. The
Velocity project does not recommend that you disable these mitigations.

## Allocate enough heap

Alongside having enough CPU, memory, and network bandwidth, you must also allocate enough Java heap
to the proxy. Not doing this can induce lag and in severe cases may result in the proxy being
terminated by the Java Virtual Machine because it ran out of memory.

The general rule of thumb is that you allocate 512MB per 500 players, plus some extra to allow for
some room for error ( typically 1GB extra). For instance, if you want to handle 1,000 on a single
proxy, plan to allocate 2GB of heap.

### Special notes for containers

**If you use a containerized setup (such as using Kubernetes, Pterodactyl, or Docker directly), you
should not allocate the entirety of your memory allocation to the heap!** Doing so _will_ likely
cause the proxy to be killed by the kernel's out-of-memory killer, which will result in your proxy
going down, likely at the worst possible time.

A safe (albeit conservative) setting for the heap would be to allocate half of the memory you
allocate to the proxy container in total. For instance, if you know the proxy will need to hold
1,000 players, then allocate 4GB to the container and give the proxy 2GB of heap.

## Tune your startup flags

We also recommend tuning your startup flags. The current recommendation is:

```
-XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -XX:MaxInlineLevel=15
```

You will add these flags after the `java` command but before the `-jar` parameter.

### Explanation of the flags

Most of these flags focus on tuning the G1 garbage collector to be more friendly to Velocity's
workload. One of these flags (`-XX:MaxInlineLevel=15`) tends to improve performance in general.

Before the release of Java 9, the default Java garbage collector was the Parallel GC. This is a
stop-the-world collector that does its work in parallel. The problem is that its pause times tend to
be long, and are not suitable for Minecraft (often showing up as seemingly unexplainable lag
spikes).

The recommended garbage collector for Velocity is the G1 region-based collector. There are several
reasons for us to recommend G1:

- It strikes the right balance between throughput and pause times. Throughput is roughly how much
  work the proxy can achieve.
- It is compatible with most setups (it is available in Java 8, the earliest Java version we
  support).

Setups using these flags tend have very low (less than 10 millisecond) GC pauses every few minutes,
which is very good for Minecraft.

### Other configurations

:::caution

Deviating from the configuration we recommend is done solely at your own risk.

:::

Velocity is an application that tends to follow the generational hypothesis quite closely. It has
also been tuned to reduce load on the garbage collector as much as possible.

#### ZGC

ZGC (the Z Garbage Collector), introduced with Java 11 and stabilized with Java 15, has proven to be
successful for one large-scale deployment of Velocity.

At its core, ZGC is a concurrent, generation-less garbage collector emphasizing low latency at the
expense of throughput. Given the nature of Velocity as a network proxy where low throughput and high
throughput are important, we recommend using ZGC with caution, and only if you use Java 15 or above.

The primary tuning flag for ZGC is heap size - if ZGC cannot collect garbage faster than the proxy
can allocate it, the threads generating garbage will be temporarily paused, causing the proxy to
appear to be laggy. Our heap size recommendations still apply, but prepare to give the proxy more
memory if necessary.

#### Shenandoah

Introduced in Java 11 and declared stable in Java 15, Shenandoah is similar to G1 in being a
concurrent, generational garbage collector, but it does more work in parallel.

The Velocity team is not aware of any successful deployments of Shenandoah with Velocity in the
wild.

#### OpenJ9

OpenJ9 is an alternative to the HotSpot JVM derived from IBM's J9 JVM, focused primarily on cloud
workloads. As a result, it behaves very differently from HotSpot. Correspondingly, it has a
completely different set of garbage collectors.

The default `gencon` garbage collector should work fine with Velocity.
