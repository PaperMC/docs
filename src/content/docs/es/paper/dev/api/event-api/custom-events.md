---
title: Eventos personalizados
description: Una guía que le mostrará cómo agregar eventos personalizados a su complemento.
slug: es/paper/dev/custom-events
---
Crear eventos personalizados es una excelente manera de agregar funcionalidad a su complemento. Esto permitirá que otros complementos escuchen sus eventos personalizados y agreguen funcionalidad a su complemento.

## Creando un evento personalizado

Para crear un evento personalizado, necesita crear una clase que extienda [](jd:paper:org.bukkit.event.Event). Cada evento requiere un [](jd:paper:org.bukkit.event.HandlerList) que contendrá todos los oyentes que están escuchando ese evento. La única excepción a este requisito es cuando tiene una clase de evento que no se puede activar, pero que sirve como padre para otros eventos. Un ejemplo de esto es [](jd:paper:org.bukkit.event.block.BlockPistonEvent), que no se puede escuchar directamente.

Esta lista se utiliza para llamar a los oyentes cuando se llama al evento.
:::note
Aunque `getHandlerList` no se hereda de `Event`, debe agregar un método estático `getHandlerList()` y devolver el `HandlerList` para su evento. Ambos métodos son necesarios para que su evento funcione.
:::

```java title="PaperIsCoolEvent.java"
public class PaperIsCoolEvent extends Event {

    private static final HandlerList HANDLER_LIST = new HandlerList();

    public static HandlerList getHandlerList() {
        return HANDLER_LIST;
    }

    @Override
    public HandlerList getHandlers() {
        return HANDLER_LIST;
    }
}
```
Ahora que hemos creado nuestro evento, podemos agregarle algunas funciones. Quizás esto contenga un mensaje que se transmitirá al servidor cuando se llame al evento.
```java title="PaperIsCoolEvent.java"
public class PaperIsCoolEvent extends Event {

    private static final HandlerList HANDLER_LIST = new HandlerList();
    private Component message;

    public PaperIsCoolEvent(Component message) {
        this.message = message;
    }

    public Component getMessage() {
        return this.message;
    }

    public void setMessage(Component message) {
        this.message = message;
    }

    public static HandlerList getHandlerList() {
        return HANDLER_LIST;
    }

    @Override
    public HandlerList getHandlers() {
        return HANDLER_LIST;
    }
}
```
## Llamando al evento

Ahora que hemos creado nuestro evento, podemos llamarlo.
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

    // ...

    public void callCoolPaperEvent() {
        PaperIsCoolEvent coolEvent = new PaperIsCoolEvent(Component.text("Paper is cool!"));
        coolEvent.callEvent();
        // Es posible que otros plugins hayan cambiado el mensaje en sus listeners, así que debemos obtenerlo de nuevo.
        // Esta estructura de eventos permite que otros plugins cambien el mensaje a su gusto.
        // Por ejemplo, un plugin que añade un prefijo a todos los mensajes.
        Bukkit.broadcast(coolEvent.getMessage());
    }
}
```
## Implementación de cancelación

Si desea permitir que se cancele su evento, puede implementar la interfaz `Cancellable`.
```java title="PaperIsCoolEvent.java"
public class PaperIsCoolEvent extends Event implements Cancellable {

    private static final HandlerList HANDLER_LIST = new HandlerList();
    private Component message;
    private boolean cancelled;

    // ...

    @Override
    public boolean isCancelled() {
        return this.cancelled;
    }

    @Override
    public void setCancelled(boolean cancel) {
        this.cancelled = cancel;
    }
}
```
Ahora, cuando se convoque el evento, podrás comprobar si está cancelado y actuar en consecuencia.
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

    // ...

    public void callCoolPaperEvent() {
        PaperIsCoolEvent coolEvent = new PaperIsCoolEvent(Component.text("Paper is cool!"));
        coolEvent.callEvent();
        if (!coolEvent.isCancelled()) {
            Bukkit.broadcast(coolEvent.getMessage());
        }
    }
}
```
Cuando un evento se puede cancelar, [](jd:paper:org.bukkit.event.Event#callEvent()) devolverá falso si el evento fue cancelado. Esto le permite usar directamente `callEvent` en su declaración `if`, en lugar de tener que verificar [](jd:paper:org.bukkit.event.Cancellable#isCancelled()) manualmente.
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

    // ...

    public void callCoolPaperEvent() {
        PaperIsCoolEvent coolEvent = new PaperIsCoolEvent(Component.text("Paper is cool!"));
        if (coolEvent.callEvent()) { // Obtiene directamente el resultado de callEvent
            Bukkit.broadcast(coolEvent.getMessage());
        }
    }
}
```
