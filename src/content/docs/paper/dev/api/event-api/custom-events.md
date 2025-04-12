---
title: Custom events
description: A guide to show you how to add custom events to your plugin.
slug: paper/dev/custom-events
---

Creating custom events is a great way to add functionality to your plugin.
This will allow other plugins to listen to your custom events and add functionality to your plugin.

## Creating a custom event

To create a custom event, you need to create a class that extends [`Event`](jd:paper:org.bukkit.event.Event).
Each event requires a [`HandlerList`](jd:paper:org.bukkit.event.HandlerList) that will contain all the listeners that are listening to that event.
The only exception to this requirement is when you have an event class that cannot be fired, but serves as a parent for other events instead.
An example of this is [`BlockPistonEvent`](jd:paper:org.bukkit.event.block.BlockPistonEvent), which cannot be listened to directly.

This list is used to call the listeners when the event is called.

:::note

Although `getHandlerList` is not inherited from `Event`, you need to add a static `getHandlerList()` method and return the `HandlerList` for your event.
Both methods are required for your event to work.

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

Now that we have created our event, we can add some functionality to it.
Perhaps this will contain a message that will be broadcast to the server when the event is called.

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

## Calling the event

Now that we have created our event, we can call it.

```java title="ExamplePlugin.java"
public class ExamplePlugin extends JavaPlugin {

    // ...

    public void callCoolPaperEvent() {
        PaperIsCoolEvent coolEvent = new PaperIsCoolEvent(Component.text("Paper is cool!"));
        coolEvent.callEvent();
        // Plugins could have changed the message from inside their listeners here. So we need to get the message again.
        // This event structure allows for other plugins to change the message to their taste.
        // Like, for example, a plugin that adds a prefix to all messages.
        Bukkit.broadcast(coolEvent.getMessage());
    }
}
```

## Implementing cancellation

If you want to allow your event to be cancelled, you can implement the `Cancellable` interface.

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
    public void setCancelled(boolean cancelled) {
        this.cancelled = cancelled;
    }
}
```

Now, when the event is called, you can check if it is cancelled and act accordingly.

```java title="ExamplePlugin.java"
public class ExamplePlugin extends JavaPlugin {

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

When an event is cancellable, [`Event#callEvent()`](jd:paper:org.bukkit.event.Event#callEvent())
will return false if the event was cancelled. This allows you to directly use `callEvent` in your `if` statement,
instead of having to check [`Cancellable#isCancelled()`](jd:paper:org.bukkit.event.Cancellable#isCancelled()) manually.

```java title="ExamplePlugin.java"
public class ExamplePlugin extends JavaPlugin {

    // ...

    public void callCoolPaperEvent() {
        PaperIsCoolEvent coolEvent = new PaperIsCoolEvent(Component.text("Paper is cool!"));
        if (coolEvent.callEvent()) { // Directly get the output from callEvent
            Bukkit.broadcast(coolEvent.getMessage());
        }
    }
}
```
