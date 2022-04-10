---
slug: /velocity/developers/dependency-management
---

# Dependency Management

Dependencies are common. You need to hook into another plugin. You don't want to write the same code
someone else has already solved. Whatever you do, you need a way to manage your dependencies
effectively.

## Plugin dependencies

Adding a dependency on another plugin is done with the `@Plugin` annotation in your main class.
Let's revisit that briefly:

```java
@Plugin(
  id = "myfirstplugin",
  name = "My Plugin",
  version = "0.1.0"
)
public class VelocityTest {
  // ...
}
```

Say we have a dependency on another plugin, call it `wonderplugin`. To add it as a dependency, do
the following:

```java
@Plugin(
  id = "myfirstplugin",
  name = "My Plugin",
  version = "0.1.0",
  dependencies = {
    @Dependency(id = "wonderplugin")
  }
)
public class VelocityTest {
  // ...
}
```

The id of the dependency is the same as the other plugin's `id` from its `@Plugin` annotation. This
is why having a stable plugin ID is important.

That's it! Now, your plugin will require wonderplugin to load, and when it does, it will load
_after_ wonderplugin.

To specify multiple dependencies, separate them by commas:
`dependencies = {@Dependency(id = "wonderplugin"), @Dependency(id = "otherplugin")}`

## Optional plugin dependencies

To make a dependency optional, add `optional = true`, like shown:

```java
@Plugin(
  id = "myfirstplugin",
  name = "My Plugin",
  version = "0.1.0",
  dependencies = {
    @Dependency(id = "wonderplugin", optional = true)
  }
)
public class VelocityTest {
  // ...
}
```

## External dependencies

:::caution

Please remember to relocate any dependencies you shade. Failure to relocate will lead to dependency
conflicts with other plugins.

:::

Dependencies on other libraries aren't handled by Velocity. You will need to add them using your
build system.

If your plugin does not shade its dependencies, but rather attaches them from a directory, you may
use the PluginManager's `addToClasspath` method instead of using reflection to access the
ClassLoader.
