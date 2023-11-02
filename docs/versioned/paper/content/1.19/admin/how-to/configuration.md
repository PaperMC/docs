---
slug: /configuration
---

# Configuration

:::note

This guide currently only covers per-world configuration in `paper-world-defaults.yml`. Information
about general configuration will be added in the future. In the meantime, please refer to the
information in the [1.19 announcement forum post](https://forums.papermc.io/threads/paper-1-19.344).

:::

<!-- ## Global Configuration -->

## Per World Configuration

One of the most powerful yet least understood features of the Paper configuration is setting
configuration options per world. While you can not override every config option per world,
everything stored within `paper-world-defaults.yml` can be.

### Default Values

Paper sets no per-world overrides out of the box, storing all default values in
`config/paper-world-defaults.yml`. Everything in this file can be overridden per world but isn't by
default. Changing something in `paper-world-defaults.yml` will change the value for all worlds where
you have not manually overridden it.

### Per World Values

To set a value for a specific world, edit `paper-world.yml` within the world folder. For example, if
you wanted to disable `spawn.keep-spawn-loaded` for a world named `resource`, you would edit
`paper-world.yml` within the `resource` folder like so:

```yaml title=resource/paper-world.yml
_version: 28

# highlight-start
spawn:
  keep-spawn-loaded: false
# highlight-end
```

Nothing but `_version` is set in `paper-world.yml` configuration files by default. In order to
override the default for an option, you must manually add it by copying from
`paper-world-defaults.yml`.

### Inheritance

All configuration not explicitly defined for a world is inherited from `paper-world-defaults.yml`.
This means that there is no need to repeat yourself between the `paper-world-defaults.yml` and each
individual `paper-world.yml`. You **do not need to and should not** copy the entire
`paper-world-default.yml` file into each `paper-world.yml` file you want to modify. Only copy the
exact value you want to change.

For a more complex real-world example: setting both different `spawn-limits` and `keep-spawn-loaded`
in two worlds.

```yaml title="paper-world-defaults.yml"
entities:
  spawning:
    spawn-limits:
      ambient: 70
      axolotls: 10
      creature: 15
      monster: 5
      underground_water_creature: 5
      water_ambient: 5
      water_creature: 20
spawn:
  keep-spawn-loaded: true
```

```yaml title="world_nether/paper-world.yml"
entities:
  spawning:
    spawn-limits:
      monster: 90
```

```yaml title="resource_world/paper-world.yml"
entities:
  spawning:
    spawn-limits:
      axolotls: 8
      creature: 15
      monster: 2
spawn:
  keep-spawn-loaded: false
```

This example demonstrates the concept of inheritance. For each world, this is the effective
configuration which will be applied:

| Configuration Key                                           | world  | world_nether | world_the_end | resource_world |
| ----------------------------------------------------------- | ------ | ------------ | ------------- | -------------- |
| `entities.spawning.spawn-limits.ambient`                    | `15`   | `15`         | `15`          | `15`           |
| `entities.spawning.spawn-limits.axolotls`                   | `5`    | `5`          | `5`           | `8`            |
| `entities.spawning.spawn-limits.creature`                   | `10`   | `10`         | `10`          | `15`           |
| `entities.spawning.spawn-limits.monster`                    | `70`   | `90`         | `70`          | `2`            |
| `entities.spawning.spawn-limits.underground_water_creature` | `5`    | `5`          | `5`           | `5`            |
| `entities.spawning.spawn-limits.water_ambient`              | `20`   | `20`         | `20`          | `20`           |
| `entities.spawning.spawn-limits.water_creature`             | `5`    | `5`          | `5`           | `5`            |
| `spawn.keep-spawn-loaded`                                   | `true` | `true`       | `true`        | `false`        |

Notice that `world_the_end/paper-world.yml` was never modified. Because of this, it inherits all the
configuration options from `config/paper-world-defaults.yml`. Additionally, `keep-spawn-loaded` was
only disabled in `resource_world/paper-world.yml` because in `config/paper-world-defaults.yml`,
`keep-spawn-loaded` is set to `true`.

<!-- ## System Properties -->

<!-- ## Environment Variables -->

<!-- ## Logging Configuration(?) -->
