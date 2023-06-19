# Supporting Paper and Folia

![](/img/folia.png)

[Folia](https://github.com/PaperMC/Folia) is a fork of Paper, which is currently maintained by the PaperMC team. 
It adds the ability to split the world into regions as outlined [here](/folia/reference/overview) in more depth.

# Checking for Folia:

Depending on what platform your plugin is running on, you may need to implement features differently. For this, you can
use this utility method to check if the current server is running folia:

:::caution[[Kenny is breaking this](https://github.com/PaperMC/Paper/pull/9360/)]

There is a Paper PR in the works that will break this method

:::

```java

private static boolean isFolia() {
    try {
        Class.forName("io.papermc.paper.threadedregions.RegionizedServer");
        return true;
    } catch (ClassNotFoundException e) {
        return false;
    }
}

```

# Schedulers


