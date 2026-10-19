---
title: Oyentes
description: Guía para desarrolladores sobre cómo escuchar los eventos transmitidos.
slug: es/paper/dev/event-listeners
---
Los eventos son una forma eficaz de escuchar acciones específicas que suceden en el juego. Pueden ser llamados por el servidor o mediante complementos. Estos son llamados por el servidor o los complementos cuando sucede algo, como que un jugador se una al servidor o se rompa un bloque. Los complementos pueden llamar eventos personalizados, como que un jugador complete una misión, para que otros complementos los escuchen.

## Tu clase de oyente

Para escuchar eventos, necesita crear una clase que implemente [](jd:paper:org.bukkit.event.Listener). Esta clase puede llamarse como desee, pero se recomienda asignarle un nombre relacionado con los eventos que está escuchando.
```java title="ExampleListener.java"
public class ExampleListener implements Listener {
    // ...
}
```
## `@EventHandler`

Para escuchar un evento, necesita crear un método anotado con [`@EventHandler`](jd:paper:org.bukkit.event.EventHandler). Este método puede tener el nombre que desee, pero se recomienda asignarle un nombre significativo relacionado con el evento que está escuchando.

## El método del oyente

El cuerpo del método no necesita devolver ningún dato; por este motivo, utilice void como tipo de devolución. Los oyentes toman un único parámetro, que es el evento que se está escuchando.
```java title="ExampleListener.java"
public class ExampleListener implements Listener {

    @EventHandler
    public void onPlayerMove(PlayerMoveEvent event) {
        // ...
    }
}
```

:::note[Eventos]
No hay una lista de eventos que se puedan escuchar, sin embargo, eche un vistazo [aquí](jd:paper:org.bukkit.event.Event) para ver todas las clases que extienden `Event`.

Un evento sólo se puede escuchar si tiene un método estático `getHandlerList`.
:::
## Registrar al oyente

Para registrar al oyente, debe llamar al `Bukkit.getPluginManager().registerEvents()` y pasar la instancia de su clase de oyente y una instancia de su complemento.

Esto registrará su clase de oyente y le permitirá escuchar eventos. Esto se hace comúnmente en el método `onEnable()` de su complemento para que quede registrado cuando el servidor comience a funcionar.
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        this.getServer().getPluginManager().registerEvents(new ExampleListener(), this);
    }
}
```
## Prioridad del evento

También puede especificar la prioridad del evento.
```java title="ExampleListener.java"
public class ExampleListener implements Listener {

    @EventHandler(priority = EventPriority.HIGH)
    public void onPlayerMove(PlayerMoveEvent event) {
        // ...
    }
}
```
Hay seis prioridades diferentes que puedes utilizar:
- [`EventPriority.LOWEST`](jd:paper:org.bukkit.event.EventPriority#LOWEST)
- [`EventPriority.LOW`](jd:paper:org.bukkit.event.EventPriority#LOW)
- [`EventPriority.NORMAL`](jd:paper:org.bukkit.event.EventPriority#NORMAL)
- [`EventPriority.HIGH`](jd:paper:org.bukkit.event.EventPriority#HIGH)
- [`EventPriority.HIGHEST`](jd:paper:org.bukkit.event.EventPriority#HIGHEST)
- [`EventPriority.MONITOR`](jd:paper:org.bukkit.event.EventPriority#MONITOR)

El orden de las prioridades es algo contrario a la intuición. Cuanto **mayor** sea la prioridad, **más tarde** se llamará al evento. Por ejemplo, si es importante que su complemento tenga la última palabra en un evento determinado (para evitar que se modifique), debe usar `EventPriority.HIGHEST`.
:::note
La prioridad `MONITOR` se utiliza para monitorear el evento, pero no para cambiarlo. Se convoca después de que se hayan convocado todas las demás prioridades. Esto significa que puede obtener el resultado de cualquier interacción del complemento, como cancelación o modificación.
:::
## Cancelación de evento

Algunos eventos se pueden cancelar, impidiendo que se complete la acción determinada. Estos eventos implementan [](jd:paper:org.bukkit.event.Cancellable).
```java title="ExampleListener.java"
public class ExampleListener implements Listener {

    @EventHandler
    public void onPlayerMove(PlayerMoveEvent event) {
        event.setCancelled(true);
    }
}
```

:::caution
Es importante tener en cuenta que otro complemento podría haber cancelado o cambiado el evento antes de que se llamara su complemento. Siempre verifique el evento antes de hacer algo con él.
:::
El ejemplo anterior cancelará el evento, lo que significa que el jugador no podrá moverse. Una vez que se cancela un evento, continuará llamando a otros oyentes para ese evento a menos que agreguen `ignoreCancelled = true` a la anotación `@EventHandler` para ignorar los eventos cancelados.
```java title="ExampleListener.java"
public class ExampleListener implements Listener {

    @EventHandler(ignoreCancelled = true)
    public void onPlayerMove(PlayerMoveEvent event) {
        // ...
    }
}
```
