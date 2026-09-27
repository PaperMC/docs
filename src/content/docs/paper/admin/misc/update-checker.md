---
title: Update checker
description: Documentation for Paper's built-in automatic update checker.
slug: paper/misc/update-checker
---

Since 1.21.11, Paper includes a built-in update checker that notifies server administrators on startup when a new version of Paper is available.

## How it works

When the server starts, Paper will check its current version against the latest available version in the stable channel on the PaperMC servers.
If a newer version is found, a notification message will be printed to the console and server logs.

Additionally, you can manually check for updates at any time by running the `version` command in the server console (or in-game with appropriate `bukkit.command.version` permission).

## What is sent

The update checker sends the following information to the PaperMC servers:
- Current Paper version
- Your server's client IP (as for any http request)

This information is not currently stored or analyzed by PaperMC, though requests pass through CloudFlare.

## Configuration
The update checker can be disabled in the `paper-global.yml` configuration file. The relevant section is as follows:

```yaml title="config/paper-global.yml"
update-checker:
  enabled: false
```

Alternatively you can disable the update checker by adding the following JVM argument when starting your server:

```bash
-Dpaper.disableStartupVersionCheck
```
