---
title: Bug fixes
description: An explanation of which Vanilla bugs we fix in Paper.
slug: paper/misc/paper-bug-fixes
---

Paper fixes many gameplay and technical issues within Minecraft. The most prevalent fixes are to TNT duplication and bedrock breaking.

## Vanilla bug fixes

Paper fixes many Vanilla bugs that were not intended by Mojang. These bugs are patched to fix behavior or prevent abuse and
instability on the server. Some of our fixes are configurable, as we understand that some servers may want to keep the
Vanilla behavior. You will find these configuration options in the [global configuration](/paper/reference/global-configuration)
and the [world configuration](/paper/reference/world-configuration).

### What is intended behavior vs a bug?

When an issue is reported to us, we check Mojang's issue tracker. If the problem has been reported there, then we
check to see if it:

1) Has been confirmed as a bug
2) Has an assigned priority to it

If it meets these two criteria then we will accept changes to fix the bug, as it can take a long time for Mojang to fix
them (sometimes years). If an issue gets declined by Mojang, we normally do not "fix" it as it is intended behavior.

## Duplication bugs

Because TNT duping is considered a form of automated mining and not a resource dupe, we have provided an option to
restore it. This, undesirably, also re-enables carpet and rail duping, which normally we would not provide a config for,
but it's the same bug for those, so we have no choice. However, the config option is as follows:

```yaml title="config/paper-global.yml"
unsupported-settings:
  allow-piston-duplication: true
```

We also allow you to restore the ability to duplicate gravity blocks, such as sand, using end portals. This is not
recommended, as it can cause issues with the server, but we do provide a config option to restore this functionality:
```yaml title="config/paper-global.yml"
unsupported-settings:
  allow-unsafe-end-portal-teleportation: true
```

## Block breaking

We also fix the ability to break Bedrock and End Portal frames. We do also provide a config option to restore this
functionality, but it is not recommended:
```yaml title="config/paper-global.yml"
unsupported-settings:
  allow-permanent-block-break-exploits: true
```

## Afterword

We will not support you if you have issues whilst these settings are enabled, as they can cause unintended side effects.
These settings are also not guaranteed to be supported in the future and may have their behavior changed, or removed, at any time.

For legacy reasoning behind not having configuration options for many duplication bugs, see:
[#3724](https://github.com/PaperMC/Paper/issues/3724)
