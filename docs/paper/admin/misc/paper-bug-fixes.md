---
slug: /misc/paper-bug-fixes
---

# Paper Bug Fixes

Paper fixes gameplay and mechanics inconsistencies. The most prevalent fixes being TNT Duplication and Bedrock Breaking.

## Vanilla Bug Fixes

Paper fixes many vanilla bugs that were not intended by Mojang. These bugs are patched to fix behaviour or prevent abuse and
instability on the server. Many of our fixes are configurable as we understand that some servers may want to keep the
vanilla behavior. You will find these configuration options in the [global configuration](/docs/paper/admin/reference/configuration/global-configuration.mdx)
and the [world configuration](/docs/paper/admin/reference/configuration/world-configuration.mdx).

## Duplication Bugs

Paper Patches TNT, Carpet, Rail and Gravity Block (Sand, Gravel etc) Duplication bugs. These bugs are not intended and 
are patched to prevent abuse.

Because TNT duping is considered a form of automated mining and not a resource dupe, we have provided an option to 
restore it. This, undesirably, also re-enables carpet and rail duping, which normally we would not provide a config for, 
but it's the same bug for those, so we have no choice. However, the config option is as follows:

```yaml
unsupported-settings:
  allow-piston-duplication: true
```

:::danger[Sand and Gravity Blocks]

**We will not and will never support sand and gravity block duping**. This is a form of resource duping and is **not** allowed.

:::

## Block Breaking

We also fix the ability to break Bedrock and End Portal frames. We do also provide a config option to restore this
functionality, but it is not recommended:
```yaml
unsupported-settings:
  allow-permanent-block-break-exploits: true
```

## Afterword

If your server lags, crashes or has any other undesirable consequences from enabling these flags, you will not get support from Paper.

For reasoning behind no configuration options for sand (and MANY other duplication bugs), see: 
[#3724](https://github.com/PaperMC/Paper/issues/3724)

Please do not create any further discussion on config options for sand duping. The decision is final.
