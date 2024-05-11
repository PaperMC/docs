---
slug: /getting-started
description: How to get started with running Waterfall.
eol: true
eol_message: We recommend you transition to [Velocity](https://papermc.io/software/velocity). For more information, see the [announcement](https://forums.papermc.io/threads/1088/).
---

# Getting Started

## What is Waterfall?

Waterfall is a fork of BungeeCord, a proxy used primarily to teleport players between multiple
Minecraft servers.

Waterfall focuses on three main areas:

- Stability: Waterfall aims to be stable. We will achieve this through making the code base testable
  and discouraging practices that lead to proxy lag.
- Features: Waterfall aims to include more features than canonical BungeeCord.
- Scalability: Waterfall should be able to handle a large number of concurrent players, given a
  reasonably modern CPU, memory, and good network connection.

## Requirements

Waterfall requires **Java 8** or newer to run. The Paper team recommends you run on Java 11 or
higher. Generally, LTS versions of Java are targeted, though you may have luck on newer versions.

## Migrating from BungeeCord

Waterfall is a drop in replacements for BungeeCord, you don't need to make any changes to your
configuration.

## Getting a proxy JAR

Paper provides runnable proxy JARs directly from our [downloads page](https://papermc.io/downloads#Waterfall).

Click on the build number to download a file.

## Running the proxy

To run the proxy, simply start it up like any other Java application.

Open your terminal, navigate to the saved location, and then run

```bash
java -Xms512M -Xmx512M -jar waterfall-###.jar
```

Aikar's recommended flags for Waterfall are as follows:

```bash
java -Xms512M -Xmx512M -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -jar waterfall-###.jar
```

The amount of memory can be set by changing the numbers in the `-Xms` and `-Xmx` flags.

To configure your proxy, see the [configuration](configuration.mdx) page.

## Updating the proxy

To update the proxy, first stop it safely by executing the `end` command. Then replace the old proxy
JAR with a new one, and start the proxy. That's it.
