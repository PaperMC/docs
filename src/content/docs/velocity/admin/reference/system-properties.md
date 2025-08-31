---
title: System properties
description: Documentation for the system properties and environment variables Velocity may check.
slug: velocity/reference/system-properties
---

These system properties and environment variables can be set when you start your server allowing for the configuration of various settings.

:::danger[Danger Ahead]

Setting flags for the JVM can alter how it operates and the same goes for the Velocity server.
If you are unsure about what a flag does, it is recommended that you **do not use it**.

:::

## How they work

System properties are set when you start your server. For example, if you are using a `.bat` or a `.sh` file to start your server, you can add the system properties to
the file. For example:

```bash
java -Dvelocity.packet-decode-logging=true -jar velocity.jar
```

:::note

Some of Velocity's system properties contain a `.` character in their name. When using PowerShell, these will require wrapping in quotes.
i.e. `"-Dvelocity.packet-decode-logging=true"`

:::

Where a `-D` is used to set a system property, and the system property is `velocity.packet-decode-logging` with a value of `true`.
Otherwise, just add them to the start command.

:::note

The default value shown may not be set for the property but will only be used by Velocity if it is not explicitly set.

:::

## List of system properties

#### auth.forceSecureProfiles

- **default**: `true`
- **description**: Overrides `force-key-authentication` from the config. If not set, it will be automatically set to the current config value.

#### mojang.sessionserver

- **default**: `https://sessionserver.mojang.com/session/minecraft/hasJoined`
- **description**: Full URL of the `hasJoined` endpoint on the session server used for authentication.

#### velocity.natives-tmpdir

- **default**: `unset`
- **description**: Temporary directory for Velocity native files. (If set, it will also define `io.netty.native.workdir`)

#### velocity.max-known-packs

- **default**: `64`
- **description**: Limits known packs to the Vanilla default to prevent crashing Velocity.

#### velocity.max-clientside-plugin-channels

- **default**: `1024`
- **description**: Limits the plugin messaging channels registered by the client, as both Velocity and the backend servers need to keep track of them.

#### velocity.max-packets-per-flush

- **default**: `8192`
- **description**: The max amount of packets before the queue is flushed automatically.

#### velocity.log-server-backpressure

- **default**: `false`
- **description**: Whether Velocity should log if the server connection is writable and thus if the player connection will be auto-read.

#### velocity.packet-decode-logging

- **default**: `false`
- **description**: Whether packet decoding errors should be logged extensively.

#### velocity.skip-uncompressed-packet-size-validation

- **default**: `false`
- **description**: Whether to skip the validation of uncompressed packet sizes, this is useful to allow modded setups to send uncompressed packets over the threshold.

#### velocity.increased-compression-cap

- **default**: `false`
- **description**: Whether the maximum uncompressed packet size should be set to its maximum supported limit (128 MiB) instead of the Vanilla limit (8 MiB).

#### velocity.disable-native-transport

- **default**: `false`
- **description**: Whether to disable Netty's native transport methods like the io_uring support and Epoll. If set to true, Velocity will use Java's NIO transport instead.

#### velocity.enable-iouring-transport

- **default**: `false`
- **description**: Enables Netty's io_uring transport when set to true. By default, Velocity only uses the Epoll (on Linux) and kqueue (on macOS) native transports. This property does not override the `velocity.disable-native-transport` property.

#### velocity.natives-disabled

- **default**: `false`
- **description**: Whether native functionality for specific operating systems should be disabled.

#### velocity.strictErrorHandling

- **default**: `true`
- **description**: Whether the client should disconnect on packet errors. Temporarily added in MC 1.20.5 and removed in 1.21.2 to help modded servers transition to this change.

## List of environment variables

#### VELOCITY_FORWARDING_SECRET

- **default**: `unset`
- **description**: Overrides the forwarding secret inside the [`forwarding-secret-file`](/velocity/configuration#root-section).
