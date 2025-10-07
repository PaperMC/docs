---
title: Updating
description: Paper has new features and fixes coming every day, this guide explains the updating process.
slug: paper/updating
---

Updating Paper is an important part of running every server. With new features and fixes coming
every day, we recommend updating at least once per week to keep your server patched for the latest
bugs. Installing updates is very simple, but it's important to know how to do it correctly.

:::caution[Don't replace any JAR in a running server]

Unless you know exactly what and why you're doing what you're doing, it's never a good idea to
replace any JAR in a running server, be that plugins, or Paper itself.

:::

## Step 1. Backup

:::tip

If you are using a shared host, your host may provide a built-in way to back up. Consult their
documentation before continuing.

:::

This is the most important step, and yet the most frequently skipped. While it is unlikely that
updating Paper itself will cause any issues requiring you to restore from a backup, plugin
malfunctions or other accidents might! Updating is a great time to work in a backup. Having
functioning backups is essential to every server, big or small. The main things to back up are:

- The world folders
- Server Configuration Files
- Plugin Configuration Files & Plugin JARs

You should aim to have backups from multiple times, and keep them in a safe place. A common approach
is to keep rolling backups, so you always have a certain number of backups from a set amount of time.

## Step 2. Update plugins

Just like it's important to update Paper, it's equally important to keep plugins up to date. You
never know what plugin authors may be working on, be it bugfixes or new features.

A little known feature of Paper servers is the `update` folder. Here's how you use it.

1. Create a folder called `update` within the `plugins` folder.
2. One by one, download plugins you would like to update and put them in the `update` folder.
3. Restart your server, do not remove or modify any plugins outside the `update` folder.

By doing this, you are able to update all of your plugins at the same time without having the server
off, or replacing plugin JARs while the server is running. You do not need to restart your server
before updating Paper itself. This feature allows you to update both Paper and plugins all at the
same time, without needing any additional downtime.

## Step 3. Update Paper

:::tip

If you are using a shared host, your host may provide a built-in way to update! Consult their
documentation before continuing.

:::

Updating Paper itself is very simple.

1. Download a new JAR from [our downloads page](https://papermc.io/downloads).
2. Stop your server. It is not recommended and may cause issues to replace your Paper JAR while the server is running.
3. Rename the downloaded file to match the name specified in the [start command](/paper/getting-started#running-the-server).
4. Replace your old Paper JAR file with the new renamed one.
5. Start your server. Watch the startup log to ensure everything goes to plan. If there are any
   plugin conflicts or issues, you will see them here.

To minimize downtime caused by updates, some server owners will, rather than replacing their server
JAR, upload a new one and set their start script to use the new one on the next restart. Both of
these are valid update strategies.

:::caution[Automatic Updates]

While it may be convenient to install updates automatically (and Paper's [downloads service](/misc/downloads-service) allows you
to with ease), doing so is not recommended by Paper due to the possibility of plugin conflicts or
other issues that you may not know about. Always be present during updates, and keep a careful watch
on your server's log after the fact.

If you do choose to automatically install updates, ensure you have a functioning backup strategy in
place!

:::
