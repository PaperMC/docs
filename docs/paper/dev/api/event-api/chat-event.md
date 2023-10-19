---
slug: /dev/chat-events
description: How to properly use the new AsyncChatEvent 
---

# Chat Events
The chat event has evolved a couple of times over the years. 
This guide will explain how to properly use the new `AsyncChatEvent` and its `Renderer`.

## Understanding the Renderer

Before we can start using the new chat event, we need to understand how the new renderer works.
The renderer is Paper's way of allowing plugins to modify the chat message before it is sent to the player.
This is done by using the `ChatRenderer` interface with its `render` method.

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

Now that we understand how the renderer works, we can start using it.

## Using the Renderer

There are two ways to use the renderer.
1. Creating a new Class that implements `ChatRenderer`. 
2. Using a lambda expression.

Depending on the complexity of your renderer you may want to use one or the other.

### Creating a new Class

If you want to use a class for your renderer, you just need to implement the `ChatRenderer` interface.

```java title="ExampleRenderer.java"
public class ExampleRenderer implements ChatRenderer {

    @Override
    public @NotNull Component render(@NotNull Player source, @NotNull Component sourceDisplayName, @NotNull Component message, @NotNull Audience viewer) {
        // ...
    }

}
```

To be able to use this renderer, we need to tell the event to use it.

```java title="ChatEvent.java"
public class ChatEvent implements Listener {

    @EventHandler
    public void onChat(AsyncChatEvent event) {
        event.renderer(new ExampleRenderer());
    }

}
```

### Using a lambda expression

Another way of using the renderer is by using a lambda expression.

```java title="ChatEvent.java"
public class ChatEvent implements Listener {

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

```java title="ExampleRenderer.java"
public class ExampleRenderer implements ChatRenderer {

    @Override
    public @NotNull Component render(@NotNull Player source, @NotNull Component sourceDisplayName, @NotNull Component message, @NotNull Audience viewer) {
        return sourceDisplayName 
                .append(Component.text(": ")) 
                .append(message); 
    }

}
```

Now you can see that the message is rendered as we wanted it to be.

## Rendering the message with a prefix using LuckPerms and MiniMessage

Usually, you would want to add a prefix to the message. 
In this example, we will be using LuckPerms to get the players prefix.
Let's say we want to render our chat to look like this:
![img.png](assets/prefix-rendering.png)

This process is a bit more complex than the previous one.
For this we create our `admin` group and add a prefix to it:

- /lp creategroup admin

- /lp group admin meta addprefix 100 "`<gray>[</gray><red>Admin</red><gray>]</gray>`"

To get the prefix of the player, we need to use the `User` class from LuckPerms to access the cached data of the player.
We can then use the `MetaData` class to get the prefix of the player and deserialize it using `MiniMessage`.

::: info

`MiniMessage` is a library that allows you to serialize and deserialize `Component` to and from a string using 
readable html tags. You can read more about it [here](https://docs.advntr.dev/minimessage.html).

:::

```java title="ExampleRenderer.java"
public class ExampleRenderer implements ChatRenderer {

    @Override
    public @NotNull Component render(@NotNull Player source, @NotNull Component sourceDisplayName, @NotNull Component message, @NotNull Audience viewer) {
        User user = LuckPermsProvider.get().getPlayerAdapter(Player.class).getUser(source);
        String prefixString = user.getCachedData().getMetaData().getPrefix();
        Component prefix = MiniMessage.miniMessage().deserialize(prefixString);

        return prefix.append(Component.space())
                .append(sourceDisplayName)
                .append(Component.text(": "))
                .append(message);
    }

}
```

## Conclusion

That is all you need to know about the new chat event and its renderer. 
Of course there are many more things you can do with Component in general. 
If you want to learn more about Component, you can read the [Component Documentation](https://docs.advntr.dev/text.html).
