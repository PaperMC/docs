---
slug: /velocity/migration
---

# Migration Guide

New to Velocity, or upgrading to a new version of Velocity? This page will briefly explore what you
need to be aware of for a successful migration

## Migrating from Velocity 1.0.x to Velocity 1.1.0

Moving from Velocity 1.0.x to Velocity 1.1.0 should be as simple as just replacing the Velocity JAR
and restarting the proxy. You may want to back up your `velocity.toml` and then delete the current
`velocity.toml` and let Velocity regenerate it to add the new settings that Velocity 1.1.0
introduces.
