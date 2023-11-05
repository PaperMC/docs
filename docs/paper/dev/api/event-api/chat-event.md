---
slug: /dev/chat-events
description: An outline on the AsyncChatEvent and how to handle it 
---

# Chat Events

The Chat Event has evolved a few times over the years. 
This guide will explain how to properly use the new `AsyncChatEvent` and its `ChatRenderer`.
The `AsyncChatEvent` is an improved version of the old `AsyncPlayerChatEvent` that allows you to render chat messages individually for each player.

:::note

#### AsyncChatEvent vs ChatEvent

The key difference between the `AsyncChatEvent` and the `ChatEvent` is that the `AsyncChatEvent` is fired asynchronously 
which means that it does not block the main thread and delays the chat message.
Be aware that using the Bukkit API in the event might cause errors. 
If you need to use the Bukkit API, use the `ChatEvent` instead.
Alternatively you can use the [`BukkitScheduler`](../scheduler.md).

:::

## Understanding the renderer

Before we can start using the new chat event, we need to understand how the new renderer works.
The renderer is Paper's way of allowing plugins to modify the chat message before it is sent to the player.
This is done by using the `ChatRenderer` interface with its `render` method. Previously, this was done by using the `AsyncPlayerChatEvent` with its `setFormat` method.

```java title="ChatRenderer#render"
public @NotNull Component render(@NotNull Player source, @NotNull Component sourceDisplayName, @NotNull Component message, @NotNull Audience viewer) {
    // ...
}
```

- The `render` method is called when a chat message is sent to the player.
- The `source` parameter is the player that sent the message.
- The `sourceDisplayName` parameter is the display name of the player that sent the message.
- The `message` parameter is the message that was sent.
- The `viewer` parameter is the player that is receiving the message.

:::tip

#### ChatRenderer.ViewerUnaware

If your renderer does not need to know about the viewer, you can use the `ChatRenderer.ViewerUnaware` interface instead of the `ChatRenderer` interface. 
This will benefit performance as the message will only be rendered once instead of once for each viewer.

:::

Now that we understand how the renderer works, we can start using it.

## Using the renderer

There are two ways to use the renderer.
1. Implementing the `ChatRenderer` interface in a class.
2. Using a lambda expression.

Depending on the complexity of your renderer you may want to use one or the other.

### Implementing the ChatRenderer interface

The first way of using the renderer is by implementing the `ChatRenderer` interface in a class.
In this example, we will be using our ChatListener class. 
Next, we need to tell the event to use the renderer by using the `renderer` method.

```java title="ChatListener.java"
public class ChatListener implements Listener, ChatRenderer { // Implement the ChatRenderer and Listener interface

    // Listen for the AsyncChatEvent
    @EventHandler
    public void onChat(AsyncChatEvent event) { 
        event.renderer(this); // Tell the event to use our renderer
    }
    
    // Override the render method
    @Override
    public @NotNull Component render(@NotNull Player source, @NotNull Component sourceDisplayName, @NotNull Component message, @NotNull Audience viewer) {
        // ...
    }
    
}
```

:::note

If you decide to create a separate class for your renderer, it is important to know that you don't need to instantiate the class every time the event is called.
In this case you can use the singleton pattern to create a single instance of the class.

:::

### Using a lambda expression

Another way of using the renderer is by using a lambda expression.

```java title="ChatListener.java"
public class ChatListener implements Listener {

    @EventHandler
    public void onChat(AsyncChatEvent event) {
        event.renderer((source, sourceDisplayName, message, viewer) -> {
            // ...
        });
    }

}
```

## Rendering the message

Now that we have our renderer, we can start rendering the message.

Let's say we want to render our chat to look like this:

![](./assets/plain-message-rendering.png)

To do this, we need to return a new `Component` that contains the message we want to send.

```java title="ChatListener.java"
public class ChatListener implements Listener, ChatRenderer {

    @Override
    public @NotNull Component render(@NotNull Player source, @NotNull Component sourceDisplayName, @NotNull Component message, @NotNull Audience viewer) {
        return sourceDisplayName 
                .append(Component.text(": ")) 
                .append(message); 
    }

}
```

Now you can see that the message is rendered as we wanted it to be.

## Conclusion

That is all you need to know about the new chat event and its renderer. 
Of course there are many more things you can do with Components in general. 
If you want to learn more about Components, you can read the [Component Documentation](https://docs.advntr.dev/text.html).
