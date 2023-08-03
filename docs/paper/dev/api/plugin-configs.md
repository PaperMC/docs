---
slug: /dev/plugin-configurations
---

# Plugin Configurations

Configuration files allow users to change certain behavior and functionality of Plugins. This guide will outline how to use them.

## Format

By default, plugins use a YAML configuration format (`.yml` file). Other formats such as JSON or TOML can be used, 
however these are not natively supported by Paper so will not be covered in this guide.

YAML works by having a tree-like `key: value` pair structure as you would have seen in your [plugin.yml](../getting-started/plugin-yml.md). 
An example would look like this:

```yaml
root:
  one-key: 10
  another-key: David
```

When accessing indented values, you separate the levels with `.`'s. For example, the key for the "David" string would be `root.another-key`

## Creating a config.yml

By placing a `config.yml` file inside your plugin, you can specify the default values for certain settings. 
This will be located in the `resources` directory:
```
example-plugin
└── src
    └── main
        ├── java
        └── resources
            ├── config.yml
            └── plugin.yml
```

Then, when your plugin is initialised you must save this resource into the plugins data directory so that a user can edit the values. 
Here is an example of how you would do this in your plugin's `onEnable`:

```java
public class TestPlugin extends JavaPlugin {
    
    @Override
    public void onEnable() {
        saveResource("config.yml", /* replace */ false);

        // You can also use this for configuration files:
        saveDefaultConfig();
        // Where the default config.yml will be saved if it does not already exist

        // getConfig()...
    }
    
}
```

:::info[`replace` parameter]

The boolean `replace` parameter specifies whether it should replace an existing file if one exists. 
If set to true, the configuration will be overwritten on every call.

:::

## Getting and setting data

The `FileConfiguration` of the plugin can be fetched with `JavaPlugin#getConfig` once it has been saved. This will allow
data to be fetched and set with the respective `#get...(key)` and `set(key, value)`. By default, most basic data types are supported
by YAML. These can be fetched simply with `#getString` or `#getBoolean`. 

However, some more complex Bukkit data types are also supported. A few of these include `ItemStack`, `Location` and `Vector`s. 
Here is an example of loading a value from the config for teleporting a player:

:::info[Saving Configs]

Whenever setting data in configurations, you must call `FileConfiguration#save` for the changes to persist on disk

:::

```java
public class TestPlugin extends JavaPlugin {
    public void teleportPlayer(Player player) {
        Location to = getConfig().getLocation("target_location");
        player.teleport(to);
    }
}
```

This is possible as they implement `ConfigurationSerializable`. You can use this yourself, by implementing and registering a custom class.

```java
public class TeleportOptions implements ConfigurationSerializable {
    private int chunkX;
    private int chunkZ;
    private String name;
    
    public TeleportOptions(int chunkX, int chunkZ, String name) {
        // Set the values
    }
    
    public Map<String, Object> serialize() {
        Map<String, Object> data = new HashMap<>();

        data.put("chunk-x", this.chunkX);
        data.put("chunk-z", this.chunkZ);
        data.put("name", this.name);
        
        return data;
    }
    
    public static TeleportOptions deserialize(Map<String, Object> args) {
        return new TeleportOptions(
                (int) args.get("chunk-x"), 
                (int) args.get("chunk-z"), 
                (String) args.get("name")
        );
    }
}
```

Here we can see that we have an instance based `serialize` method which returns a map and then a static `deserialize` 
method that takes a Map as a parameter and then returns an instance of the `TeleportOptions` Class. Finally, for this to work we must call:
`ConfigurationSerialization.registerClass(TeleportOptions.class)`

:::warning

If you do not call `ConfigurationSerialization.registerClass` with Paper Plugins,
you will not be able to load / save your custom classes.

:::

## Custom Configuration Files

It is highly likely that you will have many different things to configure in your plugin. If you choose to split these 
across multiple different files you can still use the Bukkit `FileConfiguration` API to read the data from these. 
It is as simple as:

```java
File file = new File(plugin.getDataFolder(), "items.yml");
YamlConfiguration config = YamlConfiguration.loadConfiguration(file);
// Work with config here
config.save(file);
```

This example reads the `items.yml` file from your plugin data directory. This file must exist and an error will be thrown if it doesn't.

:::danger[Blocking I/O]

Loading and saving files on the main thread will slow your server. `load` and `save` operations should be executed asynchronously.

::: 

## Configurate

Configurate is a third party library for working with configurations maintained by the Sponge project. This project is 
used internally by Paper for our configurations and offers many features that plain YAML files do not. See their project 
[here](https://github.com/SpongePowered/Configurate) for more information.

