---
slug: /dev/player-chat-event
description: A guide to explain Paper's Chat Event.
---

# Player Chat Event

The `AsyncChatEvent` is fired when a player sends a chat message. This event is fired asynchronously and allows you to
make modifications to the message before it is sent to other players.

## `AsyncChatEvent`

:::danger[Thread Safety]

This event is fired asynchronously so all logic must be thread-safe.

:::

### `AsyncChatEvent#message()`

This method returns the message that the player sent. The message can be modified by calling `AsyncChatEvent#message(Component)`.
This method returns the component that the player sent, but it may have been modified by other plugins. If you want to
get the original message that the player sent, you can call `AsyncChatEvent#originalMessage()`.

### `AsyncChatEvent#signedMessage()`

This method returns the `SignedMessage` that the player has sent and contains information like the timestamp, signature 
and whether it can be deleted. To delete a message, you can call `Server#deleteMessage(SignedMessage)`. This will replace
the message in the chat with a message saying that the message has been deleted.

### `AsyncChatEvent#renderer()`

This method returns the `ChatRenderer` that will be used to render the message. You can replace this renderer by calling
`AsyncChatEvent#renderer(ChatRenderer)`. The renderer is used to render the message into a `Component` that can be sent
to the player. Here is one example of how you can use this method to replace the renderer:

```java
event.renderer((source, sourceName, message, viewer) ->
  Component.translatable("chat.type.text.narrate", sourceName, message)
));
```
This example will replace the renderer with one that will render the message as a narrated message. For example, if the
player sent the message `PaperMC`, the message would be rendered as `PlayerName says PaperMC` instead of 
`<PlayerName> PaperMC`. If you do not require the viewer, you can use a `viewerUnaware` renderer instead:

```java
event.renderer(ChatRenderer.viewerUnaware((source, sourceName, message) ->
  //...
));
```
