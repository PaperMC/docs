---
title: Handler lists
description: An explanation to what an event's HandlerList is.
slug: paper/dev/handler-lists
---

Every [`Event`](jd:paper:org.bukkit.event.Event) that can be listened to has a
[`HandlerList`](jd:paper:org.bukkit.event.HandlerList) containing all the listeners that are listening to that event.
This list is used to call the listeners when the event is called.

## Getting the handler list for an event

To get the handler list for an event, you can call `getHandlerList()` on the specific event class.

```java title="ExampleListener.java"
public class ExampleListener implements Listener {

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        HandlerList handlerList = event.getHandlerList();
        // ...
    }

    // Or:

    public ExampleListener() {
        // Access the handler list through the static getter
        HandlerList handlerList = PlayerJoinEvent.getHandlerList();
        // ...
    }
}
```

## Unregistering a listener

To unregister a listener, you can call `unregister()` on the `HandlerList` that the listener is registered to.

```java title="ExampleListener.java"
public class ExampleListener implements Listener {

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        HandlerList handlerList = event.getHandlerList();
        handlerList.unregister(this);
        // ...
    }

    // Or:

    public ExampleListener() {
        // Access the handler list through the static getter
        HandlerList handlerList = PlayerJoinEvent.getHandlerList();
        handlerList.unregister(this);
        // Granted this is a pretty stupid example...
    }
}
```

You can unregister based on [`Listener`](jd:paper:org.bukkit.event.Listener)
or [`Plugin`](jd:paper:org.bukkit.plugin.Plugin) for more convenience.
Likewise, you can also unregister all listeners for a specific event by calling
[`unregisterAll()`](jd:paper:org.bukkit.event.HandlerList#unregisterAll()) on the `HandlerList`.
