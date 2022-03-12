---
slug: /paper/per-world-configuration
---

# Per World Configuration

One of the most powerful yet least understood features of the Paper configuration is setting
configuration options per world. While not every config option can be set per world, everything
under `world-settings` in either `paper.yml` or `spigot.yml` can be configured differently on a per
world basis.

## Default Values

The only world generated out of the box is `default`. Any configuration option set here will apply
to **all** loaded worlds, unless explicitly overridden. Any configuration change that does not need
to be separated by world should be made in this section.

:::info The main world

The `default` section also serves as the place to configure per world settings for the main world
(`level-name` in server.properties). An additional section created for the main world will not
supersede `default`.

:::

## Per World Values

A new section must be manually added to the bottom of the configuration file for each world which
requires a unique configuration. This section will not be automatically generated; it must be added.
Remember! YAML (the configuration format used by Paper) cares about spaces. When adding a new world,
ensure there are two spaces behind it.

For example, to disable loading the spawn chunks in `world_nether` and `world_the_end`,
configuration would be added like this:

```yaml title="paper.yml"
world-settings:
  default:
    keep-spawn-loaded: true
  world_nether:
    keep-spawn-loaded: false
  world_the_end:
    keep-spawn-loaded: false
```

This is a very stripped-down example. In reality, the `default` section will be much more extensive
as it contains all possible configuration options. This may look overwhelming at first, but always
remember to put new worlds at the very bottom of the configuration file.

### Inheritance

All configuration not explicitly defined for a world is inherited from the `default` section. This
means there is no need to repeat configuration options with the same value between sections, so
there is no need to copy and paste the entire `default` section into each new world created.

For a more complex real-world example: setting both different `spawn-limits` and `keep-spawn-loaded`
in two worlds.

```yaml title="paper.yml"
world-settings:
  default:
    spawn-limits:
      monster: 70
      creature: 10
      ambient: 15
      axolotls: 5
      underground_water_creature: 5
      water_creature: 5
      water_ambient: 20
    keep-spawn-loaded: true
  world_nether:
    spawn-limits:
      monster: 90
  resource_world:
    spawn-limits:
      monster: 2
      creature: 15
      axolotls: 8
    keep-spawn-loaded: false
```

This example demonstrates the concept of inheritance. For each world, this is the effective
configuration which will be applied:

| Configuration Key                         | world  | world_nether | world_the_end | resource_world |
| ----------------------------------------- | ------ | ------------ | ------------- | -------------- |
| `spawn-limits.monster`                    | `70`   | `90`         | `70`          | `2`            |
| `spawn-limits.creature`                   | `10`   | `10`         | `10`          | `15`           |
| `spawn-limits.ambient`                    | `15`   | `15`         | `15`          | `15`           |
| `spawn-limits.axolotls`                   | `5`    | `5`          | `5`           | `8`            |
| `spawn-limits.underground_water_creature` | `5`    | `5`          | `5`           | `5`            |
| `spawn-limits.water_creature`             | `5`    | `5`          | `5`           | `5`            |
| `spawn-limits.water_ambient`              | `20`   | `20`         | `20`          | `20`           |
| `keep-spawn-loaded`                       | `true` | `true`       | `true`        | `false`        |

Notice that `world_the_end` was never specified in this configuration. Because of this, it inherits
all the configuration options from the `default` section. Additionally, `keep-spawn-loaded` was only
disabled in `resource_world` because in the `default` section, `keep-spawn-loaded` is set to `true`.
