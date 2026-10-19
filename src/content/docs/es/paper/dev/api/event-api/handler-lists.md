---
title: Listas de controladores
description: Una explicación de qué es HandlerList de un evento.
slug: es/paper/dev/handler-lists
---
Cada [](jd:paper:org.bukkit.event.Event) que se puede escuchar tiene un [](jd:paper:org.bukkit.event.HandlerList) que contiene todos los oyentes que están escuchando ese evento. Esta lista se utiliza para llamar a los oyentes cuando se llama al evento.

## Obtener la lista de controladores para un evento

Para obtener la lista de controladores de un evento, puede llamar al `getHandlerList()` en la clase de evento específica.
```java title="ExampleListener.java"
public class ExampleListener implements Listener {

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        HandlerList handlerList = event.getHandlerList();
        // ...
    }

    // O bien:

    public ExampleListener() {
        // Accede a la lista de handlers mediante el getter estático.
        HandlerList handlerList = PlayerJoinEvent.getHandlerList();
        // ...
    }
}
```
## Dar de baja a un oyente

Para cancelar el registro de un oyente, puede llamar al `unregister()` al `HandlerList` en el que está registrado el oyente.
```java title="ExampleListener.java"
public class ExampleListener implements Listener {

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        HandlerList handlerList = event.getHandlerList();
        handlerList.unregister(this);
        // ...
    }

    // O bien:

    public ExampleListener() {
        // Accede a la lista de handlers mediante el getter estático.
        HandlerList handlerList = PlayerJoinEvent.getHandlerList();
        handlerList.unregister(this);
        // Es cierto que este ejemplo es bastante absurdo...
    }
}
```
Puede cancelar el registro según [](jd:paper:org.bukkit.event.Listener) o [](jd:paper:org.bukkit.plugin.Plugin) para mayor comodidad. Del mismo modo, también puede cancelar el registro de todos los oyentes para un evento específico llamando a [`unregisterAll()`](jd:paper:org.bukkit.event.HandlerList#unregisterAll()) al `HandlerList`.
