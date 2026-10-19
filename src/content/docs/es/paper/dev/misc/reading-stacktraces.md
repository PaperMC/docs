---
title: Lectura de trazas de pila
description: La JVM genera trazas de pila cuando se produce una excepción. Esta guía explica los conceptos básicos para leerlas.
slug: es/paper/dev/reading-stacktraces
---

## ¿Qué es una traza de pila?
En Java, una traza de pila muestra la pila de llamadas de un hilo. La pila de llamadas es la ruta de ejecución que ha llevado
al punto actual del programa.
Normalmente, la traza de pila se imprime en la consola cuando una excepción no se gestiona correctamente.

Las trazas de pila son una herramienta útil para depurar código. Muestran la línea exacta de código que causó un error,
la línea que llamó a esa línea y así sucesivamente. Esto resulta útil porque permite ver la ruta de ejecución exacta
que llevó al error.

### Ejemplo

Este es un ejemplo de una traza de pila causada por una `NullPointerException`:

```
[15:20:42 ERROR]: Could not pass event PluginEnableEvent to ExamplePlugin v1.0
java.lang.NullPointerException: Cannot invoke "Object.toString()" because "player" is null
        at ExamplePlugin.jar//com.example.paperplugin.ExamplePlugin.on(ExamplePlugin.java:21) ~[?:?]
        at org.bukkit.plugin.RegisteredListener.callEvent(RegisteredListener.java:71) ~[paper-api-26.2.build.112-stable.jar:?]
        at io.papermc.paper.plugin.manager.PaperEventManager.callEvent(PaperEventManager.java:54) ~[paper-26.2.jar:26.2-112-c9e894d]
        at io.papermc.paper.plugin.manager.PaperPluginManagerImpl.callEvent(PaperPluginManagerImpl.java:131) ~[paper-26.2.jar:26.2-112-c9e894d]
        at org.bukkit.plugin.SimplePluginManager.callEvent(SimplePluginManager.java:627) ~[paper-api-26.2.build.112-stable.jar:?]
        at io.papermc.paper.plugin.manager.PaperPluginInstanceManager.enablePlugin(PaperPluginInstanceManager.java:212) ~[paper-26.2.jar:26.2-112-c9e894d]
        at io.papermc.paper.plugin.manager.PaperPluginManagerImpl.enablePlugin(PaperPluginManagerImpl.java:109) ~[paper-26.2.jar:26.2-112-c9e894d]
        at org.bukkit.plugin.SimplePluginManager.enablePlugin(SimplePluginManager.java:519) ~[paper-api-26.2.build.112-stable.jar:?]
        at org.bukkit.craftbukkit.CraftServer.enablePlugin(CraftServer.java:633) ~[paper-26.2.jar:26.2-112-c9e894d]
        at org.bukkit.craftbukkit.CraftServer.enablePlugins(CraftServer.java:590) ~[paper-26.2.jar:26.2-112-c9e894d]
        at net.minecraft.server.dedicated.DedicatedServer.initServer(DedicatedServer.java:298) ~[paper-26.2.jar:26.2-112-c9e894d]
        at net.minecraft.server.MinecraftServer.runServer(MinecraftServer.java:1266) ~[paper-26.2.jar:26.2-112-c9e894d]
        at net.minecraft.server.MinecraftServer.lambda$spin$0(MinecraftServer.java:303) ~[paper-26.2.jar:26.2-112-c9e894d]
        at java.base/java.lang.Thread.run(Thread.java:1474) ~[?:?]
```

-   Primero, vemos que este error se produjo al gestionar un [](jd:paper:org.bukkit.event.server.PluginEnableEvent)
    mediante `ExamplePlugin`.

-   Después, en la segunda línea vemos la causa de la excepción:
    > `java.lang.NullPointerException: Cannot invoke "Object.toString()" because "player" is null`

    Esto indica que la excepción fue una [](jd:java:java.lang.NullPointerException)
    y que se produjo porque intentamos llamar al método `toString()` en un objeto «player» nulo.

-   Al avanzar por la traza de pila, podemos ver la ruta de ejecución exacta que llevó al error. En este caso,
    la siguiente línea de la traza de pila es:
    > `at ExamplePlugin.jar//com.example.paperplugin.ExamplePlugin.on(ExamplePlugin.java:21) ~[?:?]`

    Esto indica que el error se produjo en la línea 21 de `ExamplePlugin.java`.

-   Puedes seguir avanzando por la traza de pila para ver la ruta de ejecución exacta que llevó al error. En este caso,
    se trata de componentes internos del servidor, así que por lo general podemos ignorarlos.

## Trazas de pila omitidas

En JDK 5, la JVM empezó a omitir las trazas de pila de ciertas excepciones. Esto era habitual cuando la JVM había optimizado
el código y podían producirse `NullPointerException`s sin una traza de pila. Para solucionarlo, puedes pasar a la JVM la
opción `-XX:-OmitStackTraceInFastThrow`:

```bash
java -XX:-OmitStackTraceInFastThrow -jar paper.jar
```
